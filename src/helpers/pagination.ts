import { removeIds } from "./formaters.js";

type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export function paginate<T>(
    array: T[],
    endpoint: string,
    limit: number,
    offset: number
): PaginatedResponse<T> {
    const totalItens = array.length;
    const resultados = array.slice(offset, offset + limit);

    const resultadosSemIds = removeIds(resultados);

    const nextOffset = offset + limit;
    const next =
        nextOffset < totalItens
            ? `${process.env.BASE_URL}/${endpoint}?offset=${nextOffset}&limit=${limit}`
            : null;

    const previousOffset = offset - limit;
    const previous =
        previousOffset >= 0
            ? `${process.env.BASE_URL}/${endpoint}?offset=${previousOffset}&limit=${limit}`
            : null;

    return {
        count: totalItens,
        next,
        previous,
        results: resultadosSemIds,
    };
}
