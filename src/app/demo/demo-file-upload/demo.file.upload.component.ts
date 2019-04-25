import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo-file-upload',
  templateUrl: './demo.file.upload.component.html',
  styleUrls: ['./demo.file.upload.component.css']
})
export class DemoFileUploadComponent implements OnInit {
  options = {
    url: '/innerControl/v1/project/fileUpload?x=1',
    method: 'POST',
    itemAlias: 'file',
    autoUpload: true,
    encodeFilename: true,
    selfCheck: (file) => { // 自己的校验规则，请return true或者false
      //return this.myCheckFile(file);
      return true;
    }
  };
  acceptType = ['.png'];

  constructor() {
  }

  myCheckFile(item: any) {
    console.log('mycheck', item);
    return false;
  }

  fileChangeEvent(ev) {
    console.log('change', ev);
  }

  ngOnInit() {
  }

  // 上传成功回调方法
  successItem(ev) {
    console.log('success', ev);
  }

  // 上传失败回调方法
  errorItem(ev) {
    console.log('error', ev);
  }

  // 上传之前回调方法
  beforeUpload(ev: any) {
    console.log('beforeUpload', ev);
  }

  // 上传进度更新回调方法
  progress(ev: number) {
    console.log('progress', ev);
  }
}
