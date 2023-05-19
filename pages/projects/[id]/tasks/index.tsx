import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import ITask from "../../../../types/task";
import { PrismaClient } from "@prisma/client";
import TaskList from "../../../../components/TaskList";

export default function Tasks({ tasks }: { tasks: ITask[] }) {
    return (
        <TaskList tasks={tasks} />
    )
}

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        try {
            const session = await getSession(ctx.req, ctx.res);
            const prisma = new PrismaClient();
            const { id } = ctx.query;

            const tasks = await prisma.task.findMany({
                where: {
                    projectId: id as string
                }
            })

            return {
                props: {
                    tasks
                }
            }
        } catch (err) {
            return {
                props: {
                    tasks: []
                }
            }
        }
    }
});