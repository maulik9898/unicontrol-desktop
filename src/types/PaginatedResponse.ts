// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.

export interface PaginatedResponse<T> {
  items: Array<T>;
  page: number;
  page_size: number;
  total_items: number;
  has_next: boolean;
}
