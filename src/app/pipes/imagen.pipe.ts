import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(imagen: string, tipo: 'usuarios'|'alumnos'|'avisos'): string {
    
    
    if ( !imagen ) {
      return `${ base_url }/upload/no-image/no-image`;
    } else {
      return `${ base_url }/upload/${tipo}/${imagen}`;
    }

  }

}
