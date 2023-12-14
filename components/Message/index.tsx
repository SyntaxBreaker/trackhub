import { Box, Typography } from "@mui/material";
import { IMessage } from "../../types/chat";
import Image from "next/image";

function Message({ message }: { message: IMessage }) {
  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      <Image
        src={message.authorAvatar}
        width={32}
        height={32}
        style={{ borderRadius: "50%" }}
        alt="Avatar"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          maxWidth: "75%",
        }}
      >
        <Typography variant="subtitle1" component="h2">
          {message.authorName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            padding: 1,
            borderRadius: "4px",
            backgroundColor: "#f5f5f5",
          }}
        >
          {message.text}
        </Typography>
      </Box>
    </Box>
  );
}

export default Message;
