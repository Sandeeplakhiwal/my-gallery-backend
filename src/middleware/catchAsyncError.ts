import { NextFunction, Request, Response } from "express";

export const catchAsyncError =
  (
    passedFunction: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<any>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
  };
