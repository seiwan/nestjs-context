import { Type } from '@nestjs/common';
import {
  BuildContextFromCallbackType,
  BuildContextType,
} from './build-context.type';
import { ContextName } from './context-name.enum';
import { IContextPropertyProvider } from './context-property-provider.interface';

type CommonConfig = {
  providers?: Type<IContextPropertyProvider>[];
  correlation_id?: {
    generator?: BuildContextFromCallbackType;
    header?: string;
  };
};
export type ConfigType = CommonConfig &
  (
    | {
        type: ContextName.HTTP;
        build: BuildContextType<ContextName.HTTP>;
      }
    | {
        type: ContextName.GQL;
        build: BuildContextType<ContextName.GQL>;
      }
    | {
        type: ContextName.RPC;
        build: BuildContextType<ContextName.RPC>;
      }
    | {
        type: ContextName.WS;
        build: BuildContextType<ContextName.WS>;
      }
  );
