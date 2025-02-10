export function removeIds(data: any): any {
    if (Array.isArray(data)) {
        return data.map((obj) => removeIds(obj));
    }

    const newObj: any = {};

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if (!/^id/i.test(key)) {
                if (typeof data[key] === "object" && data[key] !== null) {
                    newObj[key] = removeIds(data[key]);
                } else {
                    newObj[key] = data[key];
                }
            }
        }
    }

    return newObj;
}

export function normalizeStrng(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "");
}
