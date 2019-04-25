import {Observable} from 'rxjs';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';

interface dcEvent {
  key: any,
  data?: any
}

@Injectable()
export class DcEventService {
  private _eventBus: Subject<dcEvent>;

  constructor() {
    this._eventBus = new Subject<dcEvent>();
  }

  broadcast(key: any, data?: any) {
    this._eventBus.next({key, data});
  }

  on(key: any): Observable<any> {
    return this._eventBus.asObservable().filter(event => event.key === key).map(event => event.data);
  }
}
