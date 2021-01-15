import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemExpediente } from 'src/app/models/item-expediente.model';
import { ExpedienteService } from 'src/app/services/expediente.service';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.css']
})
export class DocumentoComponent implements OnInit {

  public item: ItemExpediente;

  constructor( private activatedRoute: ActivatedRoute,
               private expedienteService: ExpedienteService ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      const { id } = params;
      this.obtenerItem( id );
    })
  }

  obtenerItem( id: string ): void {
    this.expedienteService.getItemExpediente( id )
            .subscribe( item => {
              this.item = item;
              console.log(this.item)
            })
  }


}
