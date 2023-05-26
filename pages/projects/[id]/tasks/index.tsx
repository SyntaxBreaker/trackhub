import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import ITask from "../../../../types/task";
import { PrismaClient } from "@prisma/client";
import TaskList from "../../../../components/TaskList";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Alert } from "@mui/material";

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
                }
            })

            if (tasks.some(task => task.authorId === session?.user.email)) {
                data = {
                    tasks,
                    isAuthorised: true
                }
            } else {
                data = {
                    tasks: [],
                    isAuthorised: false
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