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
        return {
          code: 200,
          message: "success",
          datas: await getManager()
            .createQueryBuilder(Domain, 'domain')
            .leftJoin('domain.creator', 'domain')
            .leftJoin('domain.langs', 'lang')
            .where('domain.name = :name')
            .setParameter('name', request.params.name)
            .select(['langs.code', 'domain.id', 'domain.slug', 'domain.name', 'domain.description', 'creator.id', 'creator.username', 'domain.created_at'])
            .getMany()
        };
      } catch (err) {
        return { code: 500, message: "internal server error", datas: err };
      }
    else return { code: 400, message: "bad request", datas: [] };
  }
}

export default new DomainsController();
