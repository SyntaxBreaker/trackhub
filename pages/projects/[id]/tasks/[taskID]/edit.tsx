import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import ITask from "../../../../../types/task";
import TaskForm from "../../../../../components/TaskForm";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Alert } from "@mui/material";

export default function Edit({ task, isAuthorised }: { task: ITask, isAuthorised: boolean }) {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) window.location.href = '/api/auth/login';
    }, [user, isLoading]);

    useEffect(() => {
        if (!isAuthorised) {
            setTimeout(() => {
                router.push('/');
            }, 3000)
        }
    }, [isAuthorised])

    return (
        <>
            {!isAuthorised && <Alert severity="error">You are not authorised to access this page. You will be redirected to the homepage.</Alert>}
            {isAuthorised && <TaskForm user={user} method="PATCH" task={task} />}
        </>
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
                data = {
                    task,
                    isAuthorised: true,
                }
            } else {
                data = {
                    task,
                    isAuthorised: false
                }
            }
        } else {
            data = {
                task: {},
                isAuthorised: false
            }
        }

        return {
            props: {
                ...data
            }
        }
    },
});