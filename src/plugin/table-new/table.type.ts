export interface TableOptionsClass {
  checkbox?: boolean;
  maxHeight?: string;
  multiple?: boolean;
  minHeight?: string;
  loading?: boolean;
  showIndex?: boolean;
  keyId?: string;
  hideAllCheck?: boolean;
}

export interface TableFilterOptionClass {
  filterKey?: string; // 过滤数据字段
  maxHeight?: string; // 复选框最大高度
  keyId?: string; // 单选框的数据的唯一值key
}

export interface TableFilterOptionListClass {
  checked?: boolean;
  name?: string;
  index?: number;
}

export interface TableFilterClass {
  type: string; // 过滤类型
  option?: TableFilterOptionClass;
  optionList?: TableFilterOptionListClass[];
  fn: Function;
  filterAllCheck?: any;
  defaultText?: any;
  defaultRadio?: any;
  hasFilter?: any;
  showFilterDrop?: boolean;
  placeholder?: string;
  selfCheck?: any;
  overShow?: boolean;
}

export interface TableHeaderClass {
  field: string; // 显示字段
  title: string; // 表头显示
  canSort?: boolean; // 是否可排序
  defaultSort?: string; // 默认排序值
  filter?: TableFilterClass; // 过滤配置
  width?: string; // 单元格宽度
  flex?: string; // 单元格自适应宽度优先级,
  isGroup?: boolean; // 单元格是否可展开子节点
  alignTd?: string; // 单元格td文本对齐方式
  alignTh?: string; // 单元格th(表头)文本对齐方式
  hideHeaderGroup?: boolean; // 是否隐藏表头单元格的group按钮（仅在isGroup生效）
}
