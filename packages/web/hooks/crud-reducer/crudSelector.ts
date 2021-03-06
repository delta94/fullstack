import { CRUDState } from './crudReducer';

export interface PaginateState<S extends CRUDState<unknown, any>> {
  ids: S['ids'];
  list: S['list'];
  pageNo: number;
  pageSize: number;
  total: number;
  params: any;
  hasData: boolean;
}

export interface PaginateSelectorOptions {
  prefill?: unknown;
}

export function paginateSelector<S extends CRUDState<any, any>>({
  list,
  ids,
  pageNo,
  pageSize,
  params,
  total
}: S): PaginateState<S> {
  const start = (pageNo - 1) * pageSize;
  const _list = list.slice(start, start + pageSize);

  let hasData = false;
  for (const item of _list) {
    if (item && typeof item === 'object' && Object.keys(item).length > 1) {
      hasData = true;
      break;
    }
  }

  return {
    list: _list,
    ids,
    pageNo,
    pageSize,
    total,
    params,
    hasData
  };
}
