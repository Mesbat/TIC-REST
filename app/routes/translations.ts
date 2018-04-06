import { Routes } from "./routes";
import { getManager } from "typeorm";
import TranslationsController from "../controllers/translations";
import * as express from "express";

class Translations extends Routes {
  constructor() {
    super("/domains");

    this._router.route(`${this.routeUri}/:slug/translations.:format`).get(async (request, response) => {
      try {
        let json = await TranslationsController.index(request, response);
        response.status(json.code).json(json);
      } catch (error) {
        console.log(error);
        response.status(400).json({ code: 400, message: "bad request", datas: error.message });
      }
    });

    this._router.route(`${this.routeUri}/:slug/translations.:format`).post(async (request, response) => {
      try {
        let json = await TranslationsController.create(request, response);
        response.status(json.code).json(json);
      } catch (error) {
        response.status(400).json({ code: 400, message: "bad request", datas: error.code === 'ER_DUP_ENTRY' ? 'translation already registered' : error.message });
      }
    });

    this._router.route(`${this.routeUri}/:slug/translations/:id.:format`).put(async (request, response) => {
      try {
        let json = await TranslationsController.put(request, response);
        response.status(json.code).json(json);
      } catch (error) {
        response.status(400).json({ code: 400, message: "bad request", datas: error.code === 'ER_DUP_ENTRY' ? 'translation already registered' : error.message });
      }
    });

    this._router.route(`${this.routeUri}/:slug/translations/:id.:format`).delete(async (request, response) => {
      try {
        let json = await TranslationsController.delete(request, response);
        response.status(json.code).json(json);
      } catch (error) {
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

export default new Translations();
