import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {User} from '../models/user.model';
import { NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from '../services/todo.service';
import { DatePipe} from '@angular/common'


@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss']
})
export class TodolistComponent implements OnInit  {



  currentUser!: User;
  name!: string;
  user_id!: string;
  current_date!: any;
  todoArray: any = [] ;
  categories!: any;
  statuses!: any;
  todoId!: any;


  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage = '';
  serverErrorMessages = '';
  curentUser = '';


  page = 1;
  pageSize = 4;
  collectionSize: any;
  todos:any = [] ;




  constructor(private router: Router, public todoService: TodoService, private toastr: ToastrService,
     public datepipe: DatePipe)
  {}




  refreshTodoTable() {

    this.todoArray = this.todos
    .map((todo:any, i:number) => ({id: i + 1, ...todo}))
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize+ this.pageSize);

  }

  ngOnInit(): void {

    var result = localStorage.getItem('currentUser');
    const res = " "+result+" ";
    var user = JSON.parse(res);
    this.name = user.name
    this.user_id = user.id;
    console.log(this.user_id)
    this.todoService.selectedTodo.status = "Pending"
    this.todoService.selectedTodo.user_id = user.id;


    let date =new Date();
    this.current_date = this.datepipe.transform(date, 'yyyy-MM-dd');
    console.log(this.current_date);

    this.getAllReleventTodos(this.user_id);

    this.getAllStatus();

    this.getAllCategory();




  }


  serachByTitle(form: NgForm){


    let newArr = this.todos.filter((data:any)=>{
      return data.title  == form.value.title

    });

    this.todos = newArr;

    this.refreshTodoTable();
    this.resetTitleForm(form);
  }

  serachByStatus(form: NgForm){
    let newArr = this.todos.filter((data:any)=>{
      return data.status  == form.value.status

    });

    this.todos = newArr;

    this.refreshTodoTable();
    this.resetStatusForm(form);
  }


  serachByCategory(form: NgForm){

    console.log(form.value)
    let newArr = this.todos.filter((data:any)=>{
      return data.category  == form.value.category

    });

    this.todos = newArr;

    this.refreshTodoTable();
    this.resetCategoryForm(form);
  }

  serachByDueDate(form: NgForm){
    console.log(form.value)
    let newArr = this.todos.filter((data:any)=>{
      return data.duedate  == form.value.duedate

    });

    this.todos = newArr;

    this.refreshTodoTable();
    this.resetDateForm(form);
  }





  saveTodo(form: NgForm){

    this.todoService.saveToDoItems(form.value).subscribe(
        res =>{

          console.log("done")
          console.log(res)
          if(res == true){
            this.toastr.success('Todo item has been successfully saved!', 'Success!',{
              timeOut: 5000,
              positionClass: 'toast-top-center'

            });

            this.ngOnInit();
          }
        },
        err => {
          if (err.status === 500) {
            this.toastr.error('Something went wrong!', 'Please try again.',{
              timeOut: 5000,
              positionClass: 'toast-top-center'

            });
          }
        }
    );
    this.resetForm(form);


  }



  getTodoId(id: any){
    console.log(id.textContent);
    this.todoId = id.textContent;
  }

  deleteTodo(){

    this.todoService.deleteTodo(this.todoId).subscribe(
      data=>{

        if(data == true){
          this.toastr.success('Todo item has been successfully deleted!', 'Deleted Successfully!',{
            timeOut: 5000,
            positionClass: 'toast-top-center'

          });
          this.ngOnInit();
        }
        else if( data == false)
        {
          this.toastr.error('Something went wrong!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-center'

          });
        }

      },
      err => {
        if(err.status === 500){
          this.toastr.warning('This ToDo cannot delete!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-full-width'

          });
        }
        else

          this.toastr.error('Something went wrong!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-full-width'

          });
        }


      )
      this.todoId = '';
  }

  completeTodo(todo_id: any, status:string){

    var data = {
      "status": status
    }

    this.todoService.completeTodo(todo_id.textContent, data).subscribe(
      data=>{
        if(data == true){
          this.toastr.success('Todo item has been marked as completed!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-center'

          });
          this.ngOnInit();
        }
        else if( data == false)
        {
          this.toastr.error('Something went wrong!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-center'

          });
        }

      },
      err => {
        if(err.status === 500){
          this.toastr.warning('Something went wrong!!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-full-width'

          });
        }
        else

          this.toastr.error('Something went wrong!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-full-width'

          });
        }


      )
  }

  changeStatus(form: NgForm){

    this.todoService.changeStatus(this.todoId, form.value).subscribe(

      data=>{
        if(data == true){
          this.toastr.success('Status has been changed!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-center'

          });
          this.ngOnInit();
        }
        else if( data == false)
        {
          this.toastr.error('Something went wrong!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-center'

          });
        }

      },
      err => {
        if(err.status === 500){
          this.toastr.warning('Something went wrong!!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-full-width'

          });
        }
        else

          this.toastr.error('Something went wrong!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-full-width'

          });
        }

    )

    this.resetStatusForm(form);
  }

  resetStatusForm(form: NgForm){
    this.todoService.selectedStatus = {
      status: '',
    };

    form.resetForm();
  }

  resetCategoryForm(form: NgForm){
    this.todoService.selectedCategory = {
      category: '',
    };

    form.resetForm();
  }

  resetTitleForm(form: NgForm){
    this.todoService.selectedTitle = {
      title: '',
    };

    form.resetForm();
  }


  changeDueDate(form: NgForm){

    this.todoService.changeDate(this.todoId, form.value).subscribe(

      data=>{
        if(data == true){
          this.toastr.success('Due Date has been changed!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-center'

          });
          this.ngOnInit();
        }
        else if( data == false)
        {
          this.toastr.error('Something went wrong!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-center'

          });
        }

      },
      err => {
        if(err.status === 500){
          this.toastr.warning('Something went wrong!!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-full-width'

          });
        }
        else

          this.toastr.error('Something went wrong!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-full-width'

          });
        }

    )

    this.resetDateForm(form);
  }

  resetDateForm(form: NgForm){
    this.todoService.selectedDate = {
      duedate: '',
    };
  }

  resetForm(form: NgForm) {
    this.todoService.selectedTodo = {
      id: 0,
      title: '',
      description: '',
      duedate: '',
      status: '',
      category: '',
      user_id: ''
    };

    form.resetForm();
    this.serverErrorMessages = '';
  }

  getAllReleventTodos(user_id: string){
    this.todoService.getRelventTodos(user_id).forEach(res=>{
      this.todos = res;
      this.collectionSize = this.todos.length;
      this.refreshTodoTable();
    })

    // console.log(this.todoArray);
  }

  getAllCategory(){
    this.todoService.getAllCategories().forEach(res=>{
      console.log(res);
      this.categories = res;
    })
  }

  getAllStatus(){
    this.todoService.getStatus().forEach(data=>{
      console.log(data);
      this.statuses = data;
    })
  }



  logOut() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

}
