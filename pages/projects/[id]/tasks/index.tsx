import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import ITask from "../../../../types/task";
import { PrismaClient } from "@prisma/client";
import TaskList from "../../../../components/TaskList";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Alert } from "@mui/material";
import Head from "next/head";

export default function Tasks({ tasks, isAuthorised }: { tasks?: ITask[], isAuthorised: boolean }) {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthorised) {
            setTimeout(() => {
                router.push('/');
            }, 3000)
        }
    }, [isAuthorised])

    return (
        <>
            <Head>
                <title>Task List</title>
            </Head>
            {!isAuthorised ? <Alert severity="error">You are not authorised to access this page. You will be redirected to the homepage.</Alert> : <TaskList
                tasks={tasks}
            />}
        </>
    )
}

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        try {
            const session = await getSession(ctx.req, ctx.res);
            const prisma = new PrismaClient();
            const { id } = ctx.query;
            let data;

            const tasks = await prisma.task.findMany({
                where: {
                    projectId: id as string
                },
                include: { Project: true, comments: true },
            })

            if (tasks.some(task => task.authorId === session?.user.email || task.Project.assignees.includes(session?.user.email))) {
                data = {
                    tasks,
                    isAuthorised: true
                }
            } else {
                const project = await prisma.project.findFirst({
                    where: {
                        id: id as string
                    }
                })

                if (project?.creator === session?.user.email || project?.assignees.includes(session?.user.email)) {
                    data = {
                        tasks: [],
                        isAuthorised: true
                    }
                } else {
                    data = {
                        tasks: [],
                        isAuthorised: false
                    }
                }
            }

            return {
                props: {
                    ...data
                }
            }
        } catch (err) {
            return {
                props: {
                    isAuthorised: false,
                    tasks: []
                }
            }
        }
    }
});