import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../../utils/prisma";

const prisma = prismaClient;

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
