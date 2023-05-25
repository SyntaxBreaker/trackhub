import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import IProject from "../../../types/project";
import ProjectForm from "../../../components/ProjectForm";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Alert } from "@mui/material";

export default function Edit({ project, isAuthorised }: { project: IProject, isAuthorised: boolean }) {
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
            {isAuthorised && <ProjectForm user={user} method="PATCH" project={project} />}
        </>
    )
}

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        const session = await getSession(ctx.req, ctx.res);
        const prisma = new PrismaClient();
        const { id } = ctx.query;
        let data;

        if (/^[0-9a-fA-F]{24}$/.test(id as string)) {
            const project = await prisma.project.findUnique(
                {
                    where: {
                        id: id as string,
                    }
                }
            );

            if (project?.creator === session?.user.email) {
                data = {
                    project,
                    isAuthorised: true,
                };
            } else {
                data = {
                    project: {},
                    isAuthorised: false,
                }
            }
        } else {
            data = {
                project: {},
                isAuthorised: false,
            }
        }

        return {
            props: {
                ...data
            }
        }
    },
});

