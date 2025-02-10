import { Pericia } from "@prisma/client";
import { Router } from "express";
import { formatData, normalizeStrng } from "helpers/formatData.js";
import { db } from "lib/db.js";

const periciaRouter = Router();

periciaRouter.get("/", async (req, res) => {
    try {
        const response = (await db.pericia.findMany({
            orderBy: {
                nome: "asc",
            },
            include: {
                atributo: true,
            },
        })) as Pericia[];

        const pericias = formatData(response);

        res.status(200).json(pericias);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados" });
    }
});

periciaRouter.get("/:nome", async (req, res) => {
    const { nome } = req.params;

    const normalizedName = normalizeStrng(nome);

    try {
        const response = (await db.pericia.findMany({
            include: {
                atributo: true,
            },
        })) as Pericia[];

        if (!response) {
            res.status(500).json({ message: "Erro ao buscar dados" });
        }

        const periciaEncontrada = response.find(
            (pericia) => normalizeStrng(pericia.nome) === normalizedName
        );

        if (!periciaEncontrada) {
            res.status(404).json({ message: "Perícia não encontrada" });
            return;
        }

        const pericia = formatData(periciaEncontrada);

        res.status(200).json(pericia);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados" });
    }
});

export default periciaRouter;
