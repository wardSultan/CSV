import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, makeStyles } from "@material-ui/core";

import Sidebar from "./components/Sidebar";
import FileUpload from "./components/FileUpload";
import DataDisplay from "./components/DataDisplay";
import ChatWithData from "./components/ChatWithData";
import ChartWithData from "./components/ChartWithData";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: 0,
    marginTop: theme.spacing(8),
    [theme.breakpoints.up("sm")]: {
      marginLeft: drawerWidth,
    },
  },
}));

const App = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [open, setOpen] = useState(false);

  const handleUploadProgress = (progressEvent) => {};

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/csv/data");
      setData(response.data.data);
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <div>
        <CssBaseline />
        <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
        <main className={classes.content}>
          <Routes>
            <Route
              path="/"
              element={<FileUpload onUploadProgress={handleUploadProgress} />}
            />
            <Route path="/data" element={<DataDisplay data={data} />} />
            <Route path="/chat" element={<ChatWithData />} />
            <Route path="/chart" element={<ChartWithData data={data} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
