import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { comment, id } = req.body;

        await prisma.task.update({
            where: {
                id: id
            },
            data: {
                comments: {
                    create: {
                        ...comment
                    }
                }
            }
        });


        res.status(200).json('Comment was created');
    } catch (err) {
        res.status(500).json(err);
    }
}