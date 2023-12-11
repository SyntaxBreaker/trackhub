import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { task, id } = req.body;

    await prisma.project.update({
      where: {
        id: id,
      },
      data: {
        tasks: {
          create: {
            ...task,
          },
        },
      },
    });

    res.status(200).json("Task was created");
  } catch (err) {
    res.status(500).json(err);
  }
}
