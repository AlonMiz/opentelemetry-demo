import { useEffect, useRef } from 'react';

const throwRandomError = () => {
  const random = Math.random();
  if (random > 0.5) {
    throw new Error('Random error: ' + random);
  }
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Random error: ' + random);
    }, 1000);
  });
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
