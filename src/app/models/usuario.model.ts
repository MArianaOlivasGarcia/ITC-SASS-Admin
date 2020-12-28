import { environment } from '../../environments/environment';
import { Carrera } from './carrera.model';

const base_url = environment.base_url;

export class Usuario {

    constructor(
        public nombre: string,
        public username?: string,
        public foto?: string,
        public role?: string,
        // tslint:disable-next-line: variable-name
        public _id?: string,
        public gestion?: Carrera,
        public password?: string,
        public online?: boolean,
    ){}

    get fotoUrl(): string {
        if ( this.foto ) {
            return `${ base_url }/upload/usuarios/${ this.foto }`;
        } else {
            return `${ base_url }/upload/no-image/no-image`;
        }
    }

}
