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

    type fullClasse = Prisma.ClasseGetPayload<{
        include: {
            trilhas: true;
            habilidades: true;
            PerciasOptaveis: {
                include: {
                    Pericia: {
                        include: {
                            atributo: true;
                        };
                    };
                };
            };
        };
    }>;
}
