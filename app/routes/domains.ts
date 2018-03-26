import { Routes } from "./routes";
import { getManager } from "typeorm";
import DomainsController from "../controllers/domains";
import * as express from "express";

class Domains extends Routes {
  constructor() {
    super("/domains(/:name)?.:format");

    this._router.route(this.routeUri).get(async (request, response) => {
      try {
        let json = request.params.name ? await DomainsController.show(request, response) : await DomainsController.index(request, response);
        response.status(json.code).json(json);
      } catch (error) {
        console.log(error);
        response.status(400).json(error);
      }
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
