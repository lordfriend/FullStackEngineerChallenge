import { Injectable } from '@nestjs/common';
import { QueryConfig } from 'pg';
import { BaseDtoService } from '../database/base-dto.service';
import { Entity } from '../types';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeeService<T extends Entity> extends BaseDtoService<T> {
    private _tableName = 'employee';

    findAll(): Promise<T[]> {
        return super._findAll_(this._tableName);
    }

    findById(id: number): Promise<T | null> {
        return super._findById_(id, this._tableName);
    }

    removeById(id: number): Promise<boolean> {
        return super._removeById_(id, this._tableName);
    }

    update(employee: T): Promise<boolean> {
        return super._update_(employee, this._tableName);
    }

    add(employee: Partial<T>): Promise<T> {
        return super._add_(employee, this._tableName);
    }

    async findByName(name: string): Promise<Employee[]> {
        const queryConfig: QueryConfig = {
            text: `SELECT * FROM employee WHERE name like($1)`,
            values: [name]
        };
        const client = await this.pool.connect();
        try {
            const result = await client.query(queryConfig);
            return result.rows;
        } catch(e) {
            console.warn(e.stack);
            return null;
        } finally {
            await client.release();
        }
    }
}