import { Routes } from "./routes";
import { getManager } from "typeorm";
import DomainsController from "../controllers/domains";
import * as express from "express";

class Domains extends Routes {
  constructor() {
    super("/domains(/:name)?.:format");

    this._router.route(this.routeUri).get(async (request, response) => {
      if (!request.params.name) {
        let json = await DomainsController.getDomains(request, response);
        response.status(json.code).json(json);
      } else
        response.status(400).json({ code: 400, message: "bad request", datas: [] });
    });
  }

  public routes(): express.Router {
    return this.router;
  }

  public endpoint(): string {
    return this.namespace;
  }
}

export default new Domains();
