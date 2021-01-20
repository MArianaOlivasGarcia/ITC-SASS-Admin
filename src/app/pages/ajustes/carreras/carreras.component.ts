import { Component, OnInit } from '@angular/core';
import { Carrera } from 'src/app/models/carrera.model';
import { CarreraService } from 'src/app/services/carrera.service';

@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit {

  public totalCarreras = 0;
  public carreras: Carrera[] = [];
  public carrerasTemp: Carrera[] = [];
  public desde = 0;
  public cargando = true;

  constructor( private carreraService: CarreraService ) { }

  ngOnInit(): void {
    this.cargarCarreras();
  }

  cargarCarreras():void {
    this.cargando = true;
    this.carreraService.getCarrerasPaginadas( this.desde )
          .subscribe( ({total, carreras}) => {
            this.totalCarreras = total;
            this.carreras = carreras;
            this.carrerasTemp = carreras;
            this.cargando = false;
          })
  }

  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalCarreras ) {
      this.desde -= valor;
    }

    this.cargarCarreras();
  }

} 
