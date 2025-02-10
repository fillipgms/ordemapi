import { Request, Response } from "express";
import express from "express";
const app = express();
const port = process.env.PORT || 5500;

import atributoRouter from "routes/atributo.js";
import periciaRouter from "routes/pericia.js";

const rotas = {
    atributo: "/api/v1/atributo",
    pericia: "/api/v1/pericia",
};

app.use(express.json());

app.get("/api/v1", (req: Request, res: Response) => {
    res.status(200).json(rotas);
});

app.use("/api/v1/atributo", atributoRouter);
app.use("/api/v1/pericia", periciaRouter);

app.listen(port, () => {
    console.log(`Api inicializada em: http://localhost:${port}/api/v1`);
});
