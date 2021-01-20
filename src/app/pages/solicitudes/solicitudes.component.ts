import { Component, OnInit } from '@angular/core';
import { Solicitud } from 'src/app/models/solicitud-proyecto.model';
import { SolicitudProyectoService } from 'src/app/services/solicitud-proyecto.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
 
  public totalSolicitudes = 0;
  public solicitudes: Solicitud[] = [];
  public solicitudesTemp: Solicitud[] = [];
  public desde = 0;
  public cargando = true;
 
  public estado: 'pendiente' | 'rechazado' | 'aceptado' = 'pendiente';

  constructor( private solicitudService: SolicitudProyectoService ) { }

  ngOnInit(): void {
    this.cargarSolicitudes( this.estado );
  }


  cargarSolicitudes( status: 'pendiente' | 'rechazado' | 'aceptado'): void {

    this.cargando = true;
 
    this.solicitudService.getSolicitudesByStatus( status, this.desde )
        .subscribe( ({ total, solicitudes }) => {
          this.totalSolicitudes = total;
          this.solicitudes = solicitudes;
          this.solicitudesTemp = solicitudes;
          this.cargando = false;
          this.estado = status;
        });

  }


  cambioValue( value: 'pendiente' | 'rechazado' | 'aceptado' ){
    
    this.cargarSolicitudes( value );

  }  


  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalSolicitudes ) {
      this.desde -= valor;
    }

    this.cargarSolicitudes( this.estado );

  }
 

  buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.solicitudes = this.solicitudesTemp;
      return;
    }

    /* this.busquedaService.busqueda( 'solicitudes', termino )
        .subscribe( resp => this.solicitudes = resp ); */

  }



}
