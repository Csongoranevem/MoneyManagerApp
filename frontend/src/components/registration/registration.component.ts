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
  passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    if (!this.emailRegExp.test(this.NewUser.email)) {
      this.message.show('danger', 'Hiba', "Érvénytelen email formátum!");
      return;
    }
     if (!this.passwdRegExp.test(this.NewUser.password)) {
      this.message.show('danger', 'Hiba', "A jelszónak legalább 8 karakterből kell állnia, tartalmaznia kell kis- és nagybetűt, valamint számot!");
      return;
    }
    if(this.NewUser.password != this.confirmpassword){
      this.message.show('danger', 'Hiba', "Nem ugyanaz a kettő jelszó!")
      return;
    }
    
    this.api.register('users',this.NewUser).then((res:Resp)=>{
       if(res.status===400){
        this.message.show('danger', 'Hiba',  `${res.message}`)
        return
      }
      this.NewUser ={
        
        name:"",
        email:"",
        password:"",
        status:false,
        role:"user"
      }
      this.message.show('success', 'Ok',  `Sikeresen létrehozott egy fiókot!`)
      this.confirmpassword =""
      this.router.navigate(['/login']);
    })
    
  
  }
}
