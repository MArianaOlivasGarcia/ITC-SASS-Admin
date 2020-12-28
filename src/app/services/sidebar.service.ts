import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // tslint:disable: variable-name
  private _ocultarSidebar = false;
  private _menu = [];

  constructor() { }

  get ocultarSidebar(): boolean {
    return this._ocultarSidebar;
  }

  get menu(): any[] {
    return this._menu;
  }


  abrirSidebar(): void {
    this._ocultarSidebar = false;
  }

  cerrarSidebar(): void {
    this._ocultarSidebar = true;
  }


  cargarMenu(): void {
    this._menu = JSON.parse( localStorage.getItem('menu') ) || [] ;
  }

}
