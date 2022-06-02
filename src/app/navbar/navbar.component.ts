import { Component, OnInit } from '@angular/core';
import { UsersService } from '../login/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private userService : UsersService ) { }

  ngOnInit(): void {
  }

  notActive(): void {
    document.getElementById("home")?.classList.remove("active");
    document.getElementById("about")?.classList.remove("active");
    document.getElementById("services")?.classList.remove("active");
    document.getElementById("contact")?.classList.remove("active");
  }

  makeActive(id : string): void{
    this.notActive();
    document.getElementById(id)?.classList.add("active");

  }

  logOut(): void{
    
    this.userService.logOut();
    sessionStorage.clear();
    window.location.href = "/";


  }


}
