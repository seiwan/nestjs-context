import { HEADER_REQUEST_ID } from '../constants';
import { ContextConfigType, RequestType } from '../interfaces';
import { ContextName } from '../interfaces/context-name.enum';
import { ContextContainer } from './context-container';

describe('context-container test', () => {
  let config: ContextConfigType;
  let request: RequestType;
  let request2: RequestType;

  beforeEach(() => {
    config = {
      type: ContextName.HTTP,
      build: {},
    };
    request = {
      headers: {
        [HEADER_REQUEST_ID]: 'request_id_1',
      },
      [HEADER_REQUEST_ID]: 'unwanted_request_id_1',
    };
    request2 = {
      headers: {
        [HEADER_REQUEST_ID]: 'request_id_2',
      },
      [HEADER_REQUEST_ID]: 'unwanted_request_id_2',
    };
  });

  it('should add context', () => {
    const container = new ContextContainer(config);
    const context = container.add(request);

    expect(context.getId()).toEqual('request_id_1');
  });

  it('should remove context', () => {
    const container = new ContextContainer(config);
    container.add(request);
    container.remove(request);

    expect(container.get(request)).toBeNull();
  });

  it('should add 2 contexts and remove them (chrono order)', () => {
    const container = new ContextContainer(config);
    const context1 = container.add(request);
    const context2 = container.add(request2);

    expect(context1.getId()).toEqual('request_id_1');
    expect(context2.getId()).toEqual('request_id_2');

    container.remove(request);
    expect(container.get(request)).toBeNull();
    expect(container.get(request2).getId()).toEqual('request_id_2');

    container.remove(request2);
    expect(container.get(request2)).toBeNull();
  });

  it('should add 2 contexts and remove them', () => {
    const container = new ContextContainer(config);
    const context1 = container.add(request);
    const context2 = container.add(request2);

    expect(context1.getId()).toEqual('request_id_1');
    expect(context2.getId()).toEqual('request_id_2');

    container.remove(request2);
    expect(container.get(request2)).toBeNull();
    expect(container.get(request).getId()).toEqual('request_id_1');

    container.remove(request);
    expect(container.get(request)).toBeNull();
  });

  it('should not get current context for request 1 after remove it', () => {
    const container = new ContextContainer(config);
    const context1 = container.add(request);
    const context2 = container.add(request2);

    expect(context1.getId()).toEqual('request_id_1');
    expect(context2.getId()).toEqual('request_id_2');

    container.remove(request);
    expect(container.current().getId()).not.toEqual('request_id_1');
    expect(container.current().getId()).not.toEqual('request_id_2');
    expect(container.current().getId()).not.toBeNull();
  });

  it('should not get current context for request 2 after remove it', () => {
    const container = new ContextContainer(config);
    const context1 = container.add(request);
    const context2 = container.add(request2);

    expect(context1.getId()).toEqual('request_id_1');
    expect(context2.getId()).toEqual('request_id_2');

    container.remove(request2);
    expect(container.current().getId()).toEqual('request_id_1');
    expect(container.current().getId()).not.toEqual('request_id_2');
    expect(container.current().getId()).not.toBeNull();
  });

  it('should create a context if not existing current', () => {
    const container = new ContextContainer(config);

    expect(container.current().getId()).not.toBeNull();
  });
});
