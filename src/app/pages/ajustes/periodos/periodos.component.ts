import { Component, OnInit } from '@angular/core';
import { Periodo } from 'src/app/models/periodo.model';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.css']
})
export class PeriodosComponent implements OnInit {

  public totalPeriodos = 0;
  public periodos: Periodo[] = [];
  public periodosTemp: Periodo[] = [];
  public desde = 0;
  public cargando = true;

  constructor( private periodoService: PeriodoService,
               private expedienteService: ExpedienteService ) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos():void {
    this.cargando = true;
    this.periodoService.getPeriodosPaginados( this.desde )
          .subscribe( ({total, periodos}) => {
            this.totalPeriodos = total;
            this.periodos = periodos;
            this.periodosTemp = periodos;
            this.cargando = false;
          })
  } 

  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalPeriodos ) {
      this.desde -= valor;
    }

    this.cargarPeriodos();

  }



  aperturarExpedientes( periodo: Periodo, index: number ): void {

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se hara la apertura de los expedientes correspondientes al periodo ${periodo.nombre}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
      if (result.isConfirmed) {

        
        Swal.showLoading();
        
        this.expedienteService.aperturarExpedientesByPeriodo( periodo )
        .subscribe( resp =>  {
          
            this.periodos[index] = resp.periodo;

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
