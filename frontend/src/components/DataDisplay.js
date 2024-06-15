import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const DataDisplay = ({ data }) => {
  useEffect(() => {}, [data]);

  if (!data) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <Typography variant="body1">No data available</Typography>;
  }

  return (
    <TableContainer component={Paper} style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ padding: "20px" }}>
        Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(data[0]).map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((value, i) => (
                <TableCell key={i}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataDisplay;
