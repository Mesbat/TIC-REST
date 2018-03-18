// Npm Packages
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import * as morgan from 'morgan';

// Endpoints
import { Domains } from "./routes/domains";

createConnection().then(connection => {
    // Initializing Express App
    const app = express();
    app.use(bodyParser.json());

    // Middlewares
    app.use(morgan('tiny'));

    // Info Route
    app.get("/about", async function (request: Request, response: Response) {
        response.json({ Application: 'TIC-REST', Author: 'Mesbat_y', Version: 0.01 });
    });

    // Routes
    let domainsRouter = new Domains();
    app.use(domainsRouter.endpoint(), domainsRouter.routes());

    // Starting Node Server
    app.listen(3000);
    console.log('Server Successfully started on port 3000');
});
