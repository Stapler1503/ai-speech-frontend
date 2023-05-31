import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) { }

  public sendMessageToChat(message: string) {
    return this.http.post('http://localhost:3000/chat',{ message }, { headers: {} });
  }

  public transcriptAudioIntoText(audioFile: File): Observable<any> {
    const headers = new HttpHeaders();
    const formData = new FormData();
    headers.append('content-type', 'multipart/form-data');
    formData.append('audioFile', audioFile, 'filename');

    return this.http.post('http://localhost:3000/chat/speech-recognize', formData, { headers } );
  }
}
