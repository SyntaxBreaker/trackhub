import {
  Box,
  Button,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { IMessage } from "../../types/chat";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { SyntheticEvent, useEffect, useState } from "react";
import MessageMenu from "../MessageMenu";
import axios from "axios";
import { IAlertStatus } from "../../types/alertStatus";
import { useUser } from "@auth0/nextjs-auth0/client";

function Message({
  message,
  setAlertStatus,
}: {
  message: IMessage;
  setAlertStatus: React.Dispatch<React.SetStateAction<IAlertStatus | null>>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState<null | string>(null);

  const { user } = useUser();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditMessage = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      if (updatedMessage?.length === 0) return;
      handleClose();
      setIsEditing(false);
      const { data } = await axios.patch(`/api/chat/edit`, {
        message: updatedMessage,
        id: message.id,
      });
      setAlertStatus({ status: "success", message: data.message });
    } catch (err: any) {
      setAlertStatus({ status: "error", message: err.message });
    }
  };

  useEffect(() => {
    message.text && setUpdatedMessage(message.text);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: user?.email === message.authorId ? "row-reverse" : "row",
        gap: 1.5,
      }}
    >
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
        {isEditing ? (
          <FormControl
            component="form"
            sx={{ display: "flex", gap: 1 }}
            onSubmit={handleEditMessage}
          >
            <TextField
              value={updatedMessage}
              onChange={(e) => setUpdatedMessage(e.target.value)}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={updatedMessage?.length === 0}
            >
              Edit message
            </Button>
          </FormControl>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              flexDirection:
                user?.email === message.authorId ? "row-reverse" : "row",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                backgroundColor:
                  user?.email === message.authorId ? "#1976d2" : "#f5f5f5",
                padding: 1,
                borderRadius: "4px",
              }}
            >
              <Typography
                variant="subtitle1"
                component="h2"
                color={user?.email === message.authorId ? "white" : "black"}
                sx={{ fontWeight: "bold" }}
              >
                {message.authorName}
              </Typography>
              <Typography
                variant="body2"
                color={user?.email === message.authorId ? "white" : "black"}
              >
                {message.text}
              </Typography>
            </Box>
            {user?.email === message.authorId && (
              <IconButton size="small" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
      <MessageMenu
        anchorEl={anchorEl}
        message={message}
        handleClose={handleClose}
        setIsEditing={setIsEditing}
        setAlertStatus={setAlertStatus}
      />
    </Box>
  );
}

export default Message;
