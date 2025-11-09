import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Users } from '../../interfaces/user';
import { Resp } from '../../interfaces/response';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {



 constructor(    
     private api:ApiService,
     private router:Router,
     private message:MessageService
     
     ){
   }
  confirmpassword:string=""
  AllUsers:Users[]=[]
  NewUser:Users ={
    
    name:"",
    email:"",
    password:"",
    status:false,
    role:"user"
  }
  register(){
    if(this.NewUser.email == "" || this.NewUser.password =="" || this.NewUser.name =="" || this.confirmpassword ==""){
      this.message.show('danger', 'Hiba', "Nem adtál meg minden adatot!")
      return;
    }
    if(this.NewUser.password != this.confirmpassword){
      this.message.show('danger', 'Hiba', "Nem ugyanaz a kettő jelszó!")
      return
    }
    
    this.api.register('users',this.NewUser).then((res:Resp)=>{
      alert(res.message)
      this.NewUser ={
        
        name:"",
        email:"",
        password:"",
        status:false,
        role:"user"
      }
      this.confirmpassword =""
      this.router.navigate(['/login']);
    })
    
  
  }
}
