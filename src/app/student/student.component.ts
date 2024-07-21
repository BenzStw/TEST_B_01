import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {StorageService} from "../storage.service";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit{
  @ViewChild('myModal') model: ElementRef | undefined;
  studentObj : studentModel = new studentModel();
  studentList: studentModel[] = [];

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.getStudentList();
  }

  openModal() {
    const sdtmodel = document.getElementById('myModal');
    if (sdtmodel != null) {
      sdtmodel.style.display = 'block'
    }
  }

  closeModal(){
    this.studentObj = new studentModel();
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }
  }

  onDeleteStudent(data: studentModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this student's information?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const currentStudent = this.studentList.findIndex(s => s.id === data.id);
        this.studentList.splice(currentStudent, 1);
        this.storageService.setItem('studentData', JSON.stringify(this.studentList));

        Swal.fire(
          'Deleted!',
          'The student information has been deleted.',
          'success'
        );
      }
    });
  }

  onSaveForm() {
    debugger;
    const localData = this.storageService.getItem('studentData');
    if (localData != null){
      const stdData = JSON.parse(localData);
      this.studentObj.id = stdData.length + 1;
      stdData.push(this.studentObj);
      this.storageService.setItem('studentData', JSON.stringify(stdData));
    } else {
      const newStudent = [];
      newStudent.push(this.studentObj);
      this.studentObj.id = 1;
      this.storageService.setItem('studentData', JSON.stringify(newStudent));
    }
    this.closeModal();
    this.getStudentList();
  }

  getStudentList(){
    const localData = this.storageService?.getItem('studentData');
    if (localData != null){
      this.studentList = JSON.parse(localData);
    }
  }

  onUpdateForm() {
    const currentStudent = this.studentList.find(s => s.id === this.studentObj.id);
    if (currentStudent != undefined){
      currentStudent.name = this.studentObj.name;
      currentStudent.mobile = this.studentObj.mobile;
      currentStudent.email = this.studentObj.email;
      currentStudent.gender = this.studentObj.gender;
      currentStudent.doj = this.studentObj.doj;
      currentStudent.address = this.studentObj.address;
      currentStudent.status = this.studentObj.status;
    }
    this.storageService.setItem('studentData', JSON.stringify(this.studentList));
    this.closeModal();
    this.getStudentList();
  }
  onEditStudent(studentData:studentModel){
    this.studentObj = studentData;
    this.openModal();
  }
}

export class studentModel{
  id: number;
  name: string;
  mobile: string;
  email: string;
  gender: string;
  doj: string;
  address: string;
  status: boolean;
  constructor() {
    this.id = 0;
    this.name = '';
    this.mobile = '';
    this.email = '';
    this.gender = '';
    this.doj = '';
    this.address = '';
    this.status = false;
  }
}
