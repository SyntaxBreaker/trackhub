import { Box, IconButton, Typography } from "@mui/material";
import { IMessage } from "../../types/chat";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import MessageMenu from "../MessageMenu";

function Message({ message }: { message: IMessage }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

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
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography variant="subtitle1" component="h2">
            {message.authorName}
          </Typography>
          <IconButton size="small" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Typography
          variant="body2"
          sx={{
            padding: 1,
            borderRadius: "4px",
            backgroundColor: "#f5f5f5",
            color: "black",
          }}
        >
          {message.text}
        </Typography>
      </Box>
      <MessageMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        message={message}
      />
    </Box>
  );
}

export default Message;
