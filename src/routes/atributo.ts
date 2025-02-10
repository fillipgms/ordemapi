import { Atributo } from "@prisma/client";
import { Request, Response, Router } from "express";
import { formatArray, formatObject } from "helpers/formatData.js";
import { db } from "lib/db.js";

const atributoRouter = Router();

atributoRouter.get("/", async (req: Request, res: Response) => {
    try {
        const response = (await db.atributo.findMany({
            orderBy: {
                nome: "asc",
            },
        })) as Atributo[];

        const atributos = formatArray(response);

        res.status(200).json(atributos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados: ", error });
    }
});

atributoRouter.get("/:nome", async (req: Request, res: Response) => {
    try {
        const { nome } = req.params;

        const response = (await db.atributo.findFirst({
            where: {
                nome: nome,
            },
        })) as Atributo;

        if (!response) {
            res.status(404).json({ message: "Atributo não encontrado" });
        }

        const atributo = formatObject(response);

        res.status(200).json(atributo);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados: ", error });
    }
});

export default atributoRouter;
