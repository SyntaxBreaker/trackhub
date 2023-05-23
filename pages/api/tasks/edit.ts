import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { task, id } = req.body;
        console.log(task);

        await prisma.task.update({
            where: {
                id: id,
            },
            data: {
                ...task
            }
        });

        res.status(200).json('Task was updated');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}