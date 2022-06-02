import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs";
import { IChatLog } from "./chatLog";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private baseURL = 'http://localhost:3000/';
    private allChats!: IChatLog[];
    private newRoomID: number = 3;

    constructor(private http: HttpClient){}

    getChatLogs(): Observable<IChatLog[]>{
        return this.http.get<IChatLog[]>(this.baseURL+"ChatLogs").pipe(
            tap(data=>console.log('All',JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    private handleError (err: HttpErrorResponse){
        let errorMessage = '';
        if (err.error instanceof ErrorEvent){
            errorMessage = `An error occurred: ${err.error.message}`;
        }
        else{
            errorMessage = `Server returned code: ${err.status}, error message is; ${err.message}`; 
        }
        console.error(errorMessage);
        return throwError(errorMessage);

    }
    getAllChats(): IChatLog[]{
        return this.allChats;
    }

    getChatLogByRoom(id: number): Observable<IChatLog>{
        return this.http.get<IChatLog>(this.baseURL+"ChatLogs/"+id).pipe(
            tap(data=>console.log('All',JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    setMessage(chatRoom: IChatLog): Observable<IChatLog> {
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':  'application/json'
            })
        };
        return this.http.put<IChatLog>(this.baseURL + "ChatLogs/" + chatRoom.id, chatRoom, httpOptions)
            .pipe(catchError(this.handleError));
        
    }
}
