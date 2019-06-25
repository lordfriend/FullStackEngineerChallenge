import { Injectable } from '@nestjs/common';
import { PoolClient, QueryConfig } from 'pg';
import { BaseDtoService } from '../database/base-dto.service';
import { Employee } from '../employee/employee.entity';
import { Entity } from '../types';
import { Review, ReviewStatus } from './review.entity';

@Injectable()
export class ReviewService<T extends Entity> extends BaseDtoService<T> {
    private _tableName = 'review';

    async add(review: Partial<Review>): Promise<any> {
        if (!review.performance) {
            review.status = ReviewStatus.NEED_REVIEW;
        } else if (!review.feedback) {
            review.status = ReviewStatus.NEED_FEEDBACK;
        } else {
            review.status = ReviewStatus.DONE;
        }
        review.date = new Date(); // should use UTC date. we leave it unresolved
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            let {rows} = await client.query(
                'INSERT INTO review(date, employee_id, performance, feedback, status) VALUES($1, $2, $3, $4, $5) RETURNING id',
                [review.date, review.employee_id, review.performance, review.feedback, review.status]);
            await this._assignReviewers(client, rows[0].id, review.reviewed_by.map(e => e.id));
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e
        } finally {
            client.release();
        }
        return super._add_(review, this._tableName);
    }

    findAll(): Promise<T[]> {
        return super._findAll_(this._tableName);
    }

    findById(id: number): Promise<T | null> {
        return super._findById_(id, this._tableName);
    }

    removeById(id: number): Promise<boolean> {
        return super._removeById_(id, this._tableName);
    }

    update(review: Review): Promise<boolean> {
        // this API is not fully implemented.
        // to make it not complain errors. we simply remove what we cannot handle
        review.reviewed_by = undefined;
        return super._update_<Review>(review, this._tableName);
    }

    private async _assignReviewers(client: PoolClient, review_id: number, reviewer_ids: number[]): Promise<boolean> {
        for(let reviewer_id of reviewer_ids) {
            await client.query(
                'INSERT INTO review_employee(employee_id, review_id) VALUES($1, $2)',
                [reviewer_id, review_id]
            );
        }
    }

    async findReviewsOfEmployee(employeeId: number, status: number): Promise<Review[]> {
        const queryConfig: QueryConfig = {
            text: 'SELECT r.id as id, r.date as date, r.performance as performance, r.feedback as feedback, r.status as status,' +
            ' e.id as e_id, e.name as e_name, e.level as e_level ' +
            'FROM review_employee as re ' +
            'LEFT JOIN review as r ON r.id=re.review_id ' +
            'LEFT JOIN employee as e ON e.id=re.employee_id ' +
            'WHERE r.employee_id=$1 ' + (status === -1? '': `AND r.status=${status} `) +
            'ORDER BY r.id',
            values: [employeeId]
        };
        const client = await this.pool.connect();
        try {
            let lastReview = null;
            const result = await client.query(queryConfig);
            const reviews = [];
            result.rows.forEach(review => {
                let r;
                if (lastReview && review.id === lastReview.id) {
                    r = lastReview;
                } else {
                    r = new Review();
                    r.id = review.id;
                    r.date = review.date;
                    r.performance = review.performance;
                    r.feedback = review.feedback;
                    r.status = review.status;
                    r.reviewed_by = [];
                    reviews.push(r);
                }
                let e = new Employee();
                e.id = review.e_id;
                e.name = review.e_name;
                e.level = review.e_level;
                r.reviewed_by.push(e);
                lastReview = r;
            });
            return reviews;
        } catch(e) {
            console.warn(e.stack);
            return [];
        } finally {
            await client.release();
        }
    }
}