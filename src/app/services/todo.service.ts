import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToDo } from '../models/todo.model';
import {Status } from '../models/status.model';
import {Date } from '../models/duedate.model';
import { Category } from '../models/category.model';
import { Title } from '../models/title.model';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class TodoService {

  selectedTodo: ToDo = {
    id: 0,
    title: '',
    description: '',
    duedate: '',
    status: '',
    category: '',
    user_id: ''
  };

  selectedStatus: Status = {
    status: ''
  }

  selectedCategory: Category = {
    category: ''
  }

  selectedDate: Date = {
    duedate: ''
  }

  selectedTitle: Title = {
    title: ''
  }


  constructor(public http: HttpClient) { }


  saveToDoItems(todoitems: ToDo){
    console.log(todoitems)
    return this.http.post(environment.apiBaseUrl+'/savetodo',todoitems);
  }


  getRelventTodos(user_id: string){
    return this.http.get(`${environment.apiBaseUrl}/getalltodos/${user_id}`);

  }

  getStatus(){
    return this.http.get(`${environment.apiBaseUrl}/allstatus/`);

  }

  getAllCategories(){
    return this.http.get(`${environment.apiBaseUrl}/allcategories`);
  }

  deleteTodo(todo_id: any){
    return this.http.delete(`${environment.apiBaseUrl}/delete/${todo_id}`);

  }

  completeTodo(todo_id: any, data: any){
    return this.http.put(`${environment.apiBaseUrl}/complete/${todo_id}`, data);
  }

  changeStatus(todo_id: any, data: any){
    console.log(todo_id)
    return this.http.put(`${environment.apiBaseUrl}/changestatus/${todo_id}`, data);
  }

  changeDate(todo_id: any, data: any){
    console.log(todo_id)
    return this.http.put(`${environment.apiBaseUrl}/changedate/${todo_id}`, data);
  }

}
