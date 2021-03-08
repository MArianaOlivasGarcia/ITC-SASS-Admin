import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemExpediente } from 'src/app/models/item-expediente.model';
import { Periodo } from 'src/app/models/periodo.model';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { ModalService } from 'src/app/services/modal-alumno.service';

@Component({
  selector: 'app-estructura',
  templateUrl: './estructura.component.html',
  styleUrls: ['./estructura.component.css']
})
export class EstructuraComponent implements OnInit {

  public estructura: any[] = [];
  public cargando: boolean = true;

  public itemSeleccionado: ItemExpediente;

  @Input() periodo: Periodo;

  constructor( private expedienteService: ExpedienteService,
               private modalService: ModalService ) { }

  ngOnInit(): void {
    this.cargarEstructuraExpediente();
  }

  

  cargarEstructuraExpediente():void {
    this.expedienteService.getEstructuraExpediente()
            .subscribe( estructura => {
              this.cargando = false
              this.estructura = estructura
            })
  }


  abrirModal( item: ItemExpediente ): void {
    this.itemSeleccionado = item;
    this.modalService.abrirModal()
  }


}
