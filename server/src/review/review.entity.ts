import { Employee } from '../employee/employee.entity';
import { Entity } from '../types';

export class Review implements Entity {

    id: number;

    date: Date;

    employee_id: number;

    performance: string;

    feedback: string;

    status: ReviewStatus;

    reviewed_by: Employee[];
}

export enum ReviewStatus {
    NEED_REVIEW, NEED_FEEDBACK, DONE
}