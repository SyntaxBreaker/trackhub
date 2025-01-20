import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../../../utils/prisma";

const prisma = prismaClient;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { id } = req.query;

    const deletedProject = await prisma.project.delete({
      where: {
        id: id as string,
      },
    });

    res.status(200).json({
      message: "Project was deleted",
      deletedProject,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
