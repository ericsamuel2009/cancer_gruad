import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule} from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InformationComponent } from './information/information.component';
import { ContactComponent } from './contact/contact.component';
import { FormsModule } from '@angular/forms';

const routes:Routes=[
  {path:'',
   component:HomeComponent},
   {path:'information',
   component:InformationComponent},
   {path:'contact',
   component:ContactComponent},
];
@NgModule({
  declarations: [
         InformationComponent,
         ContactComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MatFormFieldModule, 
    
    FormsModule
  ],
  exports:[
    RouterModule
  ]
})
export class RoutingModule { }
