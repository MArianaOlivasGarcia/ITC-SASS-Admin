import { Component, OnInit } from '@angular/core';
import { Dependencia } from 'src/app/models/dependencia.model';
import { DependenciaService } from 'src/app/services/dependencia.service';
import { BusquedaService } from 'src/app/services/busqueda.service';

@Component({
  selector: 'app-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.css']
})
export class DependenciasComponent implements OnInit {

  public totalDependencias = 0;
  public dependencias: Dependencia[] = [];
  public dependenciasTemp: Dependencia[] = [];
  public desde = 0;
  public cargando = true;

  constructor( private dependenciaService: DependenciaService,
               private busquedaService: BusquedaService ) { }

  ngOnInit(): void {
    this.cargarDependencias();
  }


  cargarDependencias(): void {

    this.cargando = true;

    this.dependenciaService.getDependencias( this.desde )
        .subscribe( ({ total, dependencias }) => {
          this.totalDependencias = total;
          this.dependencias = dependencias;
          this.dependenciasTemp = dependencias;
          this.cargando = false;
        });

  }



  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalDependencias ) {
      this.desde -= valor;
    }

    this.cargarDependencias();

  }


  buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.dependencias = this.dependenciasTemp;
      return;
    }

    this.busquedaService.busqueda( 'dependencias', termino )
        .subscribe( resp => this.dependencias = resp );

  }

}
