import { Component, OnInit } from '@angular/core';
import { Carrera } from 'src/app/models/carrera.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde = 0;
  public cargando = true;


  constructor( private usuarioService: UsuarioService,
               private busquedaService: BusquedaService ) { }

  ngOnInit(): void {

    this.cargarUsuarios();

  }



  cargarUsuarios(): void {

    this.cargando = true;

    this.usuarioService.getUsuarios( this.desde )
        .subscribe( ({ total, usuarios }) => {
          this.totalUsuarios = total;
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.cargando = false;
        });

  }



  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalUsuarios ) {
      this.desde -= valor;
    }

    this.cargarUsuarios();

  }


  buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.busquedaService.busqueda( 'usuarios', termino )
        .subscribe( resp => this.usuarios = resp );

  }


}
