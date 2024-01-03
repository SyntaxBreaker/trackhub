import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const project = req.body;

    await prisma.project.create({
      data: {
        ...project,
        tasks: {
          create: [],
        },
      },
    });

    res.status(201).json("Project was created");
  } catch (err) {
    res.status(500).json(err);
  }
}
