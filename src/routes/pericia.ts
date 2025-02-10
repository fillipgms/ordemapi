import { Pericia } from "@prisma/client";
import { Router } from "express";
import { removeIds, normalizeStrng } from "helpers/formaters.js";
import { paginate } from "helpers/pagination.js";
import { db } from "lib/db.js";

const periciaRouter = Router();

periciaRouter.get("/", async (req, res) => {
    try {
        const paginationLimit = Number(req.query.limit);
        const paginationOffset = Number(req.query.offset);

        const { atributo } = req.query;

        const response = (await db.pericia.findMany({
            orderBy: {
                nome: "asc",
            },
            include: {
                atributo: true,
            },
        })) as Pericia[];

        if (!response) {
            res.status(500).json({ message: "Erro ao buscar dados" });
            return;
        }

        let resultados = response;

        if (atributo) {
            //! Arrumar aqui o filtro

            const normalizedAtributo = normalizeStrng(atributo as string);
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
            //* Ajustar o retorno para voltar o filtro também

            const pericias = paginate(
                resultados,
                "pericia",
                paginationLimit,
                paginationOffset || 0
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
