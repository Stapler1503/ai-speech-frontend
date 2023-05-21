import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) { }

  public getAvailableModels(): Observable<any> {
    return this.http.get('http://localhost:3000/chat/models',{ headers: {} });
  }

  public transcriptAudioIntoText(audioFile: File): Observable<any> {
    const formData = new FormData();
    const headers = new HttpHeaders()
    formData.append('audioFile', audioFile, 'filename');

    return this.http.post('http://localhost:3000/chat/speech-recognize', formData, { headers } );
  }
}
