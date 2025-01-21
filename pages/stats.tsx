import { Box } from "@mui/material";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { calculateRemainingDays } from "../utils/date";
import Head from "next/head";
import ITask from "../types/task";
import ProjectStats from "../components/ProjectStats";
import { IStatsPerProject } from "../types/project";
import StatsHeader from "../components/StatsHeader";
import { prismaClient } from "../utils/prisma";
import StatisticList from "../components/StatisticList";

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
  return (
    <>
      <Head>
        <title>TrackHub | Stats Overview</title>
      </Head>
      <Box>
        <StatsHeader />
        <StatisticList
          totalTime={totalTime}
          completedTasks={completedTasks}
          averageTimePerTask={averageTimePerTask}
          missedDeadlines={missedDeadlines}
        />
        <ProjectStats statsPerProject={statsPerProject} />
      </Box>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = await getSession(ctx.req, ctx.res);
    const prisma = prismaClient;

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
    const averageTimePerTask =
      completedTasks.reduce((acc, curr) => acc + curr.duration, 0) /
      completedTasks.length;
    const missedDeadlines = tasks.filter(
      (task) =>
        task.status !== "COMPLETED" && calculateRemainingDays(task.deadline) < 0
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
      projectGroup[projectId]["tasks"] = [
        ...projectGroup[projectId]["tasks"],
        task as ITask,
      ];
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
          projectGroup[project].tasks.filter(
            (task) => task.status === "COMPLETED"
          ).length > 0
            ? totalTimePerProject /
              projectGroup[project].tasks.filter(
                (task) => task.status === "COMPLETED"
              ).length
            : 0,
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
