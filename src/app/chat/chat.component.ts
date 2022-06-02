import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Iuser } from '../login/user';
import { UsersService } from '../login/users.service';
import { ChatService } from './chat.service';
import { IChatLog } from './chatLog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  chatLog: string ="";
  chatRoom!: IChatLog;
  errorMessage: string ='';
  sub!: Subscription;
  currentRoomId: number =1;
  people!: Iuser[];

  constructor(private chatService: ChatService, private usersService: UsersService) {  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getOnline(): Iuser[]{
    let temp: Iuser[] = [];
    for(let user of this.people){
      if(user.online===true){
          temp.push(user);
      }
    }
    return temp;
  }

  getOffline(): Iuser[]{
    let temp: Iuser[] = [];
    for(let user of this.people){
      if(user.online===false){
          temp.push(user);
      }
    }
    return temp;
  }

  update(): void{
    this.sub =this.chatService.getChatLogByRoom(this.currentRoomId).subscribe({
      next: logs => {
        console.log("IN UPDATE:", logs);
        this.chatRoom = logs
        console.log(this.chatRoom)
        this.parseMessages();
       },
      error: err => this.errorMessage = err
  
    });
    this.usersService.getAllUsers().subscribe(res=> this.people = res);

  }

  ngOnInit(): void {
    this.update();
    setInterval(()=> {
     this.update(); },1000); 
  }

  parseMessages(): void {
    let stuff: string  = "";
    for(let i =0; i< this.chatRoom.messages.length; i++){
      stuff +=  this.chatRoom.messages[i] +`<br style>`;
    }
    document.getElementById("messageLog")!.innerHTML =stuff;
  }

  loadMessages(id: number): void{
    this.currentRoomId = id;
    this.update();
    this.parseMessages();
  }
  

  sendMessage(): void{
    if(this.chatLog=="")
      return;
    let message = sessionStorage.getItem('name') + ": "+ this.chatLog;
    document.getElementById("messageLog")!.innerHTML += message +`<br style>`;
    this.chatRoom.messages.push(message);
    this.chatService.setMessage(this.chatRoom).subscribe(data => {
      this.chatRoom = data;
    });
    this.chatLog = "";
    //this.update();
  } 

}
