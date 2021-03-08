import { environment } from '../../environments/environment';
import { Expediente } from './expediente.model';
import { Periodo } from './periodo.model';
import { Carrera } from './carrera.model';

const base_url = environment.base_url;

export class Alumno {

    constructor(
        public numero_control: string,
        public nombre: string,
        public apellido_paterno: string,
        public apellido_materno: string,
        public sexo: string,
        public fecha_nacimiento: Date,
        public edad: number,
        public carrera: Carrera,
        public creditos_acumulados: number,
        public porcentaje_avance: number,
        public periodo_ingreso: Periodo,
        public expediente: Expediente,
        public _id?: string,
        public semestre?: number,
        public foto?: string,
        public firma?: string,
        public email?: string,
        public telefono?: string,
        public domicilio?: string,
        public numero_seguro?: string,
        public password?: string,
    ){}

    get fotoUrl(): string {
        if ( this.foto ) {
            return `${ base_url }/upload/alumnos/${ this.foto }`;
        } else {
            return `${ base_url }/upload/no-image/no-image`;
        }
    }

    get firmaUrl(): string {
        if ( this.firma ) {
            return `${ base_url }/upload/firma/alumnos/${ this.firma }`;
        } else {
            return `${ base_url }/upload/no-image/no-image`;
        }
    }

}
