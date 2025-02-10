import { Pericia } from "@prisma/client";
import { Router } from "express";
import { formatArray } from "helpers/formatData.js";
import { db } from "lib/db.js";

const periciaRouter = Router();

periciaRouter.get("/", async (req, res) => {
    try {
        const response = (await db.pericia.findMany({
            orderBy: {
                nome: "asc",
            },
        })) as Pericia[];

        const pericias = formatArray(response);

        res.status(200).json(pericias);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados: ", error });
    }
});

export default periciaRouter;
