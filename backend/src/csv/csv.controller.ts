import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CsvService } from './csv.service';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return cb(new Error('Only .csv files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new Error('File is not uploaded!');
    }
    const data = await this.csvService.parseCsv(file.path);
    const analysis = await this.csvService.analyzeData(file.path);
    this.csvService.setData(data);
    return {
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
      data: data,
      analysis: analysis.analysis,
    };
  }

  @Get('data')
  getData() {
    return {
      data: this.csvService.getData(),
      analysis: this.csvService.getAnalysisMessage(),
    };
  }

  @Post('chatWithData')
  async chatWithData(
    @Body() body: { chatHistory: { role: string; content: string }[] },
  ) {
    return await this.csvService.chatWithData(body.chatHistory);
  }
}
