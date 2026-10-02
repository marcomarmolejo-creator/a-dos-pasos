import { businesses } from "./businesses";

export const benefits = businesses.flatMap((business) => business.benefit ? [{ business, ...business.benefit }] : []);
