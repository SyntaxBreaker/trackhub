import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../../../utils/prisma";

const prisma = prismaClient;

export default async function handler(
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
