import { Solicitud } from '../models/solicitud-proyecto.model';


export interface CargarSolicitudes {

    total: number;
    solicitudes: Solicitud[];

}