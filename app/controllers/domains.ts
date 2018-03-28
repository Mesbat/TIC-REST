import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Domain } from "../models/domain";
import { Translation } from "../models/translation";

interface showTranslationFormat {
  id: number,
  code: string,
  trans: any
}

class DomainsController {
  public async index(request: Request, response: Response) {
    if (request.params.format === "json")
      try {
        return {
          code: 200,
          message: "success",
          datas: await getManager()
            .getRepository(Domain)
            .find({ select: ["id", "slug", "name", "description"] })
        };
      } catch (err) {
        return { code: 500, message: "internal server error", datas: err };
      }
    else return { code: 400, message: "bad request", datas: [] };
  }

  public async showDomain(request: Request, response: Response) {
    if (request.params.format === "json")
      try {
        let queryResult = await getManager()
          .createQueryBuilder(Domain, "domain")
          .leftJoin("domain.creator", "creator")
          .leftJoin("domain.langs", "langs")
          .where("domain.name = :name")
          .setParameter("name", request.params.name)
          .select([
            "langs.code",
            "domain.id",
            "domain.slug",
            "domain.name",
            "domain.description",
            "creator.id",
            "creator.username",
            "domain.created_at"
          ])
          .getMany();

        return {
          code: 200,
          message: "success",
          datas: {
            langs: queryResult[0].langs.map(lang => lang.code),
            id: queryResult[0].id,
            slug: queryResult[0].slug,
            name: queryResult[0].name,
            description: queryResult[0].description,
            creator: queryResult[0].creator,
            created_at: queryResult[0].created_at.toISOString()
          }
        };
      } catch (err) {
        return (await getManager()
          .getRepository(Domain)
          .count({ name: request.params.name }))
          ? { code: 500, message: "internal server error", datas: err }
          : { code: 404, message: "not found" };
      }
    else return { code: 400, message: "bad request", datas: [] };
  }

  public async showDomainTranslations(request: Request, response: Response) {
    if (request.params.format === "json") {
      let queryResult = await getManager()
        .createQueryBuilder(Translation, "translation")
        .leftJoin("translation.domain", "domain")
        .leftJoin("domain.langs", "langs")
        .leftJoin("translation.translatedValues", "translatedValues")
        .leftJoin("translatedValues.lang", "lang")
        .where("domain.name = :name")
        .setParameter("name", request.params.name)
        .select([
          "translation.id",
          "translation.code",
          "translatedValues.trans",
          "lang.code",
          "langs.code"
        ])
        .getMany();

      return {
        code: 200,
        message: "success",
        datas: this.showTranslationFormatter(queryResult)
      };
    } else return { code: 400, message: "bad request", datas: [] };
  }

  private showTranslationFormatter(queryResult: Translation[]) {
    let jsonResponse = queryResult.map(translation => {
      let row : showTranslationFormat = { id: translation.id, code: translation.code, trans: { ok: "test", nono: "ok" } }

      return (row);
    });

    return (jsonResponse);
  }
}

export default new DomainsController();
