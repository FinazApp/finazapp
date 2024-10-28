export interface Api<T> {
    getAll: () => Promise<T[]>;
    create?: (newData: T) => Promise<T>;
    getById?: (id: number) => Promise<T>;
    delete?: (id: number) => Promise<void>;
    update?: (updateData: Partial<T>) => Promise<T>;
}