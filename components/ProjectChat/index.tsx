import {
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { IChat } from "../../types/chat";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import Message from "../Message";

function ProjectChat({ chat }: { chat: IChat }) {
  const [message, setMessage] = useState("");

  const projectTitle = chat.Project.name;
  const messages = chat.messages;

  const { user } = useUser();

  const addMessage = async (e: SyntheticEvent) => {
    e.preventDefault();

    const data = {
      authorId: user?.email,
      authorName: user?.nickname,
      authorAvatar: user?.picture,
      text: message,
      chatId: chat.id,
    };

    axios
      .patch("/api/chat/create", {
        ...data,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setMessage("");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper
        elevation={2}
        sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}
      >
        <Typography variant="h5" component="h1" textAlign="center">
          {projectTitle}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {messages.map((message) => (
            <Message message={message} key={message.id} />
          ))}
        </Box>
        <FormControl
          component="form"
          sx={{ display: "flex", gap: 1 }}
          onSubmit={addMessage}
        >
          <TextField
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </FormControl>
      </Paper>
    </Box>
  );
}

export default ProjectChat;
