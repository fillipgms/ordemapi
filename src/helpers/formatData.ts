export function formatArray(data: any[]) {
    return data.map((object) => {
        let formatedObj: any = {};

        for (const key in object) {
            if (!key.startsWith("id")) {
                formatedObj[key] = object[key];
            }
        }

        return formatedObj;
    });
}

export function formatObject(data: any) {
    let formatedObj: any = {};

    for (const key in data) {
        if (!key.startsWith("id")) {
            formatedObj[key] = data[key];
        }
    }

    return formatedObj;
}
