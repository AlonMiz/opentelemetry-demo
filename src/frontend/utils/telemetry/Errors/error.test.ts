import { describe, expect, test } from 'vitest';
import { errorService } from './error.service';
const {
  error,
  promiseRejectionError,
  promiseRejectionString,
  promiseRejectionThrow,
  rangeError,
  referenceError,
  syntaxError,
  typeError,
  uriError,
} = errorService.errors;

describe('Error service', () => {
  describe('Parse', () => {
    test('typeError', () => {
      try {
        typeError();
      } catch (error) {
        const parsed = errorService.parse(error);
        expect(parsed).toEqual({
          message: 'foo2.bar is not a function',
          stack: expect.stringContaining('TypeError: foo2.bar is not a function'),
          name: 'TypeError',
          type: 'Error',
        });
      }
    });
    test('PromiseRejectionError', async () => {
      const error = await new Promise<PromiseRejectionEvent>(resolve => {
        process.on('unhandledRejection', (event: PromiseRejectionEvent) => {
          resolve(event);
        });
        promiseRejectionError();
      });
      const parsed = errorService.parse(error);
      expect(parsed).toEqual({
        message: 'Error in promise',
        name: 'Error',
        type: 'Error',
        stack: expect.stringContaining('Error: Error in promise'),
      });
    });

    test('PromiseRejectionString', async () => {
      const error = await new Promise<PromiseRejectionEvent>(resolve => {
        process.on('unhandledRejection', (event: PromiseRejectionEvent) => {
          resolve(event);
        });
        promiseRejectionString();
      });
      const parsed = errorService.parse(error);
      expect(parsed).toEqual({
        message: 'Something went wrong',
        type: 'Unknown Error String',
      });
    });

    test('PromiseRejectionThrow', async () => {
      const error = await new Promise<PromiseRejectionEvent>(resolve => {
        process.on('unhandledRejection', (event: PromiseRejectionEvent) => {
          console.log('event', event);
          resolve(event);
        });
        promiseRejectionThrow();
      });
      const parsed = errorService.parse(error);
      expect(parsed).toEqual({
        message: 'Throw in promise',
        cause: undefined,
        name: 'Error',
        type: 'Error',
        stack: expect.stringContaining('Error: Throw in promise'),
      });
    });

    test('Regular Error', () => {
      try {
        error();
      } catch (error) {
        const parsed = errorService.parse(error);
        expect(parsed).toEqual({
          message: 'Regular Error',
          stack: expect.stringContaining('Error: Regular Error'),
          type: 'Error',
          name: 'Error',
        });
      }
    });
    test('Syntax Error', () => {
      try {
        syntaxError();
      } catch (error) {
        const parsed = errorService.parse(error);
        expect(parsed).toEqual({
          message: 'Unexpected identifier',
          stack: expect.stringContaining('SyntaxError: Unexpected identifier'),
          type: 'Error',
          name: 'SyntaxError',
        });
      }
    });

    test('Reference Error', () => {
      try {
        referenceError();
      } catch (error) {
        const parsed = errorService.parse(error);
        expect(parsed).toEqual({
          message: 'foo is not defined',
          stack: expect.stringContaining('ReferenceError: foo is not defined'),
          type: 'Error',
          name: 'ReferenceError',
        });
      }
    });

    test('Range Error', () => {
      try {
        rangeError();
      } catch (error) {
        const parsed = errorService.parse(error);
        expect(parsed).toEqual({
          message: 'Invalid array length',
          stack: expect.stringContaining('RangeError: Invalid array length'),
          type: 'Error',
          name: 'RangeError',
        });
      }
    });

    test('URI Error', () => {
      try {
        uriError();
      } catch (error) {
        const parsed = errorService.parse(error);
        expect(parsed).toEqual({
          message: 'URI malformed',
          stack: expect.stringContaining('URIError: URI malformed'),
          type: 'Error',
          name: 'URIError',
        });
      }
    });

    test('Unknown Error String', () => {
      const parsed = errorService.parse('foo');
      expect(parsed).toEqual({
        message: 'foo',
        type: 'Unknown Error String',
      });
    });

    test('Unknown Error Object', () => {
      const parsed = errorService.parse({});
      expect(parsed).toEqual({
        message: 'Error',
        name: 'Error',
        stack: undefined,
        meta: undefined,
        type: 'Unknown Error Object',
      });
    });
    test('ErrorEvent', () => {
      const parsed = errorService.parse(
        new ErrorEvent('error event', { error: new Error('Error generated from error event') })
      );
      expect(parsed).toEqual({
        columnNumber: 0,
        filename: '',
        lineNumber: 0,
        message: 'Error generated from error event',
        name: 'Error',
        stack: expect.stringContaining('Error: Error generated from error event'),
        type: 'ErrorEvent',
      });
    });

    test('Event', () => {
      const parsed = errorService.parse(new Event('event'));
      expect(parsed).toEqual({
        message: 'Unknown event',
        type: 'event',
      });
    });
  });
});
