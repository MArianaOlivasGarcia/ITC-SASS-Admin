import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Periodo } from 'src/app/models/periodo.model';
import { Proyecto } from 'src/app/models/proyecto.models';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import Swal from 'sweetalert2';

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

  public tipo: 'publico' | 'personal' = 'publico';
  public tipoTemp: 'publico' | 'personal';

  public periodos: Periodo[] = [];
  public periodoSeleccionado: string;
  
  
  constructor( private proyectoService: ProyectoService,
               private busquedaService: BusquedaService,
               private periodoService: PeriodoService,
               private router: Router ) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.periodoService.getPeriodos()
          .subscribe( periodos =>{
              this.periodos = periodos 
              this.periodoSeleccionado = this.periodos[0]._id;
              this.cargarProyectos( this.tipo, this.periodoSeleccionado )
          })
  }

  cargarProyectos( tipo: 'publico' | 'personal', periodo: string): void {

    this.cargando = true;

    this.proyectoService.getProyectosByTipoAndPeriodo( this.desde, tipo, periodo )
        .subscribe( ({ total, proyectos }) => {
          this.totalProyectos = total;
          this.proyectos = proyectos;
          this.proyectosTemp = proyectos;
          this.cargando = false;
          this.tipo = tipo;
          this.tipoTemp = tipo;
        });
 
  }

  


  buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.proyectos = this.proyectosTemp;
      this.tipo = this.tipoTemp;
      return;
    }

    this.busquedaService.busqueda( 'proyectos', termino )
        .subscribe( resp => this.proyectos = resp );

  }



  cambioCodigo( tipo: 'publico' | 'personal' ): void {
    this.tipo = tipo;
    this.cargarProyectos( this.tipo, this.periodoSeleccionado );
  }


  cambioPeriodo( periodo: string ): void {
    this.periodoSeleccionado = periodo
    this.cargarProyectos( this.tipo, periodo )
  }


  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalProyectos ) {
      this.desde -= valor;
    }

    this.cargarProyectos( this.tipo, this.periodoSeleccionado );

  }
  

  duplicar( id: string ): void {


    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro que deseas duplicar este proyecto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
      if (result.isConfirmed) {
      
        this.proyectoService.duplicarProyecto( id )
        .subscribe( proyecto => {

          const { nombre } = proyecto;
          Swal.fire({
            title: 'Duplicado',
            text: `Proyecto ${nombre} duplicado con éxito.`,
            icon: 'success'
          });
          
          this.router.navigateByUrl(`/dashboard/proyecto/${proyecto._id}`);
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


  adoptar( id: string ): void {


    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro que deseas adoptar este proyecto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
      if (result.isConfirmed) {
      
        this.proyectoService.adoptarProyecto( id )
        .subscribe( proyecto => {

          const { nombre } = proyecto;
          Swal.fire({
            title: 'Adoptado',
            text: `Proyecto ${nombre} adoptado con éxito.`,
            icon: 'success'
          });
          
          this.router.navigateByUrl(`/dashboard/proyecto/${proyecto._id}`);
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
