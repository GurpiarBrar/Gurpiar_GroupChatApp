import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap } from "rxjs";
import { Iuser } from "./user"; 

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private baseURL = 'https://my-json-server.typicode.com/GurpiarBrar/Gurpiar_GroupChatApp/';
    private allUsers!: Iuser[];
    constructor(private http: HttpClient){
        setInterval(()=>{this.update()},2500)
    }
    private newUserId!: any;

    getAllUsers(): Observable<Iuser[]>{
        return this.http.get<Iuser[]>(this.baseURL+"Users").pipe(
            tap(data=>console.log('All',JSON.stringify(data))));
    }

    update(): void{
        this.http.get<Iuser[]>(this.baseURL+"Users").subscribe(res=>this.allUsers = res );
        this.http.get<any>(this.baseURL+"Next").subscribe(res =>{ this.newUserId =res.id; console.log(this.newUserId)});
    }

    login(name: string, pass: string): boolean{
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':  'application/json'
            })
        };
        for(let user of this.allUsers){
            if(user.username===name && pass ===user.password){
                user.online = true;
                this.http.put<Iuser>(this.baseURL + "Users/"+user.id,user, httpOptions).subscribe(res=>console.log(res));
                sessionStorage.setItem("id", user.id.toString());
                return true;
            }

        }
        return false;
    }
    
    addUser(name: string, pass: string): boolean{  

        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':  'application/json'
            })
        };
        for(let user of this.allUsers){
            if(user.username===name && pass ===user.password){
                return false
            }
        }

        let temp: Iuser = {id: (this.newUserId++),username: name,password: pass, online: true};
        this.http.post<Iuser>(this.baseURL + "Users", JSON.stringify(temp), httpOptions).subscribe(res=>console.log(res));
        this.http.put<any>(this.baseURL + "Next", JSON.stringify({"id":this.newUserId}), httpOptions).subscribe(res=>console.log(res));
        sessionStorage.setItem("id", temp.id.toString());

        return true;
    }

    logOut(): void{
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':  'application/json'
            })
        };
        for(let user of this.allUsers){
            if(user.id.toString()===sessionStorage.getItem("id")){
                console.log("OUT")
                user.online = false;
                this.http.put<Iuser>(this.baseURL + "Users/"+user.id,JSON.stringify(user), httpOptions).subscribe(res=>console.log(res));
            }
        }
    }


}