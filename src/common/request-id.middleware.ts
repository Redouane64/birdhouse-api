// request-id.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
    if (req.id) {
      res.set('X-Request-Id', req.id as string);
      req.headers['x-correlation-id'] = req.id as string;
    }
  }
}
