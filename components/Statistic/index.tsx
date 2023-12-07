import { Box, Grid, Paper, Typography } from "@mui/material";

export default function Statistic({
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
      <Paper
        variant="outlined"
        sx={{
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {icon}
        <Box>
          <Typography variant="body2" component="h2" color="grey.600">
            {title}
          </Typography>
          <Typography variant="h6" component="p" textAlign="right">
            {description}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}
