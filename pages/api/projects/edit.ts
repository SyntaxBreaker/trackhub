import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { project, id } = req.body;

        await prisma.project.update({
            where: {
                id: id,
            },
            data: {
                ...project
            }
        });

        res.status(200).json('Project was created');
    } catch (err) {
        res.status(500).json(err);
    }
}