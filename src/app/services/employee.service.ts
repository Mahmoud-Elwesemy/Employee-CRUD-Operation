import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://employee-crud.runasp.net/api/Employee';

  constructor(private http: HttpClient) {}

  // getAllEmployees(params: any): Observable<Employee[]> {
  //   return this.http.get<Employee[]>(`${this.apiUrl}/GetAllEmployee`, { params });
  // }
  // employee.service.ts
// Update employee.service.ts
getAllEmployees(page: number, pageSize: number): Observable<Employee[]> {
  const params = {
    PageNumber: page.toString(),
    PageSize: pageSize.toString()
  };

  return this.http.get<Employee[]>(`${this.apiUrl}/GetAllEmployee`, { params });
}

  searchEmployees(searchTerm: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/Search`, { params: { searchTerm } });
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/GetEmployeeById/${id}`);
  }

  createEmployee(employee: Omit<Employee, 'id'>): Observable<void> {
    console.log('Calling createEmployee API:', employee);
    return this.http.post<void>(`${this.apiUrl}/CreateEmployee`, employee);
  }

  updateEmployee(employee: Employee): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UpdateEmployee/${employee.id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteEmployee/${id}`);
  }
}