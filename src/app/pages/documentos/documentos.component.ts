import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemExpediente } from 'src/app/models/item-expediente.model';
import { ExpedienteService } from 'src/app/services/expediente.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  public totalItems = 0;
  public items: ItemExpediente[] = [];
  public itemsTemp: ItemExpediente[] = [];
  public desde = 0;
  public cargando = true;
 
  public estado: 'pendiente' | 'rechazado' | 'aceptado' = 'pendiente';
  public codigo: string;

  public estructura: any[] = [];

  constructor( private expedienteService: ExpedienteService ) { }



  ngOnInit(): void {
    this.cargarEstructuraExpediente();
    
  } 


  cargarEstructuraExpediente(): void {
    this.expedienteService.getEstructuraExpediente()
            .subscribe( estructura => {
              this.estructura = estructura;
              this.codigo = this.estructura[0].codigo;
              this.cargarItems(this.estado, this.codigo)
            });
  }

  cambioDocumento( value: string ){
    
    this.codigo = value;
    this.cargarItems( this.estado, this.codigo);

  } 



  cargarItems( status: 'pendiente' | 'rechazado' | 'aceptado', codigo: string ): void {

    this.cargando = true;

    this.expedienteService.getAllByStatusAndCodigo(status, codigo , this.desde)
      .subscribe( ({total, items}) => {
        this.totalItems = total;
        this.items = items;
        this.itemsTemp = items;
        this.cargando = false;
        this.estado = status;
      })

  }


  cambioValue( value: 'pendiente' | 'rechazado' | 'aceptado' ){
    this.estado = value;
    this.cargarItems( this.estado, this.codigo );

  } 

  
  cambiarPagina( valor: number ): void {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalItems ) {
      this.desde -= valor;
    }

    this.cargarItems( this.estado, this.codigo );

  }


}
