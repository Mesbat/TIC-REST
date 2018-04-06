import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Domain } from "../models/domain";
import { Translation } from "../models/translation";
import Auth from "../services/auth";
import { User } from "../models/user";
import { Lang } from "../models/lang";

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

  public async show(request: Request, response: Response) {
    if (request.params.format === "json")
      try {
        let auth = await Auth.domainAuth(request);

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
            "creator.email",
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
            creator: {
              id: queryResult[0].creator.id,
              username: queryResult[0].creator.username,
              email: auth instanceof Domain ? queryResult[0].creator.email : undefined,
            },
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

  public async create(request: Request, response: Response) {
    let auth = await Auth.simpleAuth(request);

    if (request.params.format !== "json" || !request.body.name || !request.body.description || !request.body.lang || !(request.body.lang instanceof Array))
      return { code: 400, message: "bad request", datas: [] };

    if (!(auth instanceof User)) return auth;

    let domain = new Domain();
    domain.creator = auth;
    domain.description = request.body.description;
    domain.name = request.body.name;
    domain.slug = request.body.name;
    domain.langs = [];
    domain.created_at = new Date();

    let domainLangs = domain.langs;

    for (let lang of request.body.lang) {
      let language = await getManager().getRepository(Lang).findOne({ code: lang });

      if (!(language instanceof Lang) || language === undefined) {
        throw `[${lang}] is not a registered language`
      } else
        domainLangs.push(language);
    }

    domain = await getManager().save(domain);

    domain.langs = domainLangs;
    domain = await getManager().save(domain);

    return {
      code: 201,
      message: "success",
      datas: {
        langs: domain.langs.map(lang => lang.code),
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
  }
}

export default new DomainsController();
