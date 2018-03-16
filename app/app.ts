import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";

const app = express();
app.use(bodyParser.json());

app.listen(3000);
console.log("App.ts");
