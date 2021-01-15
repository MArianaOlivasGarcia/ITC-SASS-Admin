import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemExpediente } from 'src/app/models/item-expediente.model';
import { ExpedienteService } from 'src/app/services/expediente.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  public aprobados: ItemExpediente[] = [];
  public pendientes: ItemExpediente[] = []; 
  public rechazados: ItemExpediente[] = [];

  constructor( private expedienteService: ExpedienteService,
               private activatedRouter: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRouter.params.subscribe( params => {
      const { codigo } = params;
      this.obtenerDocumentos( codigo );
    })

  }

  obtenerDocumentos( codigo: string ): void {
    this.expedienteService.getAllByCodigo( codigo )
          .subscribe( resp => {
            this.aprobados = resp.aprobados;
            this.pendientes =  resp.pendientes;
            this.rechazados =  resp.rechazados;
          });
  }

}
