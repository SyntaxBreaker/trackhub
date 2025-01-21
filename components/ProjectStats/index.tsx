import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { secondsToDhms } from "../../utils/time";
import { IStatsPerProject } from "../../types/project";

export default function ProjectStats({
  statsPerProject,
}: {
  statsPerProject: IStatsPerProject;
}) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mt: 4 }}>
      <Table aria-label="Project Statistics">
        <TableHead sx={{ backgroundColor: "primary.main" }}>
          <TableRow>
            <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>
              Project name
            </TableCell>
            <TableCell
              align="left"
              sx={{ color: "primary.contrastText", fontWeight: 600 }}
            >
              Completed tasks
            </TableCell>
            <TableCell
              align="left"
              sx={{ color: "primary.contrastText", fontWeight: 600 }}
            >
              Total time
            </TableCell>
            <TableCell
              align="left"
              sx={{ color: "primary.contrastText", fontWeight: 600 }}
            >
              Average time
            </TableCell>
            <TableCell
              align="left"
              sx={{ color: "primary.contrastText", fontWeight: 600 }}
            >
              Missed deadlines
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(statsPerProject).map((stat) => (
            <TableRow key={stat.name}>
              <TableCell component="th" scope="row">
                {stat.name}
              </TableCell>
              <TableCell align="left">{stat.completedTasks}</TableCell>
              <TableCell align="left">
                {secondsToDhms(stat.totalTime) || "-"}
              </TableCell>
              <TableCell align="left">
                {secondsToDhms(stat.averageTime) || "-"}
              </TableCell>
              <TableCell align="left">{stat.missedDeadlines}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
