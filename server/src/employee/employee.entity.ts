import { Review } from '../review/review.entity';
import { Entity } from '../types';

export class Employee implements Entity {
    id: number;
    name: string;
    level: EmployeeLevel;
    password: string;
    participate_in: Review[];
}

export enum EmployeeLevel {
    STAFF, ADMIN
}