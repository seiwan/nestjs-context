import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { ContextContainer } from '../context/context-container';
import { HEADER_REQUEST_ID } from '../constants';

@Injectable()
export class CreateContextMiddleware implements NestMiddleware {
  constructor(private readonly contexts: ContextContainer) {}
  use(req: any, res: any, next: () => void) {
    this.contexts.add(req);
    res.on('finish', () => {
      console.log('request headers request_id', req.headers[HEADER_REQUEST_ID]);
      console.log('request url', req.baseUrl);
      console.log('request id', req[HEADER_REQUEST_ID]);
      this.contexts.remove(req);
    });
    next();
  }
}
