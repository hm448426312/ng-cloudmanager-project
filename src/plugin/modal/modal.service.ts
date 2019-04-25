import * as _ from 'lodash';
import {
  Injectable,
  ComponentFactoryResolver,
  ComponentFactory,
  Injector,
  ComponentRef,
  ViewRef,
  ApplicationRef,
  EmbeddedViewRef
} from '@angular/core';
import {ModalComponent} from './modal.component';
import {DocumentRef} from '../document-ref/document-ref.service';
import {DcModalOptions} from './modal.type';

@Injectable()
export class ModalService {
  constructor(private cfr: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private doc: DocumentRef,
              private injector: Injector,) {
  }

  insert(viewRef: ViewRef) {
    this.appRef.attachView(viewRef);
    this.doc.body.insertBefore((viewRef as EmbeddedViewRef<any>).rootNodes[0], this.doc.body.childNodes[0]);
    return viewRef;
  }

  createComponent<C>(cf: ComponentFactory<C>) {
    const componentRef = cf.create(this.injector) as ComponentRef<C>;
    this.insert(componentRef.hostView);
    return componentRef;
  }

  open({id, title, component, width, data, handler, noHeaderShadow, iconCls, backdropCloseable, onClose, hideClose, hideTitle, beforeHidden}: DcModalOptions) {
    const modalRef = this.createComponent(this.cfr.resolveComponentFactory(ModalComponent));
    _.assign(modalRef.instance, {
      id,
      title,
      width,
      noHeaderShadow,
      iconCls,
      beforeHidden,
      hideClose,
      hideTitle,
      backdropCloseable: _.isUndefined(backdropCloseable) ? true : backdropCloseable
    });
    const modalContentInstance = modalRef.instance.modalContainerHost.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(component));
    _.assign(modalContentInstance.instance, {data, handler});
    modalRef.instance.onHidden = () => {
      if (onClose) {
        onClose();
      }
      modalRef.hostView.destroy();
    };
    modalRef.instance.show();
    return {
      modalInstance: modalRef.instance,
      modalContentInstance: modalContentInstance.instance
    };
  }
}
