import { ModuleMetadata, Type } from '@nestjs/common';
import {
  BuildContextFromCallbackType,
  BuildContextType,
} from './build-context.type';
import { ContextName } from './context-name.enum';
import { IContextPropertyProvider } from './context-property-provider.interface';

type CommonConfig = {
  cache?: boolean;
  providers?: Type<IContextPropertyProvider>[];
  imports?: ModuleMetadata['imports'];
  correlation_id?: {
    generator?: true | BuildContextFromCallbackType;
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
        type: ContextName.GQL_HTTP;
        build: BuildContextType<ContextName.GQL_HTTP>;
      }
    | {
        type: ContextName.GQL_WS;
        build: BuildContextType<ContextName.GQL_WS>;
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
