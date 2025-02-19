import { Request, Response } from "express";
import express from "express";
const app = express();
const port = process.env.PORT || 5500;
const url = process.env.BASE_URL;

import atributoRouter from "routes/atributos.js";
import origemRouter from "routes/origens.js";
import periciaRouter from "routes/pericias.js";
import cors from "cors";
import classeRouter from "routes/classe.js";

const rotas = {
    atributos: "/api/v1/atributos",
    pericias: "/api/v1/pericias",
    origens: "/api/v1/origens",
    classes: "/api/v1/classes",
};

app.use(express.json());
app.use(cors());

app.get("/api/v1", (req: Request, res: Response) => {
    res.status(200).json(rotas);
});

app.use("/api/v1/atributos", atributoRouter);
app.use("/api/v1/pericias", periciaRouter);
app.use("/api/v1/origens", origemRouter);
app.use("/api/v1/classes", classeRouter);

app.listen(port, () => {
    console.log(`Api inicializada em: ${url}`);
});
