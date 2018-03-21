import * as express from "express";

export class Routes {
  protected _router!: express.Router;
  protected _namespace!: string;
  protected _routeUri!: string;

  constructor(endpoint: string) {
    this.router = express.Router();
    this.routeUri = endpoint;
    this.namespace = "/api";
  }

  protected set router(router: express.Router) {
    this._router = express.Router();
  }

  protected set routeUri(routeUri: string) {
    this._routeUri = routeUri;
  }

  protected set namespace(namespace: string) {
    this._namespace = namespace;
  }

  protected get router(): express.Router {
    return this._router;
  }

  protected get namespace(): string {
    return this._namespace;
  }

  protected get routeUri(): string {
    return this._routeUri;
  }
}
