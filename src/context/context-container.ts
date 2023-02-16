import { Context } from './context';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CONTEXT_MODULE_CONFIG, HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType, RequestType } from '../interfaces';
import { generateId } from '../tools';
// import LRUCache = require('lru-cache');

@Injectable()
export class ContextContainer {
  private contexts: Record<string, Context> = {};
  private contextStack: string[] = [];

  // private cache = new LRUCache({
  //   max: 1000,
  // });

  constructor(
    @Inject(CONTEXT_MODULE_CONFIG) private readonly config: ContextConfigType,
    private readonly moduleRef?: ModuleRef,
  ) {}
  static getId(request: RequestType): string {
    if (!!request.headers) {
      return request.headers[HEADER_REQUEST_ID] as string;
    }
    return request[HEADER_REQUEST_ID];
  }
  // private getCurrentId() {
  //   return this.contextStack[this.contextStack.length - 1];
  // }
  // current(requestId) {
  //   /// @todo jdm : this should return null as fallback and we should be using create-context decorators instead
  //   const request: RequestType = {
  //     [HEADER_REQUEST_ID]: generateId(),
  //   };
  //   // console.log('request : ', request);
  //   console.log('contextStack : ', this.contextStack);
  //   // console.log('getCurrentId : ', this.getCurrentId());
  //   console.log('contexts : ', Object.keys(this.contexts));
  //   // return this.contextStack.length
  //   //   ? this.contexts[this.getCurrentId()]
  //   //   : this.add(request);
  //   return this.get(request) ?? this.add(request);
  //   // return this.contextStack.length && this.get(request)
  //   //   ? this.get(request)
  //   //   : this.add(request);
  // }

  createContext(request: RequestType) {
    const id = ContextContainer.getId(request);

    return new Context(id, this.config, request, this.moduleRef);
  }

  createNonHttpContext() {
    const id = generateId();
    const emptyRequest: RequestType = {
      [HEADER_REQUEST_ID]: id,
    };

    return new Context(id, this.config, emptyRequest, this.moduleRef);
  }

  getContext(request: RequestType) {
    return this.contexts[ContextContainer.getId(request)] ?? null;
    // return this.cache.get(ContextContainer.getId(request)) ?? null;
  }

  addContext(context: Context) {
    // const id = ContextContainer.getId(request);
    // this.contextStack.push(id);
    this.contexts[context.getId()] = context;
    // this.cache.set(id, new Context(id, this.config, request, this.moduleRef));
    // return this.contexts[id];
    // return this.cache.get(id);
  }

  removeContext(request: RequestType) {
    const requestId = ContextContainer.getId(request);

    delete this.contexts[requestId];
    // this.cache.delete(ContextContainer.getId(request));
    // this.contextStack.pop();
    // this.contextStack = this.contextStack.filter((val) => val !== requestId);
    console.log('contextStack removed: ', this.contextStack);
    console.log('contexts removed: ', Object.keys(this.contexts));
  }
}
