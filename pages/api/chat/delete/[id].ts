import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;

    const message = await prisma.message.delete({
      where: {
        id: id as string,
      },
    });

    res.status(200).json({
      message: "Message was deleted",
      deletedMessage: message,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
