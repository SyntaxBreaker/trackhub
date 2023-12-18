import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession(req, res);
    const email = req.method === "POST" ? req.body.email : session?.user.email;
    const id = req.query.id;
    let chat;
    let data;
    const prisma = new PrismaClient();

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
      chat?.Project.creator === email ||
      chat?.Project.assignees.includes(email)
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

    res.status(200).json({
      ...data,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
