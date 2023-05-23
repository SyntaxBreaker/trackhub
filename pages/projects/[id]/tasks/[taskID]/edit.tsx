import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import ITask from "../../../../../types/task";
import TaskForm from "../../../../../components/TaskForm";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

export default function Edit({ task }: { task: ITask }) {
    const { user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !user) window.location.href = '/api/auth/login';
    }, [user, isLoading]);

    return (
        <TaskForm user={user} method="PATCH" task={task} />
    )
}

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        const session = await getSession(ctx.req, ctx.res);
        const prisma = new PrismaClient();
        const { taskID } = ctx.query;
        let data;

        if (/^[0-9a-fA-F]{24}$/.test(taskID as string)) {
            const task = await prisma.task.findUnique(
                {
                    where: {
                        id: taskID as string,
                    }
                }
            );

            if (task?.authorId === session?.user.email) {
                data = task;
            } else {
                data = {}
            }
        } else {
            data = {}
        }

        return {
            props: {
                task: data
            }
        }
    },
});