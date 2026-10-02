import { businesses } from "./businesses";

export const promotions = businesses.flatMap((business) => business.promotion ? [{ business, ...business.promotion }] : []);
