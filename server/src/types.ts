export const TYPES = {
    PersistentStorage: Symbol.for('PersistentStorage'),
};

export interface Entity {
    id: number;
}

export interface PersistentStorage<T extends Entity> {
    removeById(id: number): Promise<boolean>;
    findById(id: number): Promise<T|null>;
    findAll(): Promise<T[]>;
    update(item: T): Promise<boolean>;
    add(item: Partial<T>): Promise<T>;
}