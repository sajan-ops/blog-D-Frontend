import { apiUrl } from "./apiConfig";

export const getMediaUrlPath = (path: any) => {
    return `${apiUrl}/images/${path}`
};