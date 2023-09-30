import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PostLayoutPageComponent} from './pages/post-layout-page/post-layout-page.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ReactiveFormsModule} from '@angular/forms';
import {PostLayoutService} from './services/post-layout-service';
import {HttpClientModule} from '@angular/common/http';
import { LayoutViewComponent } from './components/layout-view-component/layout-view.component';

@NgModule({
  declarations: [
    AppComponent,
    PostLayoutPageComponent,
    LayoutViewComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  providers: [PostLayoutService, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
