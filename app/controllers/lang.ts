import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Domain } from "../models/domain";
import { Translation } from "../models/translation";
import Auth from "../services/auth";
import { User } from "../models/user";
import { Lang } from "../models/lang";

class LangController {
  public async deleteDomainLang(request: Request, response: Response) {
    if (request.params.format === "json") {
      let domain = await Auth.slugAuth(request);

      if (!(domain instanceof Domain)) return domain;

      let lang = domain.langs.find((x: any) => x.code === request.params.lang);

      if (!lang)
        throw `[${request.params.lang}] is not a registered language`;
      else
        domain.langs = domain.langs.filter((x: any) => x.code !== request.params.lang);

      domain = await getManager().save(domain);

      return {
        code: 200,
        message: "success",
        datas: {
          langs: domain.langs.map((lang: any) => lang.code),
          id: domain.id,
          slug: domain.slug,
          name: domain.name,
          description: domain.description,
          creator: {
            id: domain.creator.id,
            username: domain.creator.username,
            email: domain.creator.email
          },
          created_at: domain.created_at
        }
      };
    } else return { code: 400, message: "bad request", datas: [] };
  }
}

export default new LangController();
