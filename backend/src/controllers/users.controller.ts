import { Request, RequestHandler } from "express";
import { ZodType } from "zod";

type RequestSchemas = {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
};

export function validationMw(schemas: RequestSchemas): RequestHandler {
    return (req, _res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }

            if (schemas.query) {
                req.query = schemas.query.parse(req.query) as Request["query"];
            }

            if (schemas.params) {
                req.params = schemas.params.parse(req.params) as Request["params"];
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}