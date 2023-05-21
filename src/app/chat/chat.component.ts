import { Component, OnInit } from '@angular/core';
import { ChatService } from "./chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  public recordedChunks: Blob[] = [];
  public recordInProgress = false;
  public mediaRecorder: MediaRecorder = new MediaRecorder(new MediaStream);

  constructor(private chatService: ChatService) {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = ({ data }) => this.recordedChunks.push(data);
        this.mediaRecorder.onstop = (event) => {
          const file = new File(this.recordedChunks,'record.webm', { type : 'audio/ogg; codecs=opus' });
          this.postRecord(file);
          // this.downloadFile(file);
        }
      });
  }

  public startRecording(): void {
    this.mediaRecorder.start();
    this.recordInProgress = true;
  }

  public stopRecording(): void {
    this.mediaRecorder.stop();
    this.recordInProgress = false;
  }

  public getModels(): void {
    this.chatService.getAvailableModels()
      .subscribe(res => {
        console.log('models', res);
      });
  }

  public postRecord(file: File): void {
    this.chatService.transcriptAudioIntoText(file)
      .subscribe(res => {
        console.log('transcribed audio', res);
      },
    err => {
      console.log('postRecord err', err);
    });
  }

  public downloadFile(file: File): void {
    const blobURL = URL.createObjectURL(file);
    var link = document.createElement("a");
    link.href = blobURL;
    link.download = "default-name.webm";
    link.innerHTML = "Click here to download the file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
