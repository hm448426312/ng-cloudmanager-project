import {Observable} from 'rxjs';
import {Type, ComponentFactoryResolver, Injector} from '@angular/core';

export interface DcModalOptions {
  id?: string;
  title: string;
  component: Type<any>;
  width?: string;
  data?: any;
  handler?: Function;
  onClose?: Function;
  backdropCloseable?: boolean;
  noHeaderShadow?: boolean;
  iconCls?: any;
  hideClose?: boolean;
  hideTitle?: boolean;
  beforeHidden?: () => boolean | Promise<boolean> | Observable<boolean>;
}
