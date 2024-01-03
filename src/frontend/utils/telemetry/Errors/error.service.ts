type GeneralError = {
  message: string;
  stack?: string;
  name?: string;
  filename?: string;
  lineNumber?: number;
  columnNumber?: number;
  meta?: string;
  cause?: string;
  reason?: string;
  type?: string;
};

const parseErrorEvent = (errorEvent: ErrorEvent): GeneralError => {
  const { message, filename, lineno, colno, error } = errorEvent;
  const parsedError = parse(error);
  return {
    message: parsedError.message ?? message,
    filename,
    lineNumber: lineno,
    columnNumber: colno,
    stack: parsedError.stack,
    name: parsedError.name,
    type: 'ErrorEvent',
  };
};

const stringify = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(stringify).join(', ');
  if (value === null) return undefined;
  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) return undefined;
  }
  try {
    return JSON.stringify(value);
  } catch (error) {
    return `${value}`;
  }
};

const parseEvent = (event: Event): GeneralError => {
  const { type } = event;
  return { type, message: 'Unknown event' };
};

const parseError = (error: Error): GeneralError => {
  const { message, stack, name, cause } = error;
  return { message, stack, name, cause: stringify(cause), type: 'Error' };
};

const parseUnknownError = (error: unknown): GeneralError => {
  if (typeof error === 'string') {
    return { message: error, type: 'Unknown Error String' };
  }
  if (typeof error === 'object') {
    const { message = 'Error', stack, name = 'Error', ...meta } = error as Error;
    return { message, stack, name, meta: stringify(meta), type: 'Unknown Error Object' };
  }
  return { message: 'Unknown error', name: 'Unknown Error Type' };
};

export type AnyError = Error | ErrorEvent | PromiseRejectionEvent | unknown;
const parse = (error: AnyError) => {
  if (error instanceof ErrorEvent) {
    return parseErrorEvent(error);
  }

  if (error instanceof Event) {
    return parseEvent(error);
  }
  if (error instanceof Error) {
    return parseError(error);
  }
  return parseUnknownError(error);
};

const errors = {
  typeError: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const foo: any = {};
    foo.bar();
  },
  syntaxError: () => {
    eval('foo bar');
  },
  referenceError: () => {
    // @ts-expect-error - intentional reference error
    foo.bar();
  },
  rangeError: () => {
    new Array(-1);
  },
  uriError: () => {
    decodeURIComponent('%');
  },
  error: () => {
    throw new Error('Regular Error');
  },
  promiseRejectionString: () => {
    Promise.reject('Something went wrong');
  },
  promiseRejectionError: () => {
    Promise.reject(new Error('Error in promise'));
  },
  promiseRejectionThrow: async () => {
    throw new Error('Throw in promise');
  },
};

export const errorService = {
  parse,
  errors,
};
