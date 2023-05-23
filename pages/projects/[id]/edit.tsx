import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import IProject from "../../../types/project";
import ProjectForm from "../../../components/ProjectForm";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

export default function Edit({ project }: { project: IProject }) {
    const { user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !user) window.location.href = '/api/auth/login';
    }, [user, isLoading]);

    return (
        <ProjectForm user={user} method="PATCH" project={project} />
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
                data = project;
            } else {
                data = {}
            }
        } else {
            data = {}
        }

        return {
            props: {
                project: data
            }
        }
    },
});

