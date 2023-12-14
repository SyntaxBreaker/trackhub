import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const message = req.body;

    const chat = await prisma.chat.update({
      where: {
        id: message.chatId,
      },
      data: {
        messages: {
          create: {
            authorId: message.authorId,
            authorName: message.authorName,
            authorAvatar: message.authorAvatar,
            text: message.text,
          },
        },
      },
    });

    res.status(200).json({
      message: "Your message has been sent.",
      messages: chat,
    });
  } catch (err) {
    console.error("Error in API", err);
    res.status(500).json(err);
  }
}
