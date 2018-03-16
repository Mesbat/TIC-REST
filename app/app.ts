import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import * as morgan from 'morgan';

createConnection().then(connection => {
    // Initializing Express App
    const app = express();
    app.use(bodyParser.json());
    
    // Middlewares
    app.use(morgan('tiny'));

    // Router
    app.get("/about", async function(request: Request, response: Response) {
        response.json({ Application: 'TIC-REST', Author: 'Mesbat_y', Version: 0.01 });
    });
    
    // Starting Node Server
    app.listen(3000);
});
