import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Carrera } from 'src/app/models/carrera.model';
import { Dependencia } from 'src/app/models/dependencia.model';
import { ItemCarreraProyecto } from 'src/app/models/item-carrera-proyecto.model';
import { Proyecto } from 'src/app/models/proyecto.models';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { DependenciaService } from 'src/app/services/dependencia.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {


  public formSubmitted = false;
  public proyectoForm: FormGroup;
  public dependencias: Dependencia[] = [];
  public proyectoSeleccionado: Proyecto;

  public itemCarreras: ItemCarreraProyecto[] = [];
  public carreraControl = new FormControl();
  public carrerasFiltradas: Observable<Carrera[]>;



  constructor(  private fb: FormBuilder,
                private proyectoService: ProyectoService,
                private dependenciaService: DependenciaService,
                private busquedaService: BusquedaService,
                private router: Router,
                private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.cargarDependencias();
    
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarProyecto( id );
    });


    this.proyectoForm = this.fb.group({
      nombre: ['', Validators.required ],
      dependencia: ['', Validators.required ],
      objetivo: ['', Validators.required ],
      actividades: ['', Validators.required ],
      periodo: ['', Validators.required ],
      lugar_desempeño: ['', Validators.required ],
      modalidad: ['', Validators.required ],
      tipo: ['', Validators.required ],
      horario: ['', Validators.required ],
      apoyo_economico: [false],
      responsable: ['', Validators.required ],
      puesto_responsable: ['', Validators.required ],
    });

    this.carrerasFiltradas = this.carreraControl.valueChanges
      .pipe(
        map( value => typeof value === 'string' ? value: value.nombre ),
        mergeMap(value => value ? this._filter(value): [])
      );

  }


  cargarDependencias(): void {
    this.dependenciaService.getDependencias()
          .subscribe( resp => {
            this.dependencias = resp.dependencias;
            }
          );
  }

  cargarProyecto( id: string ): void{

    if ( id === 'nuevo' ) { return; }

    this.proyectoService.getProyecto( id )
        .subscribe( proyecto => {
          // TODO: SI NO ENCUENTRA EL PROYECTO O EL ENLACE ES INVENTADO
          //  return this.router.navigateByUrl(`/dashboard/proyectos`);

          const { apoyo_economico,
                  nombre,
                  dependencia: { _id },
                  objetivo,
                  actividades,
                  periodo,
                  lugar_desempeño,
                  modalidad,
                  horario,
                  tipo,
                  responsable,
                  puesto_responsable } = proyecto;
          this.proyectoSeleccionado = proyecto;
          this.itemCarreras = proyecto.carreras;
          this.proyectoForm.setValue({ apoyo_economico,
                                       nombre,
                                       dependencia: _id,
                                       objetivo,
                                       actividades,
                                       periodo,
                                       lugar_desempeño,
                                       modalidad,
                                       horario,
                                       tipo,
                                       responsable,
                                       puesto_responsable});

        });

  }



  guardar(): void {
    this.formSubmitted = true;
    if ( this.itemCarreras.length == 0 ){
      this.carreraControl.setErrors({'invalid': true})
    }
    if ( this.proyectoForm.invalid ) { return; }

    const { nombre } = this.proyectoForm.value;

    if ( this.proyectoSeleccionado ) {
      // Actualizar
      const data = {
        ... this.proyectoForm.value,
        _id: this.proyectoSeleccionado._id,
        carreras: this.itemCarreras
      };

      this.proyectoService.actualizarProyecto( data )
          .subscribe( () => {
            Swal.fire({
              title: 'Guardado',
              text: `Proyecto ${nombre} actualizado con éxito.`,
              icon: 'success'
            });
          });

    } else {
      // CREAR PROYECTO
      const data = {
        ... this.proyectoForm.value,
        carreras: this.itemCarreras
      };

      this.proyectoService.crearProyecto( data )
      .subscribe( resp => {
        Swal.fire({
          title: 'Creado',
          text: `Proyecto ${nombre} creado con éxito.`,
          icon: 'success'
        });
        this.router.navigateByUrl(`/dashboard/proyecto/${resp.proyecto._id}`);
        });

    }


  }


  campoNoValido( campo: string ): boolean {


    if ( this.proyectoForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }


  mensajesError( campo: string  ): string {
    return this.proyectoForm.get(campo)?.hasError('required') ? `Este campo es requerido.` : '';
  }



  private _filter(value: string): Observable<Carrera[]> {
    const filterValue = value.toLowerCase();

    return this.busquedaService.busqueda('carreras', filterValue);
    
  }


  mostrarNombre( carrera?: Carrera ): string | undefined {
    return carrera ? carrera.nombre : undefined;
  }


  seleccionarCarrera( event: MatAutocompleteSelectedEvent ): void {
    let carrera = event.option.value as Carrera;

    if ( this.existeItem(carrera._id) ) {
      this.incrementarCantidad( carrera._id );
    } else {
      let nuevoItemCarreraProyecto = new ItemCarreraProyecto(1, carrera);
      this.itemCarreras.push( nuevoItemCarreraProyecto );
    }


    this.carreraControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }


  actualizarCantidad( id: string, event: any) {
    let cantidad: number = event.target.value as number;

    if( cantidad == 0 ) {
      return this.borrarItemCarrera(id);
    }

    this.itemCarreras = this.itemCarreras
                  .map( (item: ItemCarreraProyecto) => {
                    if( id === item.carrera._id ) {
                      item.cantidad = cantidad
                    }
                    return item;
                  })
  }


  existeItem(id: string): boolean {
    let existe = false;
    this.itemCarreras.forEach((item: ItemCarreraProyecto) => {
      if(id === item.carrera._id){
        existe = true;
      }
    })
    return existe;
  }


  incrementarCantidad(id: string) : void {
    this.itemCarreras = this.itemCarreras.map( (item: ItemCarreraProyecto) => {
      if(id === item.carrera._id){
        ++item.cantidad;
      }
      return item;
    });
  }

  borrarItemCarrera( id: string ):void {
    this.itemCarreras = this.itemCarreras.filter( (item: ItemCarreraProyecto) => {
      id !== item.carrera._id;
    })
  }


}

