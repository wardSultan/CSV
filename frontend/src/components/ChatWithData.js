import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Container,
  Typography,
  Paper,
  Box,
} from "@mui/material";

const ChatWithData = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialAnalysis, setInitialAnalysis] = useState("");

  useEffect(() => {
    const fetchInitialAnalysis = async () => {
      try {
        const response = await axios.get("http://localhost:3000/csv/data");
        const analysisMessage =
          response.data.analysis || "No analysis available";
        setInitialAnalysis(analysisMessage);
        setChatHistory([
          { role: "system", content: analysisMessage[0].content },
        ]);
      } catch (error) {
        console.error("Error fetching initial analysis: ", error);
      }
    };

    fetchInitialAnalysis();
  }, []);

  const handleSendMessage = async () => {
    setMessage("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/csv/chatWithData",
        {
          chatHistory: [...chatHistory, { role: "user", content: message }],
        }
      );

      setChatHistory([
        ...chatHistory,
        { role: "user", content: message },
        { role: "system", content: response.data },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Chat with Data
        </Typography>
        <Box
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            marginBottom: "20px",
          }}
        >
          {chatHistory.map((msg, index) => (
            <Typography key={index} variant="body1">
              <strong>{msg.role}:</strong> {msg.content}
            </Typography>
          ))}
        </Box>
        {isLoading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}
        <TextField
          id="msg"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here"
          fullWidth
          disabled={isLoading}
          variant="outlined"
          style={{ marginBottom: "10px" }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading}
          variant="contained"
          color="primary"
          fullWidth
        >
          Send
        </Button>
      </Paper>
    </Container>
  );
};

export default ChatWithData;
