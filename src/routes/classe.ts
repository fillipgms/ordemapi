import { Router } from "express";
import { normalizeStrng, removeIds } from "helpers/formaters.js";
import summarizePericias from "helpers/summarizePericias.js";
import { models } from "interfaces/index.js";
import { db } from "lib/db.js";

const classeRouter = Router();

classeRouter.get("/", async (req, res) => {
    try {
        const paginationLimit = Number(req.query.limit);
        const paginationOffset = Number(req.query.offset);

        const response = (await db.classe.findMany({
            orderBy: {
                nome: "asc",
            },
            include: {
                trilhas: true,
                habilidades: true,
                PerciasOptaveis: {
                    include: {
                        Pericia: {
                            include: {
                                atributo: true,
                            },
                        },
                    },
                },
            },
        })) as models.fullClasse[];

        if (!response) {
            res.status(500).json({ message: "Erro ao buscar dados" });
            return;
        }

        const classesWithoutIds = removeIds(response);

        let classes = classesWithoutIds.map((classe: models.fullClasse) => {
            const periciasTreinadas = classe.PerciasOptaveis.flatMap((opt) => ({
                escolha: summarizePericias(opt.Pericia),
            }));

            return {
                nome: classe.nome,
                pontosDeVidaIniciais: `${classe.pontosDeVidaIniciais} + Vigor`,
                pontosDeVidaPorNivel: `${classe.pontosDeVidaPorNivel}PV (+Vig)`,
                pontosDeEsforcoIniciais: `${classe.pontosDeEsforcoIniciais} + Presença`,
                pontosDeEsforcoPorNivel: `${classe.pontosDeEsforcoPorNivel}PE (+Pre)`,
                sanidadeInicial: classe.sanidadeInicial,
                sanidadePorNivel: `${classe.sanidadePorNivel}SAN`,
                periciasTreinadas,
            };
        });

        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados" });
    }
});

export default classeRouter;
