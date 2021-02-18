import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './usuarios/register/register.component';
import { AlumnoComponent } from './alumnos/alumno/alumno.component';
import { AlumnosComponent } from './alumnos/alumnos.component';
import { ExpedienteComponent } from './alumnos/expediente/expediente.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DependenciaComponent } from './dependencias/dependencia/dependencia.component';
import { DependenciasComponent } from './dependencias/dependencias.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProyectoComponent } from './proyectos/proyecto/proyecto.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { UsuarioComponent } from './usuarios/usuario/usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MensajeComponent } from './mensajes/mensaje/mensaje.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { AvisosComponent } from './avisos/avisos.component';
import { AvisoComponent } from './avisos/aviso/aviso.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { DocumentoComponent } from './documentos/documento/documento.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudComponent } from './solicitudes/solicitud/solicitud.component';
import { AjustesComponent } from './ajustes/ajustes.component';
import { CarreraComponent } from './ajustes/carreras/carrera/carrera.component';
import { PeriodoComponent } from './ajustes/periodos/periodo/periodo.component';
import { AdminGuard } from '../guards/admin.guard';
import { AlumnosProyectoComponent } from './proyectos/alumnos-proyecto/alumnos-proyecto.component';

const routes: Routes = [
  { path: 'alumno/:id',          canActivate: [ AdminGuard ], component: AlumnoComponent,       data: { titulo: 'Alumno' } },
  { path: 'alumnos',             canActivate: [ AdminGuard ], component: AlumnosComponent,      data: { titulo: 'Alumnos' } },
  { path: 'dependencia/:id',     canActivate: [ AdminGuard ], component: DependenciaComponent,  data: { titulo: 'Dependencia' } },
  { path: 'dependencias',        canActivate: [ AdminGuard ], component: DependenciasComponent, data: { titulo: 'Dependencias' } },
  { path: 'usuario/nuevo',       canActivate: [ AdminGuard ], component: RegisterComponent,     data: { titulo: 'Registrar usuario' } },
  { path: 'usuario/:id',         canActivate: [ AdminGuard ], component: UsuarioComponent,      data: { titulo: 'Usuario' } },
  { path: 'usuarios',            canActivate: [ AdminGuard ], component: UsuariosComponent,     data: { titulo: 'Usuarios' } },
  { path: 'proyecto-alumnos/:id',canActivate: [ AdminGuard ], component: AlumnosProyectoComponent, data: { titulo: 'Proyecto' } },
  { path: 'proyecto/:id',        canActivate: [ AdminGuard ], component: ProyectoComponent,     data: { titulo: 'Proyecto' } },
  { path: 'proyectos',           canActivate: [ AdminGuard ], component: ProyectosComponent,    data: { titulo: 'Banco de Proyectos' } },
  { path: 'ajustes/carrera/:id', canActivate: [ AdminGuard ], component: CarreraComponent,      data: { titulo: 'Carrera' } },
  { path: 'ajustes/periodo/:id', canActivate: [ AdminGuard ], component: PeriodoComponent,      data: { titulo: 'Solicitud' } },
  { path: 'ajustes',             component: AjustesComponent,     data: { titulo: 'Ajustes' } },
  { path: 'avisos',              component: AvisosComponent,      data: { titulo: 'Avisos' } },
  { path: 'aviso/:id',           component: AvisoComponent,       data: { titulo: 'Aviso' } },
  { path: 'perfil',              component: PerfilComponent,      data: { titulo: 'Mi Perfil' } },
  { path: 'mensajes',            component: MensajesComponent,    data: { titulo: 'Mensajes' } },
  { path: 'chat/:id',            component: MensajeComponent,     data: { titulo: 'Chat' } },
  { path: 'documentos',          component: DocumentosComponent,  data: { titulo: 'Documentos' } },
  { path: 'documento/:id',       component: DocumentoComponent,   data: { titulo: 'Documentos' } },
  { path: 'solicitudes',         component: SolicitudesComponent, data: { titulo: 'Solicitudes' } },
  { path: 'solicitud/:id',       component: SolicitudComponent,   data: { titulo: 'Solicitud' } },
  { path: 'expediente/:id',      component: ExpedienteComponent,  data: { titulo: 'Expediente' } },
  { path: '',                    component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildRoutingModule { }
