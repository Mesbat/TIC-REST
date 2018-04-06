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
        response.status(400).json({ code: 400, message: "bad request", datas: error.message });
      }
    });

    this._router.route(`${this.routeUri}/:slug.:format`).get(async (request, response) => {
      try {
        let json = await DomainsController.show(request, response);
        response.status(json.code).json(json);
      } catch (error) {
        response.status(400).json({ code: 400, message: "bad request", datas: error.message });
      }
    });

    this._router.route(`${this.routeUri}.:format`).post(async (request, response) => {
      try {
        let json = await DomainsController.create(request, response);
        response.status(json.code).json(json);
      } catch (error) {
        response.status(400).json({ code: 400, message: "bad request", datas: error.code === 'ER_DUP_ENTRY' ? 'domain already registered' : error.message || error });
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
