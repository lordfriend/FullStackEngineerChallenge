import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly _employeeService: EmployeeService<Employee>) {}

    @Get()
    findAll(): Promise<{data: Employee[], status: number}> {
        return this._employeeService.findAll()
            .then(employees => {
                return {
                    data: employees.map(e => {
                        e.password = undefined;
                        return e;
                    }),
                    status: 0,
                    total: employees.length
                };
            });
    }

    @Get(':id')
    findById(@Param('id') id: string): Promise<{data: Employee, status: number}> {
        let idNumeric = Number.parseInt(id);
        if (Number.isInteger(idNumeric)) {
            return this._employeeService.findById(idNumeric)
                .then(employee => {
                    if (!employee) {
                        return Promise.reject(new NotFoundException('employee not found'));
                    }
                    employee.password = undefined;
                    return {
                        data: employee,
                        status: 0
                    };
                });
        } else {
            return Promise.reject('id not valid');
        }
    }

    @Post()
    addEmployee(@Body('employee') employeeDefObj: any): Promise<{data: Employee, status: number}> {
        return this._employeeService.add(employeeDefObj as Employee)
            .then(employee => {
                return {
                    data: employee,
                    status: 0
                };
            });
    }

    @Delete(':id')
    removeEmployee(@Param('id') id: string): Promise<{data: {}, status: number}> {
        let idNumeric = Number.parseInt(id);
        if (Number.isInteger(idNumeric)) {
            return this._employeeService.removeById(idNumeric)
                .then(() => {
                    return {
                        data: {},
                        status: 0
                    };
                });
        } else {
            return Promise.reject('id not valid');
        }
    }

    @Put(':id')
    updateEmployee(@Body('employee') employeeDefOjb: any): Promise<{data: {}, status: number}> {
        return this._employeeService.update(employeeDefOjb)
            .then(() => {
                return {
                    data: {},
                    status: 0
                };
            });
    }
}