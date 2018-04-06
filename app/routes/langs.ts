import { Routes } from "./routes";
import { getManager } from "typeorm";
import LangController from "../controllers/lang";
import * as express from "express";

class Langs extends Routes {
  constructor() {
    super("/domains");

    this._router.route(`${this.routeUri}/:slug/langs/:lang.:format`).delete(async (request, response) => {
      try {
        let json = await LangController.deleteDomainLang(request, response);
        response.status(json.code).json(json);
      } catch (error) {
        response.status(400).json({ code: 400, message: "bad request", datas: error.message || error });
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

export default new Langs();
