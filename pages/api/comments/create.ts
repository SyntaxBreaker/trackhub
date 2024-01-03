import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { comment, id } = req.body;

    const comments = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        comments: {
          create: {
            ...comment,
          },
        },
      },
      include: {
        comments: true,
      },
    });

    res.status(201).json({
      message: "Comment was created",
      comments: comments.comments,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
