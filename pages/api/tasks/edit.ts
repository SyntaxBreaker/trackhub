import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { task, id } = req.body;

    const updatedTask = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        ...task,
      },
    });

    res.status(200).json({
      message: "Task was updated",
      updatedTask,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
