import { Review } from './review';

export interface Employee {
  id?: number;

  name?: string;

  level: EmployeeLevel;

  password?: string;

  participated_in?: Review[];
}


export enum EmployeeLevel {
  STAFF, ADMIN
}
