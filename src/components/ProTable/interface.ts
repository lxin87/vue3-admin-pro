export interface ColumnProps {
  prop: string;          // 字段名 (对应后端字段)
  label: string;         // 显示表头
  width?: number | string; // 列宽
  fixed?: 'left' | 'right'; // 是否固定
  align?: 'left' | 'center' | 'right'; // 对齐方式
  
  // 核心：是否开启搜索
  search?: {
    el?: 'input' | 'select' | 'date-picker'; // 搜索框类型
    placeholder?: string;    // 占位符
    props?: any;             // 其他 Element 属性
  }; 
  
  // 核心：是否是枚举/字典 (比如状态 1=启用 0=禁用)
  enum?: { label: string; value: any; tagType?: string }[];
}

// 分页参数结构
export interface Pageable {
  pageNum: number;
  pageSize: number;
  total: number;
}