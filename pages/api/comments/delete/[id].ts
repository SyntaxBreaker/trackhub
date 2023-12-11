import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { id } = req.query;

    const comment = await prisma.comment.delete({
      where: {
        id: id as string,
      },
    });

    res.status(200).json({
      message: "Comment was deleted",
      deletedComment: comment,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
