import handler from "vinext/server/app-router-entry";
import { languageForCountry } from "../app/language-preference";

export default {
  fetch(...args:Parameters<typeof handler.fetch>) {
    const [request] = args;
    if (new URL(request.url).pathname === "/api/visitor-language") {
      const country = (request as Request & {cf?:{country?:string}}).cf?.country;
      return Promise.resolve(Response.json({language:languageForCountry(country)}, {headers:{"Cache-Control":"private, no-store"}}));
    }
    return handler.fetch(...args);
  },
};
