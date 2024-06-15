import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class CsvService {
  private openai: OpenAI;
  private analysisMessage: { role: string; content: string }[] = [];

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  private data: any[] = [];

  async parseCsv(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          this.data = results;
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async analyzeData(filePath: string): Promise<any> {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            const completion = await this.openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                { role: 'system', content: 'Analyze the following CSV data.' },
                { role: 'user', content: JSON.stringify(results) },
              ],
              max_tokens: 1000,
            });
            const analysis = completion.choices[0].message.content;
            this.analysisMessage = [{ role: 'system', content: analysis }];
            resolve({ data: results, analysis });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => reject(error));
    });
  }

  async chatWithData(
    chatHistory: { role: string; content: string }[],
  ): Promise<any> {
    if (!this.data.length) {
      throw new InternalServerErrorException('No data available for chat.');
    }

    const messages = [...this.analysisMessage, ...chatHistory];

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as [],
        max_tokens: 1000,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error during chat with data',
        error.message,
      );
    }
  }

  setData(data: any[]) {
    this.data = data;
  }

  getData(): any[] {
    return this.data;
  }

  getAnalysisMessage(): { role: string; content: string }[] {
    return this.analysisMessage;
  }
}
