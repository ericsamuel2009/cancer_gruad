import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { RoutingModule } from './components/routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgbModule, NgbTooltipModule, NgbPopoverModule, NgbToastModule  } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    MatToolbarModule, FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    HttpClientModule,
    NgbModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbToastModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
