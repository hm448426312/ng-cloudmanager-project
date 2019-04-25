
import { Provider, Type } from '@angular/core';
import { DocumentRef } from './document-ref.service';

export * from './document-ref.service';

export const COMMON_SERVICES: Provider[] = [{ provide: DocumentRef, useClass: DocumentRef }];