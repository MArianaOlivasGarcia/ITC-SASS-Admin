import { Component, OnInit } from '@angular/core';
import { Proyecto } from 'src/app/models/proyecto.models';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { ProyectoService } from 'src/app/services/proyecto.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  public totalProyectos = 0;
  public proyectos: Proyecto[] = [];
  public proyectosTemp: Proyecto[] = [];
  public desde = 0;
  public cargando = true;

  constructor( private proyectoService: ProyectoService,
               private busquedaService: BusquedaService ) { }

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {

    this.cargando = true;

    this.proyectoService.getProyectos( this.desde )
        .subscribe( ({ total, proyectos }) => {
          this.totalProyectos = total;
          this.proyectos = proyectos;
          this.proyectosTemp = proyectos;
          this.cargando = false;
        });

  }

  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalProyectos ) {
      this.desde -= valor;
    }

    this.cargarProyectos();

  }


  buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.proyectos = this.proyectosTemp;
      return;
    }

    this.busquedaService.busqueda( 'proyectos', termino )
        .subscribe( resp => this.proyectos = resp );

  }

}
