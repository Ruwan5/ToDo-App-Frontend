import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {LoginService} from '../services/login.service'
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage = '';
  serverErrorMessages = '';
  curentUser = '';


  constructor(public loginService: LoginService, private router: Router, private toastr: ToastrService) {

  }

  ngOnInit(): void {

    $(function() {

      $('#login-form-link').click(function(e) {
          $("#login-form").delay(100).fadeIn(100);
          $("#register-form").fadeOut(100);
          $('#register-form-link').removeClass('active');
          $(this).addClass('active');
          e.preventDefault();
      });
      $('#register-form-link').click(function(e) {
          $("#register-form").delay(100).fadeIn(100);
          $("#login-form").fadeOut(100);
          $('#login-form-link').removeClass('active');
          $(this).addClass('active');
          e.preventDefault();
      });

    });
  }

  onSubmit(form: NgForm) {
    this.loginService.postUser(form.value).subscribe(
      res => {
        console.log(res);

        if(res){
          this.toastr.success('The user has been registered successfully!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-full-width'

          });
        }


        this.resetForm(form);


      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else

          this.toastr.error('Please try again.  Something went wrong!', '',{
            timeOut: 5000,
            positionClass: 'toast-top-full-width '

          });
      }
    );
  }

  login(form: NgForm){
    this.loginService.loginUser(form.value).subscribe(
        res =>{
          if(res == false){
            this.toastr.warning('Password doest not match! Please enter correct password', '',{
              timeOut: 5000,
              positionClass: 'toast-top-full-width'

            });
          }else{

            localStorage.setItem('currentUser', JSON.stringify(res));
            this.router.navigateByUrl('/todolist');


          }



        },
        err => {
          if (err.status === 422) {
            this.serverErrorMessages = err.error.join('<br/>');
          }
          else if(err.status === 400){
            this.toastr.warning('This is not a registered email address. Please register!', '',{
              timeOut: 5000,
              positionClass: 'toast-top-full-width'

            });
          }
          else

            this.toastr.error('Please try again. Something went wrong!', '',{
              timeOut: 5000,
              positionClass: 'toast-top-full-width'

            });
        }
    );
  }

  resetForm(form: NgForm) {
    this.loginService.selectedUser = {
      name: '',
      email: '',
      password: '',
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }

}
