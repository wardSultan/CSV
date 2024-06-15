import React, { useState } from "react";
import axios from "axios";
import { Button, Typography, Paper, Snackbar } from "@mui/material";

const FileUpload = ({ onUploadProgress }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/csv/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress(progress);
            onUploadProgress(progress);
          },
        }
      );
      console.log("File uploaded successfully: ", response.data);
      setUploadComplete(true);
    } catch (error) {
      console.error("Error uploading file: ", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setUploadComplete(false);
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "400px" }}>
      <Typography variant="h5" gutterBottom>
        File Upload
      </Typography>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          color="primary"
          component="span"
          style={{ marginBottom: "10px", textTransform: "none" }}
        >
          Choose File
        </Button>
      </label>
      <Button
        variant="contained"
        color="primary"
        onClick={handleFileUpload}
        disabled={!file || uploading}
        style={{ marginLeft: "10px", marginBottom: "10px" }}
      >
        Upload
      </Button>
      {uploading && (
        <div style={{ marginTop: "10px", width: "100%" }}>
          <div
            style={{
              height: "8px",
              backgroundColor: "#1976d2",
              width: `${progress}%`,
              transition: "width 0.9s linear",
            }}
          ></div>
        </div>
      )}
      {uploadComplete && (
        <Snackbar
          open={uploadComplete}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="File uploaded successfully!"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          style={{ backgroundColor: "#1976d2" }}
        />
      )}
      {!file && !uploading && !uploadComplete && (
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          Please select a file
        </Typography>
      )}
    </Paper>
  );
};

export default FileUpload;
