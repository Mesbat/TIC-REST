import { Routes } from "./routes";
import * as express from "express";

export class Domains extends Routes {
    constructor() {
        super('/domains(.:format)?');

        this._router.route(this.routeUri)
            .get(async function (request, response) {
                response.json({ code: 200, message: 'success', format: request.params.format });
            })
    }

    public routes(): express.Router {
        return (this.router);
    }

    public endpoint(): string {
        return (this.namespace);
    }
}