import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proyecto } from 'src/app/models/proyecto.models';
import { BusquedaService } from 'src/app/services/busqueda.service';
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

  public tipo: 'publico' | 'privado' = 'publico';

  constructor( private proyectoService: ProyectoService,
               private busquedaService: BusquedaService,
               private router: Router ) { }

  ngOnInit(): void {
    this.cargarProyectos( this.tipo );
  }

  cargarProyectos( tipo: 'publico' | 'privado'): void {

    this.cargando = true;

    this.proyectoService.getProyectos( this.desde, tipo )
        .subscribe( ({ total, proyectos }) => {
          this.totalProyectos = total;
          this.proyectos = proyectos;
          this.proyectosTemp = proyectos;
          this.cargando = false;
          this.tipo = tipo;
        });

  }

  


  buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.proyectos = this.proyectosTemp;
      return;
    }

    this.busquedaService.busqueda( 'proyectos', termino )
        .subscribe( resp => this.proyectos = resp );

  }



  cambioValue( tipo: 'publico' | 'privado' ): void {
    this.cargarProyectos( tipo );
  }



  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalProyectos ) {
      this.desde -= valor;
    }

    this.cargarProyectos( this.tipo );

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
        })
      
      }
    })

  }

}
