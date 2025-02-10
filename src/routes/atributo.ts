import { Atributo } from "@prisma/client";
import { Request, Response, Router } from "express";
import { formatData, normalizeStrng } from "helpers/formatData.js";
import { db } from "lib/db.js";

const atributoRouter = Router();

atributoRouter.get("/", async (req: Request, res: Response) => {
    try {
        const response = (await db.atributo.findMany({
            orderBy: {
                nome: "asc",
            },
        })) as Atributo[];

        const atributos = formatData(response);

        res.status(200).json(atributos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados" });
    }
});

atributoRouter.get("/:nome", async (req: Request, res: Response) => {
    try {
        const { nome } = req.params;

        const normalizedName = normalizeStrng(nome);

        const response = (await db.atributo.findMany()) as Atributo[];

        if (!response) {
            res.status(500).json({ message: "Erro ao buscar dados" });
        }

        const atributoEncontrado = response.find(
            (atributo) => normalizeStrng(atributo.nome) === normalizedName
        );

        if (!atributoEncontrado) {
            res.status(404).json({ message: "Atributo não encontrado" });
            return;
        }

        const atributo = formatData(atributoEncontrado);

        res.status(200).json(atributo);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados" });
    }
});

export default atributoRouter;
