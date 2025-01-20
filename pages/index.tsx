import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import IProject from "../types/project";
import ProjectList from "../components/ProjectList";
import Head from "next/head";
import { Box } from "@mui/material";
import ProjectListHeader from "../components/ProjectListHeader";
import { prismaClient } from "../utils/prisma";

function Home({ projects }: { projects: IProject[] }) {
  return (
    <>
      <Head>
        <title>TrackHub | Project List</title>
      </Head>
      <Box>
        <ProjectListHeader />
        <ProjectList projects={projects} />
      </Box>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = await getSession(ctx.req, ctx.res);
    const prisma = prismaClient;

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            creator: session?.user.email,
          },
          {
            assignees: {
              has: session?.user.email,
            },
          },
        ],
      },
    });

    return {
      props: {
        projects,
      },
    };
  },
});

export default Home;
