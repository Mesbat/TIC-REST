import { getManager } from "typeorm";
import { Domain } from "../models/domain";
import { Translation } from "../models/translation";
import { User } from "../models/user";
import { Request, Response } from "express";
import * as express from "express";

class Auth {
    public async domainAuth(request: Request) {
        try {
            let domain = await getManager().getRepository(Domain).findOne({ where: { slug: request.params.slug }, relations: ["creator", "langs"] });
            let user = await getManager().getRepository(User).findOne({ where: { password: request.headers.authorization } });

            if (!domain)
                throw ({ code: 404, message: "not found" });

            if (!request.headers.authorization || !user)
                throw ({ code: 401, message: "unauthorized" });

            if (user.password !== domain.creator.password)
                throw ({ code: 403, message: "forbidden" });

            return (domain);
        } catch (err) {
            return (err);
        }
    }

    public async slugAuth(request: Request) {
        try {
            let domain = await getManager().getRepository(Domain).findOne({ where: { slug: request.params.slug }, relations: ["creator", "langs"] });
            let user = await getManager().getRepository(User).findOne({ where: { password: request.headers.authorization } });

            if (!domain)
                throw ({ code: 404, message: "not found" });

            if (!request.headers.authorization || !user)
                throw ({ code: 401, message: "unauthorized" });

            if (user.password !== domain.creator.password)
                throw ({ code: 403, message: "forbidden" });

            return (domain);
        } catch (err) {
            return (err);
        }
    }

    public async simpleAuth(request: Request) {
        try {
            let user = await getManager().getRepository(User).findOne({ where: { password: request.headers.authorization } });

            if (!user)
                throw ({ code: 401, message: "unauthorized" });

            return (user);
        } catch (err) {
            return (err);
        }
    }
}

export default new Auth();
