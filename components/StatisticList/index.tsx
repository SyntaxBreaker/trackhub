import { Grid } from "@mui/material";
import Statistic from "../Statistic";
import { secondsToDhms } from "../../utils/time";
import TimerIcon from "@mui/icons-material/Timer";
import DoneIcon from "@mui/icons-material/Done";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";

interface StatisticListProps {
  totalTime: number;
  completedTasks: number;
  averageTimePerTask: number;
  missedDeadlines: number;
}

export default function StatisticList({
  totalTime,
  completedTasks,
  averageTimePerTask,
  missedDeadlines,
}: StatisticListProps) {
  return (
    <Grid container spacing={2} direction="row" sx={{ marginTop: 1 }}>
      <Statistic
        icon={<TimerIcon fontSize="large" />}
        title="Total Time Tracker"
        description={secondsToDhms(totalTime) || "-"}
      />
      <Statistic
        icon={<DoneIcon fontSize="large" />}
        title="Completed Tasks Overview"
        description={`${completedTasks} Tasks`}
      />
      <Statistic
        icon={<AccessTimeIcon fontSize="large" />}
        title="Average Time per Task Analysis"
        description={secondsToDhms(averageTimePerTask) || "-"}
      />
      <Statistic
        icon={<EventBusyIcon fontSize="large" />}
        title="Missed Deadlines Report"
        description={`${missedDeadlines} Tasks`}
      />
    </Grid>
  );
}
