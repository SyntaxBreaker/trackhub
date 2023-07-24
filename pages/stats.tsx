import { Box, Grid, Typography } from "@mui/material";
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
import ITask from "../types/task";
import ProjectStats from "../components/ProjectStats";
import { IStatsPerProject } from "../types/project";

function UserStats({
    totalTime,
    completedTasks,
    averageTimePerTask,
    missedDeadlines,
    statsPerProject,
}: {
    totalTime: number;
    completedTasks: number;
    averageTimePerTask: number;
    missedDeadlines: number;
    statsPerProject: IStatsPerProject;
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
                <ProjectStats statsPerProject={statsPerProject} />
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
            include: { Project: true, comments: true },
        });

        const totalTime = tasks.reduce((acc, curr) => acc + curr.duration, 0);
        const completedTasks = tasks.filter((task) => task.status === "COMPLETED");
        const averageTimePerTask = completedTasks.reduce((acc, curr) => acc + curr.duration, 0) / completedTasks.length;
        const missedDeadlines = tasks.filter(
            (task) => task.status !== "COMPLETED" && calculateRemainingDays(task.deadline) < 0
        ).length;

        let statsPerProject: IStatsPerProject = {};

        let projectGroup: {
            [key: string]: {
                name: string;
                tasks: ITask[];
            };
        } = {};

        tasks.forEach((task) => {
            const { projectId } = task;
            projectGroup[projectId] = projectGroup[projectId] || { tasks: [] };
            projectGroup[projectId]["name"] = task.Project.name;
            projectGroup[projectId]["tasks"] = [...projectGroup[projectId]["tasks"], task as ITask];
        });

        for (const project in projectGroup) {
            let totalTimePerProject = 0;
            let completedTasksPerProject = 0;
            let missedDeadlinesPerProject = 0;
            projectGroup[project]["tasks"].forEach((task) => {
                totalTimePerProject += task.duration;
                task.status === "COMPLETED" && (completedTasksPerProject += 1);
                task.status !== "COMPLETED" &&
                    calculateRemainingDays(task.deadline) < 0 &&
                    (missedDeadlinesPerProject += 1);
            });

            statsPerProject[project] = {
                name: projectGroup[project]["name"],
                totalTime: totalTimePerProject,
                completedTasks: completedTasksPerProject,
                missedDeadlines: missedDeadlinesPerProject,
                averageTime:
                    totalTimePerProject /
                        projectGroup[project].tasks.filter((task) => task.status === "COMPLETED").length || 0,
            };
        }

        return {
            props: {
                tasks,
                totalTime,
                completedTasks: completedTasks.length,
                averageTimePerTask,
                missedDeadlines,
                statsPerProject,
            },
        };
    },
});

export default UserStats;
