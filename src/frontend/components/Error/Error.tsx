import { useEffect, useRef } from 'react';
import { errorService } from '../../utils/telemetry/Errors/error.service';

const { errors } = errorService;

const throwRandomError = () => {
  const errorKeys = Object.keys(errors) as Array<keyof typeof errors>;
  const randomKey = errorKeys[Math.floor(Math.random() * errorKeys.length)];
  errors[randomKey]();
};

export const ErrorButton = () => {
  return <button onClick={() => throwRandomError()}>Throw a random error</button>;
};

export const AnotherErrorButton = () => {
  return <button onClick={() => throwRandomError()}>WOW</button>;
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
