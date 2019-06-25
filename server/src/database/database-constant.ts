/* tslint:disable */
export const CREATE_TABLE_WITH_NUM_ID = {
    EMPLOYEE: 'CREATE TABLE IF NOT EXISTS employee (' +
    'id SERIAL PRIMARY KEY, ' +
    'name TEXT, ' +
    'level INTEGER, ' +
    'password INTEGER ' +
    ')',
    REVIEW: 'CREATE TABLE IF NOT EXISTS review (' +
    'id SERIAL PRIMARY KEY, ' +
    'date TIMESTAMP, ' +
    'employee_id INTEGER, ' +
    'performance TEXT, ' +
    'feedback TEXT, ' +
    'status INTEGER ' +
    ')',
    REVIEW_EMPLOYEE: 'CREATE TABLE IF NOT EXISTS review_employee (' +
    'employee_id INTEGER REFERENCES employee(id), ' +
    'review_id INTEGER REFERENCES review(id), ' +
    'constraint id PRIMARY KEY (employee_id, review_id) ' +
    ')'
};