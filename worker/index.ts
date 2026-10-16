import { videoApi } from "./video-admin";
import handler from "vinext/server/app-router-entry";
import { languageForCountry } from "../app/language-preference";

const worker = {
  async fetch(...args:Parameters<typeof handler.fetch>) {
    const [request, env] = args;
    const response = await videoApi(request, env as Parameters<typeof videoApi>[1]);
    if (response) return response;
    if (new URL(request.url).pathname === "/api/visitor-language") {
      const country = (request as Request & {cf?:{country?:string}}).cf?.country;
      return Promise.resolve(Response.json({language:languageForCountry(country)}, {headers:{"Cache-Control":"private, no-store"}}));
    }
    return handler.fetch(...args);
  },
};

export default worker;
