import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Employee, EmployeeLevel } from '../employee/employee.entity';
import { Entity, PersistentStorage } from '../types';
import { ConfigManager } from '../utils/config';
import { CREATE_TABLE_WITH_NUM_ID } from './database-constant';
import { Pool, PoolClient, QueryArrayConfig, QueryConfig } from 'pg';

export abstract class BaseDtoService<T extends Entity> implements PersistentStorage<T>, OnApplicationBootstrap, OnApplicationShutdown {
    protected pool: Pool;
    protected tableNames = ['employee', 'review', 'review_employee'];
    abstract findAll(): Promise<T[]>;

    abstract findById(id: number): Promise<T | null>;

    abstract removeById(id: number): Promise<boolean>;

    abstract update(item: T): Promise<boolean>;

    abstract add(item: Partial<T>): Promise<T>;


    protected async _findAll_(tableName: string): Promise<T[]> {
        const queryConfig: QueryConfig = {
            text: `SELECT * FROM ${tableName}`
        };
        const client = await this.pool.connect();
        try {
            const result = await client.query(queryConfig);
            return result.rows;
        } catch(e) {
            console.warn(e.stack);
            return [];
        } finally {
            await client.release();
        }
    }

    protected async _findById_(id: number, tableName: string): Promise<T> {
        const queryConfig: QueryConfig = {
            text: `SELECT * FROM ${tableName} WHERE id=$1`,
            values: [id]
        };
        const client = await this.pool.connect();
        try {
            const result = await client.query(queryConfig);
            return result.rows[0];
        } catch(e) {
            console.warn(e.stack);
            return null;
        } finally {
            await client.release();
        }
    }

    protected async _update_(item: T, tableName: string): Promise<boolean> {
        let fieldset = [];
        let valueset = [];
        Object.keys(item).forEach((key, index) => {
            valueset.push(item[key]);
            fieldset.push(`${key}=$${index + 1}`);
        });
        const queryConfig: QueryConfig = {
            text: `UPDATE ${tableName} SET ${fieldset.join(',')} WHERE id=$${valueset.length + 1}`,
            values: [...valueset, item.id]
        };
        const client = await this.pool.connect();
        try {
            await client.query(queryConfig);
            return true;
        } catch(e) {
            console.warn(e.stack);
            return false;
        } finally {
            await client.release();
        }
    }

    protected async _removeById_(id: number, tableName: string) : Promise<boolean> {
        const queryConfig: QueryConfig = {
            text: `DELETE FROM ${tableName} WHERE id=$1`,
            values: [id]
        };
        const client = await this.pool.connect();
        try {
            await client.query(queryConfig);
            return true;
        } catch(e) {
            console.warn(e.stack);
            return false;
        } finally {
            await client.release();
        }
    }

    protected async _add_<T>(item: Partial<T>, tableName: string): Promise<T> {
        let placeHolders = [];
        let values = [];
        let columnNames = Object.keys(item).map((key, index) => {
            placeHolders.push(`$${index + 1}`);
            values.push(item[key]);
            return key;
        });
        const queryConfig: QueryConfig = {
            text: `INSERT INTO ${tableName} (${columnNames.join(',')}) VALUES (${placeHolders.join(',')})`,
            values: values
        };
        const client = await this.pool.connect();
        try {
            const result = await client.query(queryConfig);
            return result.rows[0];
        } catch(e) {
            console.warn(e.stack);
            return null;
        } finally {
            await client.release();
        }
    }

    public async onApplicationShutdown(): Promise<void> {
        await this.pool.end();
    }

    public async onApplicationBootstrap(): Promise<void> {
        const config = ConfigManager.getInstance();
        this.pool = new Pool({
            database: config.dbName,
            host: config.dbHost,
            password: config.dbPass,
            port: config.dbPort,
            user: config.dbUser
        });
        // this._pool.on('error', (err) => {
        //     console.error('Unexpected error on idle client', err);
        //     process.exit(-1);
        // });
        const allExists = await this._checkTables();
        if (allExists) {
            return Promise.resolve();
        }
        await this._createTables(config);
        // for test purpose
        await this._initAdminUser();
        return Promise.resolve();
    }

    /**
     * Check whether tables exists. Assume all table we created are all have the 'public' schema
     * @returns {Promise<boolean>} true if all exists, otherwise return false
     * @private
     */
    private async _checkTables(): Promise<boolean> {
        const client = await this.pool.connect();
        try {
            /* tslint:disable-next-line:max-line-length*/
            const result = await client.query('SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = \'public\'');
            return this.tableNames.every(name => {
                return result.rows.some(row => row.table_name === name);
            });
        } finally {
            client.release();
        }
    }

    /**
     * Create tables
     * @param {ConfigManager} config
     * @returns {Promise<any>}
     * @private
     */
    private async _createTables(config: ConfigManager): Promise<any> {
        const client = await this.pool.connect();
        let statement = CREATE_TABLE_WITH_NUM_ID;
        try {
            await client.query(statement.EMPLOYEE);
            await client.query(statement.REVIEW);
            await client.query(statement.REVIEW_EMPLOYEE);
        } finally {
            client.release();
        }
    }

    private async _initAdminUser(): Promise<any> {
        const user = new Employee();
        user.name = 'admin';
        user.password = 'admin';
        user.level = EmployeeLevel.ADMIN;
        await this._add_<Employee>(user, 'employee');
    }

}