// Npm Packages
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import * as clc from 'cli-color';
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import * as morgan from 'morgan';

// Routers
import Domains from "./routes/domains";
import Translations from "./routes/translations";
import Langs from "./routes/langs";

createConnection().then(connection => {
    // Initializing Express App
    const app = express();

    // Middlewares
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));

    // Info Route
    app.get("/about", (request: Request, response: Response) => {
        response.json({ Application: 'TIC-REST', Author: 'Mesbat_y', Version: 0.09 });
    });

    // Routes
    app.use(Domains.endpoint(), Domains.routes());
    app.use(Translations.endpoint(), Translations.routes());
    app.use(Langs.endpoint(), Langs.routes());

    app.use((request: Request, response: Response) => {
        response.status(404).json({
            code: response.statusCode,
            message: 'not found'
        });
    });

    // Starting Node Server
    app.listen(80, () => console.log(`${clc.green('Server Successfully started on port')} ${clc.blue('80')}`));
}, error => console.log(clc.red("TypeORM Error: " + error)));
