import { InstrumentationBase } from '@opentelemetry/instrumentation';
import { AnyError, errorService } from './error.service';

export class ErrorInstrumentation extends InstrumentationBase {
  constructor() {
    super('error-instrumentation', 'v0.1.0');
  }
  protected init(): void {}

  report(error: AnyError) {
    const { message, stack, type, cause, columnNumber, filename, lineNumber, meta, name, reason } =
      errorService.parse(error);
    const span = this.tracer.startSpan(name);
    span.setAttribute('error.message', message);
    if (stack) span.setAttribute('error.stack', stack);
    if (type) span.setAttribute('error.type', type);
    if (cause) span.setAttribute('error.cause', cause);
    if (columnNumber) span.setAttribute('error.columnNumber', columnNumber);
    if (filename) span.setAttribute('error.filename', filename);
    if (lineNumber) span.setAttribute('error.lineNumber', lineNumber);
    if (meta) span.setAttribute('error.meta', meta);
    if (name) span.setAttribute('error.name', name);
    if (reason) span.setAttribute('error.reason', reason);

    span.end();
  }
  enable() {
    window.addEventListener('error', (event: ErrorEvent) => {
      this.report(event.error);
    });

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.report(event);
    });
    document.documentElement.addEventListener(
      'error',
      (event: ErrorEvent) => {
        this.report(event);
      },
      { capture: true }
    );
  }
}
