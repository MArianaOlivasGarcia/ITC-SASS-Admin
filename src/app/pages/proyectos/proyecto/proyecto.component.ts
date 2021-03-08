import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DependenciaService } from 'src/app/services/dependencia.service';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { Carrera } from 'src/app/models/carrera.model';
import { Dependencia } from 'src/app/models/dependencia.model';
import { ItemCarreraProyecto } from 'src/app/models/item-carrera-proyecto.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Proyecto } from 'src/app/models/proyecto.models';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {


  public formSubmitted = false;
  public proyectoForm: FormGroup;
  public proyectoSeleccionado: Proyecto;
  
  public itemCarreras: ItemCarreraProyecto[] = [];
  public carreraControl = new FormControl();
  public carrerasFiltradas: Observable<Carrera[]>;
  public showCarreras: boolean = false;
  
  public dependencias: Dependencia[] = [];
  public periodos: Periodo[];

  public optionsTipoActividades: {value: string, label: string}[] = [
    { value: 'Administrativas', label: 'Administrativas'},
    { value: 'Asesoria', label: 'Asesoria'},
    { value: 'Docentes', label: 'Docentes'},
    { value: 'Investigación', label: 'Investigación'},
    { value: 'Técnicas', label: 'Técnicas'},
    { value: 'Otro', label: 'Otro'},
  ];


  constructor(  private fb: FormBuilder,
                private proyectoService: ProyectoService,
                private dependenciaService: DependenciaService,
                private busquedaService: BusquedaService,
                private periodoService: PeriodoService,
                private router: Router,
                private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.cargarDependencias();
    this.cargarPeriodos();
    
    this.activatedRoute.params.subscribe( ({ id }) => {
      if ( id == 'nuevo' ) {
        this.showCarreras = true;
      }
      this.cargarProyecto( id );
    });


    this.proyectoForm = this.fb.group({
      actividades: ['', Validators.required ],
      apoyo_economico: [false,  Validators.required],
      dependencia: ['', Validators.required ],
      email_responsable: ['', Validators.required ],
      horario: ['', Validators.required ],
      instalacion: [false,  Validators.required],
      lugar_desempeno: ['', Validators.required ],
      modalidad: ['', Validators.required ],
      nombre: ['', Validators.required ],
      objetivo: ['', Validators.required ],
      periodo: ['', Validators.required ],
      puesto_responsable: ['', Validators.required ],
      responsable: ['', Validators.required ],
      telefono_responsable: ['', Validators.required ],
      tipo_actividades: ['', Validators.required ],
      tipo: ['', Validators.required ],
    }); 

    this.carrerasFiltradas = this.carreraControl.valueChanges
      .pipe(
        map( value => typeof value === 'string' ? value: value.nombre ),
        mergeMap(value => value ? this._filter(value): [])
      );

  }


  cargarDependencias(): void {
    this.dependenciaService.getDependencias()
          .subscribe( (dependencias) => {
            this.dependencias = dependencias;
            }
          );
  }

  cargarPeriodos(): void {
    this.periodoService.getPeriodos()
          .subscribe( periodos => {
            this.periodos = periodos;
            }
          );
  }


  cargarProyecto( id: string ): void{

    if ( id === 'nuevo' ) { return; }

    this.proyectoService.getProyecto( id )
        .subscribe( resp => {
          // TODO: SI NO ENCUENTRA EL PROYECTO O EL ENLACE ES INVENTADO
          //  return this.router.navigateByUrl(`/dashboard/proyectos`);

          let { apoyo_economico,
                  instalacion,
                  nombre,
                  dependencia: { _id },
                  objetivo,
                  actividades,
                  tipo_actividades,
                  periodo,
                  lugar_desempeno,
                  modalidad,
                  horario,
                  tipo,
                  responsable,
                  puesto_responsable,
                  email_responsable,
                  telefono_responsable,
                } = resp.proyecto;
          this.proyectoSeleccionado = resp.proyecto;
          this.itemCarreras = resp.itemsCarrera;
          
          
          let existe = false;
          this.optionsTipoActividades.forEach((opt: {value: string, label: string}) => {
            if( tipo_actividades === opt.value ){
              existe = true;
            }
          })

          if ( !existe ) {
            this.proyectoForm.addControl('otro', new FormControl('', Validators.required));
            this.proyectoForm.setValue({ apoyo_economico,
              instalacion,
              nombre,
              dependencia: _id,
              objetivo,
              actividades,
              tipo_actividades: 'Otro',
              periodo,
              lugar_desempeno,
              modalidad,
              horario,
              tipo,
              otro: tipo_actividades,
              responsable,
              puesto_responsable,
              email_responsable,
              telefono_responsable});
          } else {
            this.proyectoForm.setValue({ apoyo_economico,
              instalacion,
              nombre,
              dependencia: _id,
              objetivo,
              actividades,
              tipo_actividades,
              periodo,
              lugar_desempeno,
              modalidad,
              horario,
              tipo,
              responsable,
              puesto_responsable,
              email_responsable,
              telefono_responsable});
          }

          

        });

  }



  guardar(): void {
    this.formSubmitted = true;
    if ( this.itemCarreras.length == 0 ){
      this.carreraControl.setErrors({'invalid': true})
    }

    if ( this.proyectoSeleccionado?.publico ){
      if ( this.proyectoForm.invalid || this.carreraControl.invalid ) { return; }
    }
    
    if( this.proyectoForm.invalid ) { return; }
     
    const { nombre } = this.proyectoForm.value;
    
    if ( this.proyectoForm.get('otro') ) {
      this.proyectoForm.get('tipo_actividades').setValue(this.proyectoForm.get('otro').value)
      this.proyectoForm.removeControl('otro');
    }

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
      let nuevoItemCarreraProyecto = new ItemCarreraProyecto(1, 1, carrera);
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
                      item.disponibilidad = cantidad
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
    this.itemCarreras = this.itemCarreras.filter( (item: ItemCarreraProyecto) => id !== item.carrera._id );
  }
  



  cambioTipoActividad( value: string ): void {
    
    if ( value !== 'Otro') {
      this.proyectoForm.removeControl('otro');
    } else {
      this.proyectoForm.addControl('otro', new FormControl('', Validators.required));
    }
    
  }

 

  cambioDisponibilidad( id: string, event: any) {
    let disponibilidad: number = event.target.value as number;

    this.itemCarreras = this.itemCarreras
                  .map( (item: ItemCarreraProyecto) => {
                    if( id === item.carrera._id ) {

                      if ( item.cantidad < disponibilidad ) {
                        this.carreraControl.setErrors({'dispoMayor': true})
                      } else {
                        this.carreraControl.setErrors(null);
                        item.disponibilidad = disponibilidad
                      }

                      console.log(this.carreraControl.valid)

                    }
                    return item;
                  })

  }

}

