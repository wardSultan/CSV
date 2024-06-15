import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button, Typography } from "@mui/material";

const ChartComponent = () => {
  const [data, setData] = useState([
    { name: "January", value: 65 },
    { name: "February", value: 59 },
    { name: "March", value: 80 },
    { name: "April", value: 81 },
    { name: "May", value: 56 },
    { name: "June", value: 55 },
    { name: "July", value: 40 },
  ]);

  const updateChartData = () => {
    const newData = data.map((item) => ({
      ...item,
      value: Math.floor(Math.random() * 100),
    }));
    setData(newData);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Line Chart
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <Button variant="contained" color="primary" onClick={updateChartData}>
        Update Data
      </Button>
    </div>
  );
};

export default ChartComponent;
