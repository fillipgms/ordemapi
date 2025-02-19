import { models } from "interfaces/index.js";
import { normalizeStrng } from "./formaters.js";

type SumarizedPericia = {
    nome: string;
    atributo: string;
    url: string;
};

export default function summarizePericias(
    pericias: models.PericiaWithAtributo[]
): SumarizedPericia[] {
    return pericias.flatMap((pericia) => ({
        nome: pericia.nome,
        atributo: pericia.atributo.nome,
        url: `${process.env.BASE_URL}/pericias/${normalizeStrng(pericia.nome)}`,
    }));
}
