import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, Employee } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = { id: 0, firstName: '', lastName: '', email: '', position: '' };
  isEditMode: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeService.getEmployeeById(+id).subscribe(
        (data) => {
          this.employee = data;
        },
        (error) => {
          console.error('Error fetching employee:', error);
        }
      );
    }
  }
  loading: boolean = false;
  onSubmit(): void {
    this.loading = true;
    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/']); 
        },
        (error) => {
          console.error('Error updating employee:', error);
        }
      );
    } else {
      this.employeeService.createEmployee(this.employee).subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/']); 
        },
        (error) => {
          console.error('Error creating employee:', error);
        }
      );
    }
  }
  showAtWarning: boolean = false;

checkEmailProgress() {
  this.showAtWarning = this.employee.email?.includes('@');
}
}