import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public socketStatus = false;

  constructor( private socket: Socket ) {
    this.checkStatus();
  }
 

  checkStatus(): void {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
    });
    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    });
  }


  emit( evento: string, payload?: any, callback?: Function ) {
    console.log('Emitiendo', evento);
    this.socket.emit( evento, payload, callback );
  }


  desconectar(): void {
    this.socket.disconnect();
  }


  conectar(): void {
    this.socket.connect();
  }
}