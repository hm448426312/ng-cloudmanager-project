import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver, ElementRef
} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'dc-tree',
  template: `
    <div #treeBox class="display-flex width-100 flex-direction-column tree-box" [style.max-height]="options?.maxHeight">
      <div *ngFor="let node of treeDatas;let i = index">
        <div class="node-container">
          <dc-node [nodeData]="node" [root]="true" [treeId]="treeId" [keyChild]="keyChild" [keyId]="keyId" [keyName]="keyName"
                   [options]="options"
                   (clickEvent)="clickNode($event)" (checkEvent)="checkNode($event)" (extendEvent)="extendNode($event)"
                   [myIndex]="i" [deepIndex]="0"></dc-node>
        </div>
      </div>
      <div *ngIf="treeNoData" style="line-height: 40px; text-align: center">
        No Data.
      </div>
    </div>

  `,
  styles: [`
    .tree-box {
      position: relative;
      overflow-y: auto;
      padding: 5px 0;
      min-height: 100%;
    }

  `]
})
export class TreeComponent implements OnInit {
  @ViewChild('treeBox') treeBox: ElementRef;
  @Output() clickEvent = new EventEmitter();
  @Output() extendEvent = new EventEmitter();
  @Output() checkEvent = new EventEmitter();
  @Input() options: any;


  @Input() defaultCheckedNodes: any[];
  @Input() defaultSelectedNode: any;
  @Input() defaultHalfCheckedNodes: any[];
  treeNoData = false;
  tempSearch: any = [];
  selectedNode: any;

  @Input() keyId: any;
  @Input() keyName: any;
  @Input() keyChild: any;
  @Input() treeId: string;

  _treeDatas: any;
  @Input() set treeDatas(v) {
    if (this.defaultCheckedNodes && !_.isEmpty(this.defaultCheckedNodes)) {
      this.initCheckNodes(this.defaultCheckedNodes, v);
      this.defaultCheckedNodes = null;
    }
    if (this.defaultSelectedNode && !_.isEmpty(this.defaultSelectedNode)) {
      let selectNode = this.initSelectNode(this.defaultSelectedNode, v);
      this.selectedNode = selectNode;
      this.defaultSelectedNode = null;
    }
    if (this.defaultHalfCheckedNodes && !_.isEmpty(this.defaultHalfCheckedNodes)) {
      this.initHalfCheckNodes(this.defaultHalfCheckedNodes, v);
      this.defaultHalfCheckedNodes = null;
    }
    this._treeDatas = v;
  }

  get treeDatas() {
    return this._treeDatas;
  }

  constructor(private resolver: ComponentFactoryResolver, private router: Router) {
  }

  ngOnInit(): void {
    if (!this.keyId) {
      this.keyId = 'id';
    }
    if (!this.keyName) {
      this.keyName = 'title';
    }
    if (!this.keyChild) {
      this.keyChild = 'subNode';
    }
  }

  initHalfCheckNodes(checkedNodes: any[], source: any) {
    for (let i = checkedNodes.length - 1; i >= 0; i--) {
      this._initHalfCheckNodes(checkedNodes[i], source);
    }
  }

  _initHalfCheckNodes(checkedNode: any, source: any) {
    for (let j = 0; j < source.length; j++) {
      if (source[j][this.keyId] == checkedNode) {
        source[j].checked = 2;
        return;
      }
      if (source[j][this.keyChild] && source[j][this.keyChild].length > 0) {
        this._initHalfCheckNodes(checkedNode, source[j][this.keyChild]);
      }
    }
  }

  initCheckNodes(checkedNodes: any[], source: any) {
    for (let i = checkedNodes.length - 1; i >= 0; i--) {
      this._initCheckNodes(checkedNodes[i], source);
    }
  }

  _initCheckNodes(checkedNode: any, source: any) {
    for (let j = 0; j < source.length; j++) {
      if (source[j][this.keyId] == checkedNode) {
        source[j].checked = 1;
        return;
      }
      if (source[j][this.keyChild] && source[j][this.keyChild].length > 0) {
        this._initCheckNodes(checkedNode, source[j][this.keyChild]);
      }
    }
  }

  initSelectNode(selectNode: any, source: any): any {
    for (let j = 0; j < source.length; j++) {
      if (source[j][this.keyId] == selectNode[this.keyId]) {
        source[j].selected = true;
        return source[j];
      }
      if (source[j][this.keyChild] && source[j][this.keyChild].length > 0) {
        let res: any = this.initSelectNode(selectNode, source[j][this.keyChild]);
        if (res) {
          return res;
        }
      }
    }
  }

  clickNode(event: any) {
    this.selectTreeNode(event);
    setTimeout(() => {
      this.defaultSelectedNode = null;
    }, 10);
    if (this.options.unSelect && !event.selected) {
      this.clickEvent.emit(null);
    } else {
      this.clickEvent.emit(event);
    }
  }

  extendNode(event: any) {
    this.extendEvent.emit(event);
  }

  checkNode(event: any) {
    if (this.options && this.options.unLinkage) {
      this.checkEvent.emit(event);
      return false;
    }
    const childs = event[this.keyChild];
    const parents = this.findParentsNodeById(event[this.keyId]);
    if (event.checked) {
      /**
       * 复选框选中该节点
       * 1/所有子节点选中
       * 2/父节点判断
       *  2.1/父节点为false
       *    2.1.1/父节点下的所有兄弟节点全部checked  >   父节点为true(继续判断父)
       */
      childs && this._checkChildrenNode(childs, true);
      this._checkParentNode(parents);
    } else {
      /**
       * 复选框移除该选中状态
       * 1/所有子节点移除选中状态
       * 2/父节点判断
       *  2.1/父节点为true
       *    2.1.1/父节点改为false（继续判断父）
       *  2.2/父节点为false
       *    2.2.1/不做处理
       */
      childs && this._checkChildrenNode(childs, false);
      this._unCheckParentNode(parents);
    }
    this.checkEvent.emit(event);
  }

  // 移除父节点选中状态
  private _unCheckParentNode(parents: any[]) {
    if (parents.length > 1) { // 非根节点
      let parent = parents[1];
      if (parent.checked) {
        let brothers = parent[this.keyChild];
        let broChecked = false;
        for (let bro of brothers) {
          if (bro.checked === 1 || bro.checked === true || bro.checked === 2) {
            broChecked = true;
            break;
          }
        }
        if (broChecked) {
          parent.checked = 2;
        } else {
          parent.checked = 0;
        }
        this._unCheckParentNode(parents.slice(1, parents.length));
      }
    }
  }

  // 判断父节点状态并确认是否选中
  private _checkParentNode(parents: any[]) {
    if (parents.length > 1) { // 非根节点
      let parent = parents[1];
      let brothers = parent[this.keyChild];
      let flag = true; // 兄弟节点有一个没有选中，则为false
      let broChecked = false; // 兄弟节点是否有选中的
      let half = false;
      for (let bro of brothers) {
        if (bro.checked === undefined || bro.checked === false || bro.checked === 2) {
          if (bro.checked === 2) {
            half = true;
          }
          flag = false;
        } else {
          broChecked = true;
        }
      }
      if (flag) {
        parents[1].checked = 1;
        this._checkParentNode(parents.splice(1, parents.length));
      } else {
        if (broChecked || half) {
          parents[1].checked = 2;
          this._checkParentNode(parents.splice(1, parents.length));
        }
      }
    }
  }

  // 选中/取消选中子节点
  private _checkChildrenNode(children: any[], checkType: boolean) {
    for (let child of children) {
      child.checked = (checkType && 1);
      if (!checkType && this.defaultCheckedNodes) {
        const theIndex = _.findIndex(this.defaultCheckedNodes, (o) => {
          return o == child[this.keyId];
        });
        if (theIndex != -1) {
          child.checked = 0;
          this.defaultCheckedNodes.splice(theIndex, 1);
        }
      }
      if (child[this.keyChild]) {
        this._checkChildrenNode(child[this.keyChild], checkType);
      }
    }
  }

  // 根据keyId查找节点
  private _findNodeById(id: any, source: any) {
    for (let i = 0; i < source.length; i++) {
      const theI = source[i];
      if (theI[this.keyId] == id) {
        return theI;
      }
      if (theI[this.keyChild]) {
        let res: any = this._findNodeById(id, theI[this.keyChild]);
        if (res) {
          return res;
        }
      }
    }
  }

  // 根据名称keyName全匹配查找节点
  private _findNodeByAllName(result: any, name: any, source: any) {
    for (let i = 0; i < source.length; i++) {
      const theI = source[i];
      if (theI[this.keyName] == name) {
        result.push(theI);
      }
      if (theI[this.keyChild]) {
        this._findNodeByAllName(result, name, theI[this.keyChild]);
      }
    }
  }

  // 根据名称keyName模糊查找节点
  private _findNodeByName(result: any, name: any, source: any) {
    for (let i = 0; i < source.length; i++) {
      let theI = source[i];
      if (theI[this.keyName].toLowerCase().indexOf(name.toLowerCase()) != -1) {
        result.push(theI);
      }
      if (theI[this.keyChild]) {
        this._findNodeByName(result, name, theI[this.keyChild]);
      }
    }
  }

  // 获取选中的节点列表
  private _getCheckedNodes(result: any[], source: any[]) {
    for (let item of source) {
      if (item.checked === 1 || item.checked === true) {
        result.push(item);
      }
      if (item[this.keyChild]) {
        this._getCheckedNodes(result, item[this.keyChild]);
      }
    }
  }

  // 获半选中的节点列表
  private _getHalfCheckedNodes(result: any[], source: any[]) {
    for (let item of source) {
      if (item.checked === 2) {
        result.push(item);
      }
      if (item[this.keyChild]) {
        this._getHalfCheckedNodes(result, item[this.keyChild]);
      }
    }
  }

  private _getSelectedNodes(source: any[]): any {
    for (let item of source) {
      if (item.selected) {
        return item;
      }
      if (item[this.keyChild]) {
        let res: any = this._getSelectedNodes(item[this.keyChild]);
        if (res) {
          return res;
        }
      }
    }
  }

  // 获取父节点
  private _findParentNodeById(id: any, source: any, parent?: any) {
    for (let i = 0; i < source.length; i++) {
      let theI = source[i];
      if (theI[this.keyId] == id) {
        return parent;
      }
      if (theI[this.keyChild]) {
        let res: any = this._findParentNodeById(id, theI[this.keyChild], theI);
        if (res) {
          return res;
        }
      }
    }
  }

  // 获取父节点链，当前节点为第一个
  private _findParentsNodeById(result: any, id: any, source: any) {
    for (let i = 0; i < source.length; i++) {
      let theI = source[i];
      if (theI[this.keyId] == id) {
        result.push(theI);
        return theI;
      }
      if (theI[this.keyChild]) {
        let res: any = this._findParentsNodeById(result, id, theI[this.keyChild]);
        if (res) {
          result.push(theI);
          return res;
        }
      }
    }
  }

  // 获取子节点列表格式
  private _findChildrensNodeByNode(result: any, source: any) {
    result.push(source);
    if (source[this.keyChild]) {
      for (let i = 0; i < source[this.keyChild].length; i++) {
        this._findChildrensNodeByNode(result, source[this.keyChild][i]);
      }
    }
  }

  // 匹配搜索
  private _matchSearchNodesByKey(result: any, val: any, key: any, source: any) {
    for (let i = 0; i < source.length; i++) {
      let theI = source[i];
      if (theI[key] == val) {
        result.push(source[i]);
      }
      if (theI[this.keyChild]) {
        this._matchSearchNodesByKey(result, val, key, theI[this.keyChild]);
      }
    }
  }

  // 模糊搜索
  private _fuzzySearchNodesByKey(result: any, val: any, key: any, source: any, findFlag?: any) {
    let hasFlag = false;
    for (let i = 0; i < source.length; i++) {
      let theI = source[i];
      if (theI[key].toLowerCase().indexOf(val.toLowerCase()) != -1) {
        result.push(source[i]);
        theI.isHide = false;
        hasFlag = true;
      } else {
        if (!theI[this.keyChild]) {
          theI.isHide = true;
        }
      }
      if (theI[this.keyChild]) {
        const flag: any = {
          hasFlag: true
        };
        this._fuzzySearchNodesByKey(result, val, key, theI[this.keyChild], flag);
        if (!flag.hasFlag && theI.isHide === undefined) {
          theI.isHide = true;
        } else {
          hasFlag = true;
          theI.show = true;
        }
      }
    }
    if (findFlag) {
      findFlag.hasFlag = hasFlag;
    }
  }

  // 根据ID的数组checked节点
  private _checkNodesByIds(ids: any[], source: any) {
    if (!ids || ids.length == 0) {
      return;
    }
    for (let item of source) {
      const index = _.indexOf(ids, item[this.keyId]);
      if (index != -1) {
        item.checked = 1;
        ids.splice(index, 1);
      }
      if (item[this.keyChild] && item[this.keyChild].length > 0) {
        this._checkNodesByIds(ids, item[this.keyChild]);
      }
    }
  }

  // 根据ID查询节点
  findNodeById(id: any) {
    return this._findNodeById(id, this.treeDatas);
  }

  // 根据名称查询全匹配节点
  findNodeByName(name: any) {
    let result: any[] = [];
    this._findNodeByName(result, name, this.treeDatas);
    return result;
  }

  // 根据名称模糊查询节点
  findNodeByAllName(name: any) {
    let result: any[] = [];
    this._findNodeByAllName(result, name, this.treeDatas);
    return result;
  }

  // 获取父节点
  findParentNodeById(id: any) {
    return this._findParentNodeById(id, this.treeDatas);
  }

  //获取父节点链
  findParentsNodeById(id: any) {
    let result: any = [];
    this._findParentsNodeById(result, id, this.treeDatas);
    return result;
  }

  findChildrensNodeByNode(node: any) {
    let result: any = [];
    this._findChildrensNodeByNode(result, node);
    return result;
  }

  // 插入单个节点
  insertNode(child: any, parent?: any) {
    let targetData: any;
    let parents: any;
    if (parent) {
      parents = this.findParentsNodeById(parent[this.keyId]);
      if (parents && parents.length > 0) {
        if (!parents[0][this.keyChild]) {
          parents[0][this.keyChild] = [];
        }
        targetData = parents[0][this.keyChild];
        for (let i = 0; i < parents.length; i++) {
          parents[i].show = true;
        }
        if (this.options.checkbox && parents[0].checked) {
          child.checked = 1;
        }
      }
    } else { // 在根节点下插入
      targetData = this.treeDatas;
    }
    targetData.push(child);
    return child;
  }

  // 插入多个节点
  insertNodes(children: any[], parent?: any) {
    let targetData: any;
    let parents: any;
    if (parent) {
      parents = this.findParentsNodeById(parent[this.keyId]);
      if (parents && parents.length > 0) {
        if (!parents[0][this.keyChild]) {
          parents[0][this.keyChild] = [];
        }
        targetData = parents[0][this.keyChild];
        for (let i = 0; i < parents.length; i++) {
          parents[i].show = true;
        }
        if (this.options.checkbox && parents[0].checked) {
          for (let item of children) {
            item.checked = 1;
          }
        }
      }
    } else { // 在根节点下插入
      targetData = this.treeDatas;
    }
    for (let item of children) {
      targetData.push(item);
    }
    return children;
  }

  //更新节点数据
  updateNodeData(data: any, keys: any) {
    if (!keys) {
      return;
    }
    let targetNode = this.findNodeById(data[this.keyId]);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] == this.keyChild) {
        continue;
      }
      targetNode[keys[i]] = data[keys[i]];
    }
  }

  //删除节点
  deleteNodeById(id: any) {
    let parentNode = this.findParentNodeById(id);
    if (!parentNode) {
      parentNode = this.treeDatas;
    } else {
      parentNode = parentNode[this.keyChild];
    }
    for (let i = 0; i < parentNode.length; i++) {
      if (parentNode[i][this.keyId] == id) {
        parentNode.splice(i, 1);
        break;
      }
    }
  }

  // 匹配搜索
  matchSearchNodesByKey(val: any, key: any) {
    let result: any = [];
    this._matchSearchNodesByKey(result, val, key, this.treeDatas);
    return result;
  }

  removeHideNodes(nodes: any) {
    for (let i = 0; i < nodes.length; i++) {
      delete nodes[i].isHide;
      if (nodes[i][this.keyChild]) {
        this.removeHideNodes(nodes[i][this.keyChild]);
      }
    }
  }

  // 模糊搜索
  fuzzySearchNodesByKey(val: any, key: any) {
    this.removeLighthightNodes(this.treeDatas);
    this.treeNoData = false;
    this.removeHideNodes(this.treeDatas);
    let result: any = [];
    if (val == '') {
      result = [];
      this.collspanAllNodes();
    } else {
      this._fuzzySearchNodesByKey(result, val, key, this.treeDatas);
      if (!result || result.length == 0) {
        this.treeNoData = true;
      }
      // this.expandNodes(result);
      this.lighthightNodes(result);
    }
    this.treeBox.nativeElement.scrollTop = 0;
    /*if (result && result.length > 0) {
      setTimeout(() => {
        const domOffsetTop = result[0].treeDom.nativeElement.offsetTop;
        this.treeBox.nativeElement.scrollTop = domOffsetTop;
      }, 100);
    } else {
      this.treeBox.nativeElement.scrollTop = 0;
    }*/
    return result;
  }

  //展开节点
  expandNode(node: any) {
    let parents = this.findParentsNodeById(node[this.keyId]);
    if (parents && parents.length > 0) {
      if (!parents[0][this.keyChild]) {
        parents[0][this.keyChild] = [];
      }
      for (let i = 0; i < parents.length; i++) {
        parents[i].show = true;
      }
    }
  }

  // 展开节点s
  expandNodes(nodes: any) {
    for (let i = 0; i < nodes.length; i++) {
      this.expandNode(nodes[i]);
    }
  }

  collspanAllNodes(node?: any) {
    const temp = node || this.treeDatas;
    if (Array.isArray(temp)) {
      //  temp为数组，则递归
      for (let i = 0; i < temp.length; i++) {
        temp[i].show = false;
        if (temp[i].children && temp[i].children.length > 0) {
          this.collspanAllNodes(temp[i].children);
        }
      }
    } else {
      temp.show = false;
      if (temp.children && temp.children.length > 0) {
        this.collspanAllNodes(temp.children);
      }
    }
  }

  expandAllNodes(node?: any) {
    const temp = node || this.treeDatas;
    if (Array.isArray(temp)) {
      //  temp为数组，则递归
      for (let i = 0; i < temp.length; i++) {
        temp[i].show = true;
        if (temp[i].children && temp[i].children.length > 0) {
          this.expandAllNodes(temp[i].children);
        }
      }
    } else {
      temp.show = true;
      if (temp.children && temp.children.length > 0) {
        this.expandAllNodes(temp.children);
      }
    }
  }

  // 高亮节点s
  lighthightNodes(nodes: any) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].lighthight = true;
    }
  }

  // 移除高亮s
  removeLighthightNodes(nodes: any) {
    for (let i = 0; i < nodes.length; i++) {
      delete nodes[i].lighthight;
      if (nodes[i][this.keyChild]) {
        this.removeLighthightNodes(nodes[i][this.keyChild]);
      }
    }
  }

  // 选中节点
  selectTreeNode(node: any) {
    if (this.selectedNode && this.selectedNode == node && this.options.unSelect) {
      this.deSelectTreeNode(this.selectedNode);
      return;
    }
    this.selectedNode && this.deSelectTreeNode(this.selectedNode);
    let item = this.findNodeById(node[this.keyId]);
    if (item) {
      item.selected = true;
      this.selectedNode = item;
    }
  }

  // 移除选中
  deSelectTreeNode(node: any) {
    let item = this.findNodeById(node[this.keyId]);
    if (item) {
      delete item.selected;
    }
    this.selectedNode = null;
  }

  // 获取选中节点 check
  getCheckedNodes() {
    let result: any[] = [];
    this._getCheckedNodes(result, this.treeDatas);
    return result;
  }

  // 获取半选节点 halfcheck
  getHalfCheckedNodes() {
    let result: any[] = [];
    this._getHalfCheckedNodes(result, this.treeDatas);
    return result;
  }

  // 获取选中节点 select
  getSelectedNodes() {
    return this._getSelectedNodes(this.treeDatas);
  }

  // 节点上移，顶层不可移动
  moveUpwardsNode(node: any) {
    let brothers: Array<any>;
    let parent = this.findParentNodeById(node[this.keyId]);
    if (!parent) {
      parent = this.treeDatas;
      brothers = parent;
    } else {
      brothers = parent[this.keyChild];
    }
    const theIndex = _.findIndex(brothers, (o) => {
      return o[this.keyId] == node[this.keyId];
    });
    if (theIndex == 0) {
      return;
    }
    brothers.splice(theIndex, 1);
    brothers.splice(theIndex - 1, 0, node);
  }

  // 节点下移，底层不可移动
  moveDownNode(node: any) {
    let brothers: Array<any>;
    let parent = this.findParentNodeById(node[this.keyId]);
    if (!parent) {
      parent = this.treeDatas;
      brothers = parent;
    } else {
      brothers = parent[this.keyChild];
    }
    const theIndex = _.findIndex(brothers, (o) => {
      return o[this.keyId] == node[this.keyId];
    });
    if (theIndex == (brothers.length - 1)) {
      return;
    }
    brothers.splice(theIndex, 1);
    brothers.splice(theIndex + 1, 0, node);
  }

  // 根据id数组check节点
  checkNodesByIds(ids: any[]) {
    this._checkNodesByIds(ids, this.treeDatas);
  }

  // 根据node查找前面的兄弟节点 type = after || prev
  findBrotherNodeByNode(node: any, type?: string): any {
    let brothers: Array<any>;
    const parent: any = this._findParentNodeById(node[this.keyId], this.treeDatas);
    if (!parent) {
      brothers = this.treeDatas;
    } else {
      brothers = parent[this.keyChild];
    }
    const index = _.findIndex(brothers, (o) => {
      return o[this.keyId] == node[this.keyId];
    });
    if (type == 'after') {
      if (index != (brothers.length - 1)) {
        return brothers[index - 0 + 1];
      } else {
        return null;
      }
    } else {
      if (index != 0) {
        return brothers[index - 1];
      } else {
        return null;
      }
    }
  }
}
