import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { id } = req.query;

    const deletedTask = await prisma.task.delete({
      where: {
        id: id as string,
      },
    });

    res.status(200).json({
      message: "Task was deleted",
      deletedTask,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
