import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private _submenu = [];

  constructor() { }

  get submenu(): any[] {
    return this._submenu
  }


  cargarSubMenu(): void {
    this._submenu = JSON.parse( localStorage.getItem('submenu') ) || [] ;
  }

}
