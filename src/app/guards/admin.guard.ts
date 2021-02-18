import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private authService: AuthService,
               private router: Router ){}

  canActivate( route: ActivatedRouteSnapshot,
               state: RouterStateSnapshot): boolean {
    
      if (this.authService.role === 'ADMIN_ROLE') {
        return true;
      } else {
        this.router.navigateByUrl('/dashboard')
        return false;
      }

  }
  
}
