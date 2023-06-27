import { Grid, Paper, Typography } from "@mui/material";

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
            <Paper elevation={4} sx={{ padding: 2 }}>
                {icon}
                <Typography variant="h6" component="h2" sx={{ marginTop: 2 }}>
                    {title}
                </Typography>
                <Typography variant="body2">{description}</Typography>
            </Paper>
        </Grid>
    );
}
