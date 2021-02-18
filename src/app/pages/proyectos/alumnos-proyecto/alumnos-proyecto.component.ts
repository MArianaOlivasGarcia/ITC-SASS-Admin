import { Component, destroyPlatform, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/models/alumno.model';
import { Proyecto } from 'src/app/models/proyecto.models';
import { AlumnoService } from 'src/app/services/alumno.service';
import { ModalAlumnoService } from 'src/app/services/modal-alumno.service';

@Component({
  selector: 'app-alumnos-proyecto',
  templateUrl: './alumnos-proyecto.component.html',
  styleUrls: ['./alumnos-proyecto.component.css']
})
export class AlumnosProyectoComponent implements OnInit {

  public totalAlumnos = 0;
  public proyecto: Proyecto;
  public alumnos: Alumno[] = [];
  public alumnosTemp: Alumno[] = [];
  public desde = 0;
  public cargando = true;
  
  constructor( private alumnoService: AlumnoService,
               private activatedRoute: ActivatedRoute  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
        this.cargarAlumnos(id);
    })
  }

 

  cargarAlumnos( idProyecto: string ): void {
    this.alumnoService.getAllByProyecto( this.desde, idProyecto )
        .subscribe( ({proyecto, alumnos, total}) => {
          this.totalAlumnos = total;
          this.proyecto = proyecto;
          this.alumnos = alumnos;
          this.alumnosTemp = alumnos;
          this.cargando = false;
          console.log(alumnos)
        })
  }

  /* buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.alumnos = this.alumnosTemp;
      return;
    } */

    /* this.busquedaService.busqueda( 'proyectos', termino )
        .subscribe( resp => this.proyectos = resp ); */

  /* } */


  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalAlumnos ) {
      this.desde -= valor;
    }

    this.cargarAlumnos(this.proyecto._id);

  }

  
}
