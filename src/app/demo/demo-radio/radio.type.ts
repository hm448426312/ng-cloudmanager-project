export interface RadioOptionsClass {
  keyText?: string; // 数据中显示单选框文本的key
  maxWidth?: string; // 单选框单个最大宽度
  minWidth?: string; // 单选框最小宽度
  height?: string; // 单个radio的高度
  direction?: string; // 单选框布局 row|column
  newLine?: boolean; // 单选框布局为row时，是否需要换行
}
export interface RadioDataClass {
  disabled?: boolean; // 该radio是否不可选
  checked?: boolean; // 该单选框是否选中状态
  id: string; // 数据ID
  name: string; // 数据显示名称
}
