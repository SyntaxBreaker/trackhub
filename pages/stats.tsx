import { Box, Grid, Paper, Typography } from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import DoneIcon from "@mui/icons-material/Done";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import { calculateRemainingDays } from "../utils/date";
import { secondsToDhms } from "../utils/time";
import Statistic from "../components/Statistic";
import Head from "next/head";

function UserStats({
    totalTime,
    completedTasks,
    averageTimePerTask,
    missedDeadlines,
}: {
    totalTime: number;
    completedTasks: number;
    averageTimePerTask: number;
    missedDeadlines: number;
}) {
    const { user } = useUser();

    return (
        <>
            <Head>
                <title>Stats Overview</title>
            </Head>
            <Box sx={{ paddingTop: 1 }}>
                <Typography variant="h5" component="h1">
                    Welcome back, {user?.nickname}!
                </Typography>
                <Typography variant="body1" component="p">
                    Here&apos;s what&apos;s happening with your stats:
                </Typography>
                <Grid container spacing={2} direction="row" sx={{ marginTop: 1 }}>
                    <Statistic
                        icon={<TimerIcon fontSize="large" />}
                        title="Total Time Tracker"
                        description={secondsToDhms(totalTime) ? secondsToDhms(totalTime) : "0S"}
                    />
                    <Statistic
                        icon={<DoneIcon fontSize="large" />}
                        title="Completed Tasks Overview"
                        description={`${completedTasks} Tasks`}
                    />
                    <Statistic
                        icon={<AccessTimeIcon fontSize="large" />}
                        title="Average Time per Task Analysis"
                        description={secondsToDhms(averageTimePerTask) ? secondsToDhms(averageTimePerTask) : "0S"}
                    />
                    <Statistic
                        icon={<EventBusyIcon fontSize="large" />}
                        title="Missed Deadlines Report"
                        description={`${missedDeadlines} Tasks`}
                    />
                </Grid>
            </Box>
        </>
    );
}

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        const session = await getSession(ctx.req, ctx.res);
        const prisma = new PrismaClient();

        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    {
                        authorId: session?.user.email,
                    },
                    {
                        assignedUser: session?.user.email,
                    },
                ],
            },
        });

        const totalTime = tasks.reduce((acc, curr) => acc + curr.duration, 0);
        const completedTasks = tasks.filter((task) => task.status === "COMPLETED");
        const averageTimePerTask = completedTasks.reduce((acc, curr) => acc + curr.duration, 0) / completedTasks.length;
        const missedDeadlines = tasks.filter(
            (task) => task.status !== "COMPLETED" && calculateRemainingDays(task.deadline) < 0
        ).length;

        return {
            props: {
                tasks,
                totalTime,
                completedTasks: completedTasks.length,
                averageTimePerTask,
                missedDeadlines,
            },
        };
    },
});

export default UserStats;
