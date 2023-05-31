import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ChatService } from "./chat.service";
import { map, switchMap } from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  public recordedChunks: Blob[] = [];
  public recordInProgress = false;
  public mediaRecorder: MediaRecorder = new MediaRecorder(new MediaStream);
  public chatAnswer = 'Text placeholder';

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = ({ data }) => this.recordedChunks.push(data);
        this.mediaRecorder.onstop = () => {
          const file = new File(this.recordedChunks,'record.webm', { type : 'audio/ogg; codecs=opus' });
          this.postRecord(file);
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

  public postRecord(file: File): void {
    this.chatService.transcriptAudioIntoText(file)
      .pipe(
        switchMap(res =>
          this.chatService.sendMessageToChat(res.text))
      )
      .subscribe(
        (res: any) => {
          console.log('chat has responded', res.choices);
          this.chatAnswer = res.choices[0].message.content;
          this.cdr.detectChanges();
        },
        err => console.log('err', err)
    );
  }
}
