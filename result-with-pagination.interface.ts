export interface IResultWithPagination<T> {
    results?: T[];
    page?: number;
    total?: number;
    totalElements?: number;
}
