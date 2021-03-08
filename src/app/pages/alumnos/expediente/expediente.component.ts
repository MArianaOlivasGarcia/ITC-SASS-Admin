import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Expediente } from 'src/app/models/expediente.model';
import { ItemExpediente } from 'src/app/models/item-expediente.model';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { ModalService } from 'src/app/services/modal-alumno.service';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css']
})
export class ExpedienteComponent implements OnInit {
  
  public expediente: Expediente;
  public cargando: boolean = true;

  public itemSeleccionado: ItemExpediente;

  public showModal: boolean = false;


  constructor( private expedienteService: ExpedienteService,
               private modalService: ModalService,
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
    this.showModal = true;
    this.itemSeleccionado = item;
    this.modalService.abrirModal()
  }

  addItem( item: ItemExpediente ){
     /* const { items } = this.expediente;
     const newItems = items.map( (i, index) => {
        if ( i._id == item._id) {
          i = item;
        }
        return i;
     })
     this.expediente.items = newItems; */
     const { items } = this.expediente;
     items.map( (i, index) => {
        if ( i._id == item._id) {
          this.expediente.items[index] = item;
        }
        return i;
     })
  }

  addCerrar(){
    this.showModal = false;
  }


}
 