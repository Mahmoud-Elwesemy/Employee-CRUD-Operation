import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService, Employee } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  imports: [CommonModule,FormsModule]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalEmployees: number = 0;
  totalPages: number = 0;
  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }
  loading: boolean = false;
  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.employees = data;
        // Simple pagination logic (you'll need total count from backend for accurate pagination)
        this.totalPages = data.length === this.pageSize ? this.currentPage + 1 : this.currentPage;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading employees:', error);
      }
    );
  }

  onPageChange(newPage: number): void {
    if (newPage >= 1) {
      this.currentPage = newPage;
      this.loadEmployees();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadEmployees();
  }



  openAddEmployeeForm(): void {
    this.router.navigate(['/add']); // Navigate to the Add Employee form
  }

  openEditEmployeeForm(employee: Employee): void {
    this.router.navigate(['/edit', employee.id]); // Navigate to the Edit Employee form with the employee ID
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      // Show SweetAlert if the search input is empty
      Swal.fire({
        icon: 'info',
        title: 'Search Input is Empty',
        text: 'Please enter a search term or leave it empty to load all employees.',
        confirmButtonText: 'OK',
      }).then(() => {
        // Reload all employees
        this.loadEmployees();
      });
      return;
    }

    // Perform search if input is not empty
    this.employeeService.searchEmployees(this.searchTerm).subscribe(
      (data) => {
        this.employees = data;
      },
      (error) => {
        console.error('Error searching employees:', error);
      }
    );
  }

  deleteEmployee(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(id).subscribe(
          () => {
            this.loadEmployees(); 
            Swal.fire('Deleted!', 'The employee has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting employee:', error);
            Swal.fire('Error!', 'There was an error deleting the employee.', 'error');
          }
        );
      }
    });
  }
}