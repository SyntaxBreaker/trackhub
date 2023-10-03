import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { secondsToDhms } from "../../utils/time";

export default function Timer({
  id,
  duration,
  setDuration,
  handleSubmit,
}: {
  id: string;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  handleSubmit: (e: React.SyntheticEvent) => void;
}) {
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isStarted) {
      timer = setInterval(() => {
        setDuration((duration) => duration + 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);

      duration > 0 && localStorage.setItem(id, JSON.stringify(duration));
    };
  }, [isStarted]);

  return (
    <Box sx={{ marginTop: 1, textAlign: "center" }}>
      <Typography variant="h6">{secondsToDhms(duration)}</Typography>
      <Box sx={{ marginTop: 1, display: "flex", gap: 1, justifyContent: "center" }}>
        <Button variant="outlined" onClick={() => setIsStarted(true)}>
          Start timer
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={(e) => {
            setIsStarted(false);
            handleSubmit(e);
          }}
        >
          Stop timer
        </Button>
      </Box>
    </Box>
  );
}
