import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import TaskForm from "../../../../components/TaskForm";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
import { Alert, Box } from "@mui/material";
import Head from "next/head";

export default function Create({ isAuthorised }: { isAuthorised: boolean }) {
    const { user, isLoading } = useUser();

    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) window.location.href = '/api/auth/login';
    }, [user, isLoading]);

    useEffect(() => {
        if (!isAuthorised) {
            setTimeout(() => {
                router.push('/');
            }, 3000);
        }
    }, [isAuthorised])

    return (
        <>
            <Head>
                <title>Create a new task</title>
            </Head>
            {!isAuthorised ? <Alert severity="error">You are not authorised to access this page. You will be redirected to the homepage.</Alert> : <Box sx={{ marginTop: '32px' }}>
                <TaskForm
                    user={user}
                    method="POST"
                />
            </Box>}
        </>
    )
}

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        const session = await getSession(ctx.req, ctx.res);
        const prisma = new PrismaClient();
        const { id } = ctx.query;

        const project = await prisma.project.findUnique({
            where: {
                id: id as string
            }
        })

        const isAuthorised = project?.creator === session?.user.email || project?.assignees.includes(session?.user.email);

        return {
            props: {
                isAuthorised
            }
        }
    },
});