import {Component, Input, OnInit, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized} from '@angular/router';
import {FileUploader} from 'ng2-file-upload';
import {FileItem} from 'ng2-file-upload/file-upload/file-item.class';
import {ParsedResponseHeaders} from 'ng2-file-upload/file-upload/file-uploader.class';
import * as _ from 'lodash';

@Component({
  selector: 'dc-file-upload',
  template: `
    <a href="javascript:;" class="a-upload">
      <input #fileUploadInput type="file" ng2FileSelect [uploader]="uploader" [accept]="acceptType"
             (change)="selectedFileOnChanged($event)" [multiple]="multiple"/>上传文件
    </a>
    <div *ngIf="showList">
      <p *ngFor="let item of selectedFiles">{{item.file.name}}</p>
    </div>
  `,
  styles: [
      `
      .a-upload {
        position: relative;
        display: inline-block;
        background: #D0EEFF;
        border: 1px solid #99D3F5;
        border-radius: 4px;
        padding: 4px 12px;
        overflow: hidden;
        color: #1E88C7;
        text-decoration: none;
        text-indent: 0;
        line-height: 20px;
      }

      .a-upload input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
      }

      .a-upload:hover {
        background: #AADFFD;
        border-color: #78C3F3;
        color: #004974;
        text-decoration: none;
      }
    `
  ]
})
export class FileUploadComponent implements OnInit {
  selectedFiles: any = [];
  fileAcceptType: any = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.csv': 'text/csv',
    '.doc': 'application/msword',
    '.png': 'image/png',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.wps': 'application/vnd.ms-works',
    '.xls': 'application/vnd.ms-excel',
    '.xml': 'text/xml,application/xml',
    '.zip': 'application/zip',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xltx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  @Input() multiple: boolean;
  @Input() fileMaxSize: number;
  @Input() showList: boolean;
  @Input() checkBak: any;
  _options: any;
  uploader: FileUploader;
  acceptTypeArr: string[];
  _acceptType: any;
  @Input() set acceptType(v) {
    const temp = [];
    this.acceptTypeArr = v || null;
    if (v && v.length > 0) {
      for (let i = 0; i < v.length; i++) {
        if (this.fileAcceptType[v[i]] !== undefined) {
          temp.push(this.fileAcceptType[v[i]]);
        }
      }
    }
    if (temp.length > 0) {
      this._acceptType = temp.join(',');
    }
  }

  get acceptType() {
    return this._acceptType;
  }

  @Output() fileChangeEvent = new EventEmitter();
  @Output() beforeUpload = new EventEmitter();
  @Output() success = new EventEmitter();
  @Output() error = new EventEmitter();
  @Output() progress = new EventEmitter();

  @Input() set options(v) {
    this._options = v;
    this.uploader = new FileUploader(this._options);
    this.uploader.onAfterAddingFile = (item) => {
      if (this._options.encodeFilename) {
        item.file.name = encodeURIComponent(item.file.name);
      }
    };
    this.uploader.onBeforeUploadItem = this.beforeUploadItem.bind(this);
    this.uploader.onSuccessItem = this.successItem.bind(this);
    this.uploader.onErrorItem = this.errorItem.bind(this);
    this.uploader.onProgressItem = this.progressItem.bind(this);
  }

  get options() {
    return this._options;
  }

  @ViewChild('fileUploadInput') fileUploadInput: ElementRef;

  ngOnInit(): void {
  }

  selectedFileOnChanged(event: any) {
    if (!this.uploader.queue || this.uploader.queue.length == 0) {
      return;
    }
    const fileItem = this.uploader.queue;
    if (this.multiple) {
      for (let i = 0; i < fileItem.length; i++) {
        this.checkFileItem(fileItem[i]);
      }
    } else {
      for (let i = 0; i < fileItem.length - 1; i++) {
        this.clearFileItem(fileItem[i]);
      }
      if (this.options.selfCheck) {
        const flag: boolean = this.options.selfCheck(this.uploader.queue[0], this.checkBak);
        if (!flag) {
          this.clearFileItem(this.uploader.queue[0]);
        }
      } else {
        this.checkFileItem(this.uploader.queue[0]);
      }
      // this.checkFileItem(this.uploader.queue[0]);
    }
  }

  checkFileItem(fileItem: any) {
    if (!fileItem.file) {
      return;
    }
    const fileSize = fileItem.file.size;
    if (this.fileMaxSize && fileSize > this.fileMaxSize) {
      this.error.emit('overSize');
      this.clearFileItem(fileItem);
    } else {
      if (fileItem.file.name.lastIndexOf('.') === -1) {
        this.error.emit('errorType');
        this.clearFileItem(fileItem);
      } else {
        const fileSuffix = fileItem.file.name.slice(fileItem.file.name.lastIndexOf('.'));
        if (this.acceptTypeArr && this.acceptTypeArr.length > 0) {
          const index = _.findIndex(this.acceptTypeArr, function (o) {
            return o.toLowerCase() === fileSuffix.toLowerCase();
          });
          if (index === -1) {
            this.error.emit('errorType');
            this.clearFileItem(fileItem);
          } else {
            this.outputFileChangeEvent(fileItem);
          }
        } else {
          this.outputFileChangeEvent(fileItem);
        }
      }
    }
  }

  outputFileChangeEvent(fileItem: any) {
    if (this.multiple) {
      let flag = false;
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (this.selectedFiles[i] == fileItem) {
          flag = true;
        }
      }
      if (!flag) {
        this.selectedFiles.push(fileItem);
      }
    } else {
      this.selectedFiles = [fileItem];
    }
    this.fileChangeEvent.emit(fileItem);
  }

  clearFileItem(fileItem?: any) {
    if (fileItem) {
      this.uploader.removeFromQueue(fileItem);
    }
    if (this.uploader.queue && this.uploader.queue.length > 0) {

    }
    this.fileUploadInput.nativeElement.value = '';
  }

  beforeUploadItem(fileItem: FileItem) {
    this.beforeUpload.emit(fileItem);
  }

  successItem(event: any, res: string) {
    this.success.emit({
      fileitem: event,
      response: res
    });
    if (this.uploader.queue && this.uploader.queue.length > 0) {
      for (let f of this.uploader.queue) {
        this.clearFileItem(f);
      }
    }

  }

  errorItem(event: any, res: string) {
    this.error.emit(res);

    if (this.uploader.queue && this.uploader.queue.length > 0) {
      for (let f of this.uploader.queue) {
        this.clearFileItem(f);
      }
    }
  }

  progressItem(fileItem: FileItem, progress: any) {
    this.progress.emit(progress);
  }
}
