import { Employee } from './employee';

export interface Review {

  id?: number;

  date?: Date;

  employee_id?: number;
  employee?: Employee;

  performance?: string;

  feedback?: string;

  status?: ReviewStatus;

  reviewed_by?: Employee[];
}


export enum ReviewStatus {
  NEED_REVIEW, NEED_FEEDBACK, DONE
}
