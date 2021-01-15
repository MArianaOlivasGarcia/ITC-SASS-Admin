import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { ModalAlumnoService } from 'src/app/services/modal-alumno.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  public totalAlumnos = 0;
  public alumnos: Alumno[] = [];
  public alumnosTemp: Alumno[] = [];
  public desde = 0;
  public cargando = true;
  public alumnoSeleccionado: Alumno;

  constructor( private alumnoService: AlumnoService,
               private busquedaService: BusquedaService,
               private modalService: ModalAlumnoService ) { }

  ngOnInit(): void {
    this.cargarAlumnos();
  }


  cargarAlumnos(): void {

    this.cargando = true;

    this.alumnoService.getAlumnos( this.desde )
        .subscribe( ({ total, alumnos }) => {
          this.totalAlumnos = total;
          this.alumnos = alumnos;
          this.alumnosTemp = alumnos;
          this.cargando = false;
        });

  }


  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalAlumnos ) {
      this.desde -= valor;
    }

    this.cargarAlumnos();

  }


  buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.alumnos = this.alumnosTemp;
      return;
    }

    this.busquedaService.busqueda( 'alumnos', termino )
        .subscribe( resp => this.alumnos = resp );

  }


  abrirModal( alumno: Alumno ): void {
    this.alumnoSeleccionado = alumno;
    this.modalService.abrirModal()
  }

}
