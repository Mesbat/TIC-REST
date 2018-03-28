import { Routes } from "./routes";
import { getManager } from "typeorm";
import DomainsController from "../controllers/domains";
import * as express from "express";

class Domains extends Routes {
  constructor() {
    super("/domains");

    this._router.route(`${this.routeUri}.:format`).get(async (request, response) => {
      try {
        let json = await DomainsController.index(request, response);
        response.status(json.code).json(json);
      } catch (error) {
        response.status(400).json({ code: 400, message: "bad request", datas: error.message});
      }
    });

    this._router.route(`${this.routeUri}/:name.:format`).get(async (request, response) => {
      try {
        let json = await DomainsController.showDomain(request, response);
        response.status(json.code).json(json);
      } catch (error) {
        response.status(400).json({ code: 400, message: "bad request", datas: error.message });
      }
    });

    this._router.route(`${this.routeUri}/:name/translations.:format`).get(async (request, response) => {
      try {
        let json = await DomainsController.showDomainTranslations(request, response);
        response.status(json.code).json(json);
      } catch (error) {
        console.log(error);
        response.status(400).json({ code: 400, message: "bad request", datas: error.message });
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
