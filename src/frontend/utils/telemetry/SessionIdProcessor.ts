// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { Context } from '@opentelemetry/api';
import { ReadableSpan, Span, SpanProcessor } from '@opentelemetry/sdk-trace-web';
import SessionGateway from '../../gateways/Session.gateway';
import { AttributeNames } from '../enums/AttributeNames';

const { userId } = SessionGateway.getSession();

export class SessionIdProcessor implements SpanProcessor {
  meta: Record<string, string> = {};
  constructor(meta?: Record<string, string>) {
    if (meta && typeof meta !== 'object') throw new Error('meta must be an object');
    this.meta = meta ?? {};
  }
  forceFlush(): Promise<void> {
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStart(span: Span, parentContext: Context): void {
    span.setAttribute(AttributeNames.SESSION_ID, userId);
    Object.entries(this.meta).forEach(([k, v]) => {
      span.setAttribute(k, v);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onEnd(span: ReadableSpan): void {}

  shutdown(): Promise<void> {
    return Promise.resolve();
  }
}
