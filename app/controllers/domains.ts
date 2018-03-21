import * as express from "express";
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Domain } from "../models/domains";

class DomainsController {
  public async getDomains(request: Request, response: Response) {
    if (request.params.format === "json")
      try {
        return {
          code: "200",
          message: "success",
          datas: await getManager()
            .getRepository(Domain)
            .find({ select: ["id", "slug", "name", "description"] })
        };
      } catch (err) {
        return err;
      }
    else return { code: "400", message: "bad request", datas: [] };
  }
}

export default new DomainsController();
