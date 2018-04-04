import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Domain } from "../models/domain";
import { Translation } from "../models/translation";
import { TranslationToLang } from "../models/translation-to-lang";

import Auth from "../services/auth";

interface showTranslationFormat {
  id: number;
  code: string;
  trans: any;
}

class TranslationsController {
  public async index(request: Request, response: Response) {
    if (request.params.format === "json") {
      if (
        !await getManager()
          .getRepository(Domain)
          .count({ name: request.params.name })
      )
        return { code: 404, message: "not found" };

      let queryResult = await getManager()
        .createQueryBuilder(Translation, "translation")
        .leftJoin("translation.domain", "domain")
        .leftJoin("domain.langs", "langs")
        .leftJoin("translation.translatedValues", "translatedValues")
        .leftJoin("translatedValues.lang", "lang")
        .where("domain.name = :name")
        .setParameter("name", request.params.name)
        .select([
          "translation.id",
          "translation.code",
          "translatedValues.trans",
          "lang.code",
          "langs.code"
        ])
        .getMany();

      return {
        code: 200,
        message: "success",
        datas: this.showTranslationFormatter(queryResult)
      };
    } else return { code: 400, message: "bad request", datas: [] };
  }

  public async create(request: Request, response: Response) {
    let auth = await Auth.domainAuth(request);

    if (request.params.format !== "json")
      return { code: 400, message: "bad request", datas: [] };

    if (!(auth instanceof Domain)) return auth;

    if (request.body.code.length < 2)
      return {
        code: 400,
        message: "bad request",
        datas: `translation code is too short`
      };

    for (var lang in request.body.trans) {
      let unregisteredLang: any = lang;

      auth.langs.forEach(registeredLang => {
        if (registeredLang.code === lang) unregisteredLang = false;
      });

      if (unregisteredLang)
        return {
          code: 400,
          message: "bad request",
          datas: `[${unregisteredLang}] is not a registered language`
        };
    }

    let translation = new Translation();
    translation.code = request.body.code;
    translation.domain = auth;
    translation.translatedValues = auth.langs.map(lang => {
      let translatedValue = new TranslationToLang();
      translatedValue.lang = lang;
      translatedValue.translation = translation;
      translatedValue.trans =
        (request.body.trans && request.body.trans[lang.code]) ||
        translation.code;

      return translatedValue;
    });

    translation = await getManager().save(translation);

    return {
      code: 201,
      message: "success",
      datas: this.showTranslationFormatter([translation])[0]
    };
  }

  public async put(request: Request, response: Response) {
    let auth = await Auth.domainAuth(request);
    let translation =
      (await getManager()
        .getRepository(Translation)
        .findOneById(request.params.id, {
          relations: [
            "translatedValues",
            "translatedValues.lang",
            "domain",
            "domain.langs"
          ]
        })) || false;

    if (request.params.format !== "json")
      return { code: 400, message: "bad request", datas: [] };

    if (!(auth instanceof Domain)) return auth;

    if (!(translation instanceof Translation))
      return { code: 404, message: "not found" };

    if (!(request.body.trans instanceof Object))
      return {
        code: 400,
        message: "bad request",
        datas: "no given translations"
      };

    for (var lang in request.body.trans) {
      let unregisteredLang: any = lang;

      auth.langs.forEach(registeredLang => {
        if (registeredLang.code === lang) {
          unregisteredLang = false;
          if (translation instanceof Translation) {
            if (!translation.translatedValues.find(x => x.lang.code === lang)) {
              let translatedValue = new TranslationToLang();

              translatedValue.lang = registeredLang;
              translatedValue.translation = translation;
              translatedValue.trans = translation.code;
              translation.translatedValues.push(translatedValue);
            }
          }
        }
      });

      if (unregisteredLang)
        return {
          code: 400,
          message: "bad request",
          datas: `[${unregisteredLang}] is not a registered language`
        };
    }

    translation.translatedValues = translation.translatedValues.map(
      translatedValue => {
        translatedValue.trans =
          request.body.trans[translatedValue.lang.code] ||
          translatedValue.trans;

        if (translation instanceof Translation)
          translatedValue.translation = translation;

        return translatedValue;
      }
    );

    translation = await getManager().save(translation);

    return {
      code: 200,
      message: "success",
      datas: this.showTranslationFormatter([translation])[0]
    };
  }

  public async delete(request: Request, response: Response) {
    let auth = await Auth.domainAuth(request);
    let translation = await getManager().getRepository(Translation).findOneById(request.params.id);

    if (request.params.format !== "json")
      return { code: 400, message: "bad request", datas: [] };

    if (!(auth instanceof Domain)) return auth;

    return { code: 200, message: "success", datas: { id: request.params.id }};
  }

  private showTranslationFormatter(queryResult: Translation[]) {
    let jsonResponse = queryResult.map(translation => {
      let row: showTranslationFormat = {
        trans: {},
        id: translation.id,
        code: translation.code
      };

      translation.domain.langs.forEach(lang => {
        let translatedValue = translation.translatedValues.find(
          x => x.lang.code === lang.code
        );
        row.trans[lang.code] = translatedValue
          ? translatedValue.trans
          : translation.code;
      });

      return row;
    });

    return jsonResponse;
  }
}

export default new TranslationsController();
