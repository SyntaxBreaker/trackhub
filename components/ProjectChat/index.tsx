import {
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { IChat } from "../../types/chat";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import Message from "../Message";

function ProjectChat({ chat }: { chat: IChat }) {
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<IChat | null>(null);

  const projectTitle = chat.Project.name;
  const messages = conversations?.messages;

  const { user } = useUser();
  const ref = useRef<HTMLDivElement | null>(null);

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
      .then(() => {
        getConversations();
      })
      .catch((err) => {
        console.log(err);
      });

    setMessage("");
  };

  const getConversations = async () => {
    let { data } = await axios.get(`/api/chat/${chat.Project.id}`);
    setConversations(data.chat);
  };

  useEffect(() => {
    ref.current?.lastElementChild?.scrollIntoView();
    const interval = setInterval(getConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
          height: "calc(100vh - 192px)",
        }}
      >
        <Typography variant="h5" component="h1" textAlign="center">
          {projectTitle}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
          }}
          ref={ref}
        >
          {(messages ?? chat.messages).map((message) => (
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
