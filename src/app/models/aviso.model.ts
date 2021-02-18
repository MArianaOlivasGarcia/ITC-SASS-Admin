


export class Aviso {

    constructor(
        public titulo: string,
        public descripcion: string,
        public foto: string,
        public disponible: boolean,
        public fecha_publicacion: Date,
        public enlace?: string,
        public _id?: string
    ){}


}