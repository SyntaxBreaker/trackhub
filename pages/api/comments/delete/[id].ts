import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        
        await prisma.comment.delete({
            where: {
                id: id as string
            }
        })

        res.status(200).json('Comment was deleted');
    } catch (err) {
        res.status(500).json(err);
    }
}