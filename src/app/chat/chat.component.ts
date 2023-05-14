import { Component } from '@angular/core';
import {ChatService} from "./chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  public recordedChunks: Blob[] = [];

  constructor(private chatService: ChatService) { }

  public getModels(): void {
    this.chatService.getAvailableModels()
      .subscribe(res => {
        console.log('models', res);
      });
  }

  public recordVoice() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(stream => {
        console.log('record', stream);
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = ({ data }: BlobEvent) => {
          console.log('data', data);
          if (data.size > 0) {
            this.recordedChunks.push(data);
          } else {
            // ...
          }
        };
        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
          // const file = new File(this.recordedChunks,'my-file.webm',
          //   { type: 'audio/webm' });
          // console.log('file', file);
          const file = new Blob(this.recordedChunks, {
            'type': 'audio/webm'
          });
          const blobURL = URL.createObjectURL(file);
          var link = document.createElement("a"); // Or maybe get it from the current document
          link.href = blobURL;
          link.download = "default-name.webm";
          link.innerHTML = "Click here to download the file";
          document.body.appendChild(link);
          // this.chatService.transcriptAudioIntoText(file)
          //   .subscribe(res => {
          //     console.log('transcribed audio', res);
          //   })
          return;
        }, 5000);
      });
  }
}
