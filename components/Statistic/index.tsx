import { Box, Grid, Paper, Typography } from "@mui/material";

export default function GridItem({
    icon,
    title,
    description,
}: {
    icon: JSX.Element;
    title: string;
    description: string | number;
}) {
    return (
        <Grid item xs={12} sm={6}>
            <Paper elevation={4} sx={{ padding: 2, display: "flex", alignItems: "center", gap: 2 }}>
                {icon}
                <Box>
                    <Typography variant="body2" component="h2">
                        {title}
                    </Typography>
                    <Typography variant="h6" component="p">
                        {description}
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );
}
