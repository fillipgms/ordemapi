import { Pericia, Prisma } from "@prisma/client";
import { Router } from "express";
import { removeIds, normalizeStrng } from "helpers/formaters.js";
import { paginate } from "helpers/pagination.js";
import { models } from "interfaces/index.js";
import { db } from "lib/db.js";

const periciaRouter = Router();

periciaRouter.get("/", async (req, res) => {
    try {
        const paginationLimit = Number(req.query.limit);
        const paginationOffset = Number(req.query.offset);

        const filters = Object.entries(req.query).reduce(
            (acc, [key, value]) => {
                if (key !== "limit" && key !== "offset" && value) {
                    acc[key] = value as string;
                }
                return acc;
            },
            {} as Record<string, string>
        );

        const response = (await db.pericia.findMany({
            orderBy: {
                nome: "asc",
            },
            include: {
                atributo: true,
            },
        })) as models.PericiaWithAtributo[];

        if (!response) {
            res.status(500).json({ message: "Erro ao buscar dados" });
            return;
        }

        let resultados = response;

        if (filters.atributo) {
            const normalizedAtributo = normalizeStrng(
                filters.atributo as string
            );
            resultados = resultados.filter(
                (pericia) =>
                    normalizeStrng(pericia.atributo.nome) === normalizedAtributo
            );

            if (!resultados) {
                res.status(404).json({
                    message: "Não foi encontrado pericias com esse atributo",
                });
                return;
            }
        }

        if (paginationLimit && paginationLimit < resultados.length) {
            const pericias = paginate(
                resultados,
                "pericias",
                paginationLimit,
                paginationOffset || 0,
                filters
            );

            res.status(200).json(pericias);
            return;
        }

        const pericias = removeIds(resultados);
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

        const pericia = removeIds(periciaEncontrada);

        res.status(200).json(pericia);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados" });
    }
});

export default periciaRouter;
