import { StatusCodes } from "http-status-codes";
import type { Request, Response, NextFunction } from "express";
import { DISPLAY_ERRORS } from "./env";

export const validate = <T>(fn: () => T): T => {
  try {
    return fn();
  } catch(e: any) {
    throw new ApiError(StatusCodes.BAD_REQUEST, String(e?.message || "Bad request"))
  }
}

export const pageHandler = (fn: (req: Request, res: Response, next: NextFunction) => any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch(e: any) {
      
      if(e instanceof ApiError) {
        if(e.status === StatusCodes.FORBIDDEN) {
          return res.json({
            status: 302,
            redirect: "/login"
          })
        } else {
          return res.status(e.status).json({
            status: e.status,
            error: e.message,
          })
        }
      }

      const status = Number(e?.status) || 500;
      const message = DISPLAY_ERRORS ? String(e?.message) : "Internal server error";
      
      return res.status(status).json({
        status,
        error: message,
      })
    }
  }
}

export const handler = (fn: (req: Request, res: Response, next: NextFunction) => any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch(e: any) {

      if(e instanceof ApiError) {
        return res
          .status(e.status)
          .json({
            error: {
              status: e.status,
              message: e.message
            }
          })
      }

      const status = Number(e?.status) || 500;
      const message = DISPLAY_ERRORS ? String(e?.message) : "Internal server error";
          
      return res
        .status(status)
        .json({ error: { status, message } })
    }
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}