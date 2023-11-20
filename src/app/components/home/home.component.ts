import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {RestService} from "../services/rest.service"
import { EventType } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('btnSubmit', { static: true }) submirBtn!: ElementRef;
  datos:any = [];
  form: FormGroup;
  showModalButtonDisabled = true;
  age: string = '40-49';
  tumorSize: string = '20-24';
  invNodes: string = '18-20';
  sugerencias_IA: string = '';
  public loading: boolean = false;
  ngOnInit() {
    //this.obtenerDatos(); 
  }

  limitarLongitudMax() {
    const maxLength = 10;
    if (this.form.value.identificationcard && this.form.value.identificationcard.toString().length > maxLength) {
      const newValue = parseInt(this.form.value.identificationcard.toString().substring(0, maxLength), 10);
      this.form.get('identificationcard')?.setValue(newValue);
    }
  }

  obtenerDatos() {
    this.apiService.getData().subscribe(
      (data) => {
        this.datos =data;
      },
      error => {
        console.error('Error al obtener datos:', error);
      }
    );
  }


  constructor(private formBuilder: FormBuilder,  private apiService: RestService, private renderer: Renderer2) {
    this.form = this.formBuilder.group({
      fullname: ['', Validators.required],
      identificationcard: [null, Validators.required],
      saveResult: [false],
      age: [''],
      menopause: ['', Validators.required],
      tumorSize: [''],
      invNodes: [''],
      nodecaps: ['', Validators.required],
      degMalig: ['', Validators.required],
      breast: ['', Validators.required],
      breastQuad: ['', Validators.required],
      irradiat: ['', Validators.required],
    });
  }

  agregarAtributos() {
    if (this.form.valid) {
      const elementoSelected = this.submirBtn.nativeElement;
      this.renderer.setAttribute(elementoSelected, 'data-bs-toggle', 'modal');
      this.renderer.setAttribute(elementoSelected, 'data-bs-target', '#exampleModal');
    }
  }

  quitarAtributos() {
    const elementoSelected = this.submirBtn.nativeElement;
    this.renderer.removeAttribute(elementoSelected, 'data-bs-toggle');
    this.renderer.removeAttribute(elementoSelected, 'data-bs-target');
  }

  resultConvert(evento: EventType): String {
    const EVENT_OR_NOT_EVENT:any = {
      "no-recurrence-events": "No tiene cancer de mama",
      "recurrence-events": "Presenta Cancer de mama"
    }
    return EVENT_OR_NOT_EVENT[evento] || evento;
  }
  
  onSubmit() {
    
    if (this.form.valid) {
    this.sugerencias_IA = '';
    const newJson = {
      fullname: this.form.value.fullname,
      identificationcard: this.form.value.identificationcard,
      saveResult: this.form.value.saveResult,
      age: this.age, 
      menopause: this.form.value.menopause,
      tumorSize: this.tumorSize, 
      invNodes: this.invNodes, 
      nodecaps:  this.form.value.nodecaps,
      degMalig:  this.form.value.degMalig,
      breast:  this.form.value.breast,
      breastQuad:  this.form.value.breastQuad,
      irradiat: this.form.value.irradiat,
    };
    this.showModalButtonDisabled = false;
    this.apiService.postData(newJson).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        this.showModalButtonDisabled = false;
        if (response.status == 'error') {
          //Modal error
          return
        }
        this.datos = response;
      },
      error => {
        console.error('Error en la solicitud:', error);
      }
    );


  }
  else {
    this.markFormGroupTouched(this.form);
    alert('Por favor, complete todos los campos del formulario.');
    this.showModalButtonDisabled = true;
    
  }

  }

  actualizarRangoEdad(event: any): void {
    const valor: number = event.target.valueAsNumber;
    const edadInicial = Math.floor(valor / 10) * 10;
    const edadFinal = edadInicial + 9;
    this.age = `${edadInicial}-${edadFinal}`;
  }

  actualizarTamanoTumor(event: any): void {
    const valor: number = event.target.valueAsNumber;
    const tamanoInicial = Math.floor(valor/5) *5;
    const tamanoFinal = tamanoInicial  + 4;
    this.tumorSize = `${tamanoInicial}-${tamanoFinal}`;
    
  }

  actualizarGangliosInvasivos(event: any): void {
    const valor: number = event.target.valueAsNumber;
    const gangliosInicial = Math.floor(valor/3) *3;
    const gangliosFinal = gangliosInicial + 2;
    this.invNodes = `${gangliosInicial}-${gangliosFinal}`;
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  
  async sugerenciasIA() {
    interface ParamsI {
      message: string;
    }
    const params: ParamsI = {
      message: this.datos.Resultado
    } ;
    this.loading = true;
    this.apiService.chatgptService(params).subscribe( (response: any) => {
      this.loading = false;
      if (response.status != "OK") {
        //MENSAJE DE ERROR QUE NO RESPONDIO CHATGPT
        return
      }
      this.sugerencias_IA = response.respuesta;
    })
    
  }
  

}
