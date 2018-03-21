import { Routes } from "./routes";
import DomainsController from "../controllers/domains";
import * as express from "express";

class Domains extends Routes {
  constructor() {
    super("/domains.:format");

    this._router.route(this.routeUri).get(async (request, response) => {
      response.json(await DomainsController.getDomains(request, response));
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
