import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Domain } from "../models/domain";

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
        let queryResult = await getManager()
          .createQueryBuilder(Domain, 'domain')
          .leftJoin('domain.creator', 'creator')
          .leftJoin('domain.langs', 'langs')
          .where('domain.name = :name')
          .setParameter('name', request.params.name)
          .select(['langs.code', 'domain.id', 'domain.slug', 'domain.name', 'domain.description', 'creator.id', 'creator.username', 'domain.created_at'])
          .getMany();

        return {
          code: 200,
          message: "success",
          datas: {
            langs: queryResult[0].langs.map((lang) => { return lang.code }),
            id: queryResult[0].id,
            slug: queryResult[0].slug,
            name: queryResult[0].name,
            description: queryResult[0].description,
            creator: queryResult[0].creator,
            created_at: queryResult[0].created_at.toISOString()
          }
        };
      } catch (err) {
        return { code: 500, message: "internal server error", datas: err };
      }
    else return { code: 400, message: "bad request", datas: [] };
  }
}

export default new DomainsController();
