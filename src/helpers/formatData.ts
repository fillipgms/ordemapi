export function formatData(data: any): any {
    if (Array.isArray(data)) {
        return data.map((obj) => formatData(obj));
    }

    const newObj: any = {};

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if (!/^id/i.test(key)) {
                if (typeof data[key] === "object" && data[key] !== null) {
                    newObj[key] = formatData(data[key]);
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
