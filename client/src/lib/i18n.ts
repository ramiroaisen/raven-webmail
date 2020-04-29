import { Locale } from "../../../src/i18n/types";
import format from "string-format";

export const Trans = (locale: Locale) => {

    const flatted: Record<string, string | string[]> = Object.create(null);

    const add = (parent: string | null, object: any) => {
        for(const [key, value] of Object.entries(object)) {
            const flattedKey = parent == null ? key : `${parent}.${key}`;
            if(typeof value === "string" || value instanceof Array) {
                flatted[flattedKey] = value;
            } else {
                add(flattedKey, value);
            }
        }
    }

    add(null, locale);

    return (key: string, params: Record<string, any> = {}) => {

        let template = flatted[key];

        if(template == null) {
            // this should never happen
            console.warn("[i18n] Unexistent locale key: " + key);
            return "";
        }

        if(template instanceof Array) {

            const n = params.n || 0;

            if (template.length === 2) {
                template = n === 1 ? template[1] : template[0];

            } else if (template.length === 3) {
                if (n === 0 || n === 1) {
                    template = template[n]
                } else {
                    template = template[2];
                }

            } else {
                template = template[n] != null ? template[n] : template[template.length - 1];
            }
        }

        return format(template, params);
    }
}