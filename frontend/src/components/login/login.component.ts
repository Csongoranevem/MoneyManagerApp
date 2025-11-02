import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {  RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Users } from '../../interfaces/user';
import { Resp } from '../../interfaces/response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(    
    private api:ApiService
    ){
  }
  
  NewUser:Users ={
    ID:0,
    name:"",
    email:"",
    password:"",
    status:false,
    role:"user"
  }


  login(){
    if(this.NewUser.email == "" || this.NewUser.password ==""){
      alert("Kérem töltse ki a mezőket")
      return;
    }

    this.api.postNew('users/login',this.NewUser).then((res:Resp)=>{
      alert(res.message)
      sessionStorage.setItem("loggeduser", JSON.stringify(this.NewUser))
      

    })
    
  }
}
