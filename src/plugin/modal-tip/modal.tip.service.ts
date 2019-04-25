import {Injectable} from '@angular/core';
import {ModalService} from '../modal/modal.service';
import {ModalTipComponent} from './modal.tip.component';


@Injectable()
export class ModalTipService {
  constructor(private modal: ModalService) {
  }

  openTip(config: any): any {
    const result = this.modal.open({
      id: config.id || 'modal-tip-outer',
      component: ModalTipComponent,
      title: config.title || '',
      width: config.width || '450px',
      data: config,
      noHeaderShadow: true,
      handler: (btn: any) => {
        if (config.handler) {
          config.handler(btn);
        }
        result.modalInstance.hide();
      },
      backdropCloseable: config.backdropCloseable || false
    });
    return result;
  }
}
