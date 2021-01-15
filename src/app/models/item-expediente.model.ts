import { Alumno } from "./alumno.model";
import { Expediente } from "./expediente.model";


export class ItemExpediente {

    constructor(
    public numero: number,
    public expediente: Expediente,
    public titulo: string,
    public template: string,
    public archivo: string,
    public codigo: string,
    public aprobado: boolean,
    public rechazado: boolean,
    public revision: boolean,
    public disponible: boolean,
    public entrante: boolean,
    public iniciado?: boolean,
    public fecha_limite?: Date,
    public fecha_entrega?: Date,
    public fecha_aprobacion?: Date,
    public errores?: { 
        observacion: string,
        motivo: string,
    },
    public alumno?: Alumno,
    public _id?: string ){}

    get archivoSrc(): string {
        if( this.archivo ){
            console.log('archivo')
            return `https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf`;
        }
    }

}