import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Expediente } from 'src/app/models/expediente.model';
import { ItemExpediente } from 'src/app/models/item-expediente.model';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { ModalAlumnoService } from 'src/app/services/modal-alumno.service';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css']
})
export class ExpedienteComponent implements OnInit {

  
  public expediente: Expediente;
  public cargando: boolean = true;

  public itemSeleccionado: ItemExpediente;

  constructor( private expedienteService: ExpedienteService,
               private modalService: ModalAlumnoService,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void { 
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarExpediente(id); 
    }); 

  }


  cargarExpediente( id ): void {
    this.expedienteService.getExpediente(id)
          .subscribe( expediente => {
            this.expediente = expediente;
            this.cargando = false;
          })
  }


  abrirModal( item: ItemExpediente ): void {
    this.itemSeleccionado = item;
    this.modalService.abrirModal()
  }

}
 