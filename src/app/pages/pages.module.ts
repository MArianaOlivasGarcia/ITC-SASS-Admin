import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { AlumnosComponent } from './alumnos/alumnos.component';
import { AlumnoComponent } from './alumnos/alumno/alumno.component';
import { DetalleAlumnoComponent } from './alumnos/detalle-alumno/detalle-alumno.component';
import { ExpedienteComponent } from './alumnos/expediente/expediente.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DependenciasComponent } from './dependencias/dependencias.component';
import { DependenciaComponent } from './dependencias/dependencia/dependencia.component';
import { DetalleDependenciaComponent } from './dependencias/detalle-dependencia/detalle-dependencia.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { DetalleProyectoComponent } from './proyectos/detalle-proyecto/detalle-proyecto.component';
import { ProyectoComponent } from './proyectos/proyecto/proyecto.component';
import { PagesComponent } from './pages.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuarios/usuario/usuario.component';
import { DetalleUsuarioComponent } from './usuarios/detalle-usuario/detalle-usuario.component';
import { RegisterComponent } from './usuarios/register/register.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { MensajeComponent } from './mensajes/mensaje/mensaje.component';
import { AvisosComponent } from './avisos/avisos.component';
import { AvisoComponent } from './avisos/aviso/aviso.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { DocumentoComponent } from './documentos/documento/documento.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudComponent } from './solicitudes/solicitud/solicitud.component';
import { AjustesComponent } from './ajustes/ajustes.component';
import { CarreraComponent } from './ajustes/carreras/carrera/carrera.component';
import { PeriodoComponent } from './ajustes/periodos/periodo/periodo.component';
import { CarrerasComponent } from './ajustes/carreras/carreras.component';
import { PeriodosComponent } from './ajustes/periodos/periodos.component';

import { ImagenPipe } from '../pipes/imagen.pipe';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from 'src/environments/environment';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const token = localStorage.getItem('accessToken') || '';

const config: SocketIoConfig = {
  url: environment.ws_url, options: {
    transports: ['websocket'],
    query: {
      Authorization: `Bearer ${token}`
    } 
  }
};


@NgModule({
  declarations: [
    ImagenPipe,
    AlumnosComponent,
    AlumnoComponent,
    DetalleAlumnoComponent,
    ExpedienteComponent,
    DashboardComponent,
    DependenciasComponent,
    DependenciaComponent,
    DetalleDependenciaComponent,
    PerfilComponent,
    ProyectosComponent,
    DetalleProyectoComponent,
    ProyectoComponent,
    PagesComponent,
    UsuariosComponent,
    UsuarioComponent,
    DetalleUsuarioComponent,
    RegisterComponent,
    MensajesComponent,
    MensajeComponent,
    AvisosComponent,
    AvisoComponent,
    DocumentosComponent,
    DocumentoComponent,
    PdfViewerComponent,
    SolicitudesComponent,
    SolicitudComponent,
    AjustesComponent,
    CarreraComponent,
    PeriodoComponent,
    CarrerasComponent,
    PeriodosComponent,],
  exports: [
    DashboardComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    SocketIoModule.forRoot(config),
    NgxExtendedPdfViewerModule
  ]
})
export class PagesModule { }
