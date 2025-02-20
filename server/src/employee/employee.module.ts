import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

/**
 * EmployeeEntity Repository
 */
@Module({
    providers: [EmployeeService],
    controllers: [EmployeeController],
    exports: [EmployeeService]
})
export class EmployeeModule {

}