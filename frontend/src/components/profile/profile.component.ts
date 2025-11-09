import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MessageService } from '../../services/message.service';
import { Users } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { Resp } from '../../interfaces/response';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(    
      private api:ApiService,
      private message:MessageService,
      private auth:AuthService
      ){
    }
    User:Users={
      ID:0,
      name:"",
      password:"",
      email:"",

    }
    oldpassword="";
    newpassword="";
    confirmpassword="";
    
    ngOnInit(): void{
      const stored = sessionStorage.getItem("loggeduser")
       
      this.User = this.auth.loggedUser()
     
    }
    Profileupdate(){
      this.api.profileupdate("users/profile", Number(this.User.ID), this.User).then((res:Resp)=>{
        if(res.status===400){
          this.message.show('danger', 'Hiba',  `${res.message}`)
          return
        }
        if(res.status===200){
          this.auth.login(JSON.stringify(res.data))
          this.message.show('success','Ok', `${res.message}`)
        }
      })
    } 
  Passwordupdate(){
    const passwords = {
    oldpass: this.oldpassword,
    password: this.newpassword
    };
    console.log(passwords)
    this.api.profileupdate("users/password", Number(this.User.ID), passwords ).then((res:Resp)=>{
        if(res.status===400){
          this.message.show('danger', 'Hiba',  `${res.message}`)
          return
        }
        if(res.status===200){
          //this.auth.login(JSON.stringify(res.data))
          console.log(JSON.stringify(res.data))
          this.message.show('success','Ok', `${res.message}`)
        }
      })
  }
    

}
