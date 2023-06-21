import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

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

    useEffect(() => {
        if (typeof localStorage != "undefined") {
            const item = localStorage.getItem(id);

            if (item !== null) {
                setDuration(JSON.parse(item));
            }
        } else {
            setDuration(0);
        }
    }, []);

    const secondsToDhms = (time: number) => {
        let d = Math.floor(time / (3600 * 24));
        let h = Math.floor((time % (3600 * 24)) / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = Math.floor(time % 60);

        let dDisplay = d > 0 ? d + "D " : "";
        let hDisplay = h > 0 ? h + "H " : "";
        let mDisplay = m > 0 ? m + "M " : "";
        let sDisplay = s > 0 ? s + "S" : "";

        return dDisplay + hDisplay + mDisplay + sDisplay;
    };

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
