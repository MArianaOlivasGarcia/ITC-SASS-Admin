import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';

const routes: Routes = [
    { path: 'dashboard',
    component: PagesComponent,
    data: { titulo: 'Dashboard' },
    canActivate: [ AuthGuard ],
    loadChildren: () => import('./child-routing.module').then( m => m.ChildRoutingModule  )
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
