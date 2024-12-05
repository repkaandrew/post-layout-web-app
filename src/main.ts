import {importProvidersFrom} from '@angular/core';
import {AppComponent} from './app/app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {provideAnimations} from '@angular/platform-browser/animations';
import {APP_ROUTES} from './app/routes';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {PostLayoutService} from './app/services/post-layout-service';
import {PreloadAllModules, provideRouter, withDebugTracing, withPreloading} from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, MatToolbarModule, ReactiveFormsModule),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules), withDebugTracing()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    PostLayoutService,
  ]
})
  .catch(err => console.error(err));
