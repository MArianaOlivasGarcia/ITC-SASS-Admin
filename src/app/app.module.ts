import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';

import { registerLocaleData } from '@angular/common';

import localEsMx from '@angular/common/locales/es-MX';

registerLocaleData( localEsMx, 'es-mx');


@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-mx' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
