import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from './users.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  password: string ="";
  username: string ="";

  constructor(private users: UsersService, private router: Router) { }

  ngOnInit(): void {
  }
  login(): void{
    if(this.username=="" || this.password==""){
      this.warningMessage("Enter a Username and Password")
      return;
    }

    if(this.users.login(this.username, this.password)){
      sessionStorage.setItem('name', this.username)
      //window.location.href = "/messages";
      this.router.navigateByUrl("/messages")
      
    }
    else{
      this.username = '';
      this.password ='';
      this.warningMessage("Incorrect username or password");
    }
  }

  create(){
    if(this.username=="" || this.password==""){
      this.warningMessage("Enter a Username and Password")
      return;
    }
    if(this.users.addUser(this.username, this.password)){
      sessionStorage.setItem('name', this.username)
      window.location.href = "/messages";
    }
    else{
      this.username = '';
      this.password ='';
      this.warningMessage("Username already taken");
      
    }
  }
  warningMessage(error: string):void{
    if(document.body.contains(document.getElementById("warning")))
      document.getElementById("warning")?.remove();
    
    let warning = document.createElement("a");
    warning.innerHTML = error;
    warning.style.color = "red";
    warning.style.fontSize="18px";
    warning.id = "warning";

    document.getElementById('five')?.insertBefore(warning, document.getElementById("usernameDiv"));

  }

}
