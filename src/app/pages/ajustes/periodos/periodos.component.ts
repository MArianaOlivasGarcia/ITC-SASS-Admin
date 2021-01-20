import { Component, OnInit } from '@angular/core';
import { Periodo } from 'src/app/models/periodo.model';
import { PeriodoService } from 'src/app/services/periodo.service';

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

  constructor( private periodoService: PeriodoService ) { }

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


}
