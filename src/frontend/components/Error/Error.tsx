import { useEffect, useRef } from 'react';

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
    throw new Error('Error');
  },
  promiseRejection: () => {
    return Promise.reject('Promise rejection');
  },
  unhandledRejection: () => {
    Promise.reject('Unhandled rejection');
  },
  abortError: () => {
    const controller = new AbortController();
    controller.abort();
  },
  domException: () => {
    document.querySelector('foo bar');
  },
  typeErrorEvent: () => {
    const event = new Event('foo');
    // @ts-expect-error - intentional type error
    event.foo();
  },
};

const throwRandomError = () => {
  const errorKeys = Object.keys(errors) as Array<keyof typeof errors>;
  const randomKey = errorKeys[Math.floor(Math.random() * errorKeys.length)];
  errors[randomKey]();
};

export const ErrorButton = () => {
  return <button onClick={() => throwRandomError()}>Throw a random error</button>;
};

export const AnotherErrorButton = () => {
  return <button onClick={() => throwRandomError()}>Throw another random error</button>;
};

export const ElementErrorButton = () => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener('click', () => {
      throwRandomError();
    });
  }, []);

  return <button ref={ref}>Throw an element error</button>;
};
