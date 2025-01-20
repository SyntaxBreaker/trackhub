import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../../utils/prisma";

const prisma = prismaClient;

export default async function handler(
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

    res.status(201).json("Task was created");
  } catch (err) {
    res.status(500).json(err);
  }
}
