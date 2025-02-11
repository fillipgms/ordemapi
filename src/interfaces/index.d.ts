import { Origem, Prisma } from "@prisma/client";

declare namespace models {
    type PericiaWithAtributo = Prisma.PericiaGetPayload<{
        include: {
            atributo: true;
        };
    }>;

    type OrigemWithPericias = Origem & {
        periciasTreinadas: PericiaWithAtributo[];
    };
}
