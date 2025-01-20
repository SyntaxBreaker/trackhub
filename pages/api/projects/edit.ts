import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../../utils/prisma";

const prisma = prismaClient;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { project, id } = req.body;

    const updatedProject = await prisma.project.update({
      where: {
        id: id,
      },
      data: {
        ...project,
      },
    });

    res.status(200).json({
      message: "Project was updated",
      updatedProject,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
