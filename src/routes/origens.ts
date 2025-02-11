import { Request, Response, Router } from "express";
import { normalizeStrng, removeIds } from "helpers/formaters.js";
import { paginate } from "helpers/pagination.js";
import { models } from "interfaces/index.js";
import { db } from "lib/db.js";

const origemRouter = Router();

type SumarizedPericia = {
    nome: string;
    atributo: string;
    url: string;
};

function summarizePericias(
    pericias: models.PericiaWithAtributo[]
): SumarizedPericia[] {
    return pericias.map((pericia) => ({
        nome: pericia.nome,
        atributo: pericia.atributo.nome,
        url: `${process.env.BASE_URL}/pericias/${normalizeStrng(pericia.nome)}`,
    }));
}

origemRouter.get("/", async (req: Request, res: Response) => {
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

        const response = (await db.origem.findMany({
            orderBy: {
                nome: "asc",
            },
            include: {
                periciasTreinadas: {
                    include: {
                        atributo: true,
                    },
                },
            },
        })) as models.OrigemWithPericias[];

        if (!response) {
            res.status(500).json({ message: "Erro ao buscar dados" });
            return;
        }

        let resultados = response;

        if (filters.pericia) {
            const normalizedPericias = (filters.pericia as string)
                .split(",")
                .map((pericia) => normalizeStrng(pericia.trim()));

            resultados = resultados.filter((origem) =>
                origem.periciasTreinadas.some((pericia) =>
                    normalizedPericias.includes(normalizeStrng(pericia.nome))
                )
            );
        }

        const origensWithoutIds = removeIds(resultados);

        const origens = origensWithoutIds.map(
            (origem: models.OrigemWithPericias) => {
                const pericias = summarizePericias(origem.periciasTreinadas);
                return {
                    ...origem,
                    periciasTreinadas: pericias,
                };
            }
        );

        if (paginationLimit && paginationLimit < origens.length) {
            const pericias = paginate(
                origens,
                "pericias",
                paginationLimit,
                paginationOffset || 0,
                filters
            );

            res.status(200).json(pericias);
            return;
        }

        res.status(200).json(origens);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados" });
    }
});

origemRouter.get("/:nome", async (req: Request, res: Response) => {
    try {
        const nome = req.params.nome;
        const normalizedName = normalizeStrng(nome);

        const response = await db.origem.findMany({
            include: {
                periciasTreinadas: {
                    include: {
                        atributo: true,
                    },
                },
            },
        });

        if (!response) {
            res.status(500).json({ message: "Erro ao buscar dados" });
            return;
        }

        const origemEncontrada = response.find(
            (origem) => normalizeStrng(origem.nome) === normalizedName
        );

        if (!origemEncontrada) {
            res.status(404).json({ message: "Origem não encontrada" });
            return;
        }

        const origemWithoutIds = removeIds(origemEncontrada);

        const origem = {
            ...origemWithoutIds,
            periciasTreinadas: summarizePericias(
                origemWithoutIds.periciasTreinadas
            ),
        };

        res.status(200).json(origem);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados" });
    }
});

export default origemRouter;
