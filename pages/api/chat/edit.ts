import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { message, id } = req.body;

    const updatedMessage = await prisma.message.update({
      where: {
        id: id,
      },
      data: {
        text: message,
      },
    });

    res.status(200).json({
      message: "Message was updated",
      updatedMessage: updatedMessage,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
