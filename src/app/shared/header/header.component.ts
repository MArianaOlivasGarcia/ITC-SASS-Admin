import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderService } from 'src/app/services/header.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public usuario: Usuario;

  constructor( private authService: AuthService,
               private sidebarService: SidebarService,
               public headerService: HeaderService,
               public webSocketService: WebSocketService ) {
    this.usuario = this.authService.usuario;
  }


  logout(): void {
    this.authService.logout();
  }

  abrirSidebar(): void {
    if ( this.sidebarService.ocultarSidebar ){
      this.sidebarService.abrirSidebar();
    } else {
      this.sidebarService.cerrarSidebar();
    }
  }

}
