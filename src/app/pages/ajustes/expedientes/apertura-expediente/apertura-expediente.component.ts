import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Periodo } from 'src/app/models/periodo.model';
import { ExpedienteService } from 'src/app/services/expediente.service';
import Swal from 'sweetalert2';
import { SolicitudProyectoService } from 'src/app/services/solicitud-proyecto.service';

@Component({
  selector: 'app-apertura-expediente',
  templateUrl: './apertura-expediente.component.html',
  styleUrls: ['./apertura-expediente.component.css']
})
export class AperturaExpedienteComponent implements OnInit {

  public periodo: Periodo;
  public cargando:boolean = true;

  public totalAceptado: number;
  public totalRechazado: number;
  public totalPendiente: number;

  constructor( private activatedRoute: ActivatedRoute,
               private periodoService: PeriodoService,
               private solicitudService: SolicitudProyectoService,
               private expedienteService: ExpedienteService ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({periodo}) => {
      this.cargarPeriodo(periodo)
    })

  }

  cargarPeriodo( idPeriodo: string ): void {
    this.periodoService.getPeriodo(idPeriodo)
            .subscribe( periodo => {
              this.cargando = false;
              this.periodo = periodo;
              this.cargarTotalesSolicitudes( this.periodo );
            })
  }



  cargarTotalesSolicitudes( periodo: Periodo ): void {
    this.solicitudService.getTotalesAceptadoAndRechazado( periodo._id )
          .subscribe( resp =>{
            this.totalAceptado = resp.totalAceptado;
            this.totalRechazado = resp.totalRechazado;
            this.totalPendiente = resp.totalPendiente;
          })
  }


  aperturarExpedientes(): void {


    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se hara la apertura de ${ this.totalAceptado } expedientes correspondientes al periodo ${this.periodo.nombre}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
      if (result.isConfirmed) {

        
        Swal.showLoading();
        
        this.expedienteService.aperturarExpedientesByPeriodo( this.periodo )
        .subscribe( resp =>  {
          
             this.periodo = resp.periodo;
 
            Swal.fire({
              title: 'Apertura exitosa',
              text: resp.message,
              icon: 'success'
            })

      
            }, err => {
              Swal.fire({
                title: 'Error', 
                text: err.error.message,
                icon: 'error' 
              })
            })
            
      }
    })

  }

}
