export interface Cursor {
  hasNext: boolean;
  next: number;
}

export interface Pagination<T> {
  contents: T[];
  cursor: Cursor;
}

export interface PaginationQueryParam {
  cursor: number;
  size: number;
}
