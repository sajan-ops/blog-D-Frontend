import { apiUrl } from "./apiConfig";

export const getMediaUrlPath = (path: string) => {
  return `${apiUrl}/images/${path}`;
};
