import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import ProjectChat from "../../../components/ProjectChat";
import { IChat } from "../../../types/chat";

export default function Chat({
  chat: chatProps,
  isAuthorised,
}: {
  chat?: IChat;
  isAuthorised: boolean;
}) {
  return isAuthorised && chatProps && <ProjectChat chat={chatProps} />;
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    try {
      const session = await getSession(ctx.req, ctx.res);
      const prisma = new PrismaClient();
      const { id } = ctx.query;
      let chat;
      let data;

      const existingChat = await prisma.chat.findFirst({
        where: {
          projectId: id as string,
        },
        include: {
          Project: true,
          messages: true,
        },
      });

      if (existingChat) {
        chat = existingChat;
      } else {
        chat = await prisma.chat.create({
          data: {
            Project: {
              connect: { id: id as string },
            },
            messages: {
              create: [],
            },
          },
          include: {
            Project: true,
            messages: true,
          },
        });
      }

      if (
        chat?.Project.creator === session?.user.email ||
        chat?.Project.assignees.includes(session?.user.email)
      ) {
        data = {
          chat: chat,
          isAuthorised: true,
        };
      } else {
        data = {
          chat: null,
          isAuthorised: false,
        };
      }

      return {
        props: {
          ...data,
        },
      };
    } catch (err) {
      return {
        props: {
          isAuthorised: false,
          chat: null,
        },
      };
    }
  },
});
