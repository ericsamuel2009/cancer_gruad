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
  datos:any = {};
  public datosj48:any = {}
  public typedText: string = '';
  public isClassifier:boolean = false;
  form: FormGroup;
  showModalButtonDisabled = true;
  age: string = '40-49';
  tumorSize: string = '20-24';
  invNodes: string = '18-20';
  sugerencias_IA: string = '';
  public loading: boolean = false;
  public showModal: boolean = false;
  public autohide:boolean = true;
  public description = "";
  public titulo = "";
  public jsonNecesited:any = {};
  ngOnInit() {

  }
  classifierToggle() {
    this.isClassifier = !this.isClassifier;
  }
  limitarLongitudMax() {
    const maxLength = 10;
    if (this.form.value.identificationcard && this.form.value.identificationcard.toString().length > maxLength) {
      const newValue = parseInt(this.form.value.identificationcard.toString().substring(0, maxLength), 10);
      this.form.get('identificationcard')?.setValue(newValue);
    }
  }


  constructor(private formBuilder: FormBuilder,  private apiService: RestService, private renderer: Renderer2) {
    this.form = this.formBuilder.group({
      fullname: ['eric', Validators.required],
      identificationcard: [1122222525, Validators.required],
      saveResult: [false],
      age: [''],
      menopause: ['premeno', Validators.required],
      tumorSize: [''],
      invNodes: [''],
      nodecaps: ['yes', Validators.required],
      degMalig: ['1', Validators.required],
      breast: ['right', Validators.required],
      breastQuad: ['left_low', Validators.required],
      irradiat: ['yes', Validators.required],
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
      "no-recurrence-events": "No presentas eventos Recurrentes",
      "recurrence-events": "Presenta eventos Recurrentes"
    }
    return EVENT_OR_NOT_EVENT[evento] || evento;
  }
  
  close() {
		this.showModal = false;
	}
  async compararJ48() {
    this.jsonNecesited = await this.buildRequest('j48');
    this.onSubmit();
  }
  async compararNB() {
    this.jsonNecesited = await this.buildRequest('NaiveBayes');
    this.onSubmit();
  }
  async compararZR() {
    this.jsonNecesited = await this.buildRequest('ZeroR');
    this.onSubmit();
  }
  async compararRF() {
    this.jsonNecesited = await this.buildRequest('ramdomforest');
    this.onSubmit();
  }
  buildRequest(classifier: String = "ramdomforest") {
    return {
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
		  classifierType: classifier
    };
  }
  onSubmit() {
    
    if (this.form.valid) {
    this.datos = {}
    this.sugerencias_IA = '';
    const newJson:any = (Object.entries(this.jsonNecesited).length > 0 ) ? this.jsonNecesited : this.buildRequest();
    console.log('Peticion:', Object.entries(this.jsonNecesited).length);
    this.showModalButtonDisabled = false;
    this.apiService.postData(newJson).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        this.showModalButtonDisabled = false;
        if (response.status == 'error') {
          this.showModal = true;
          this.titulo = "Error";
          this.description = "Ocurrio un error de servidor";
          //Modal error
          return
        }
          this.datos = response;
        // this.jsonNecesited = {};
      },
      error => {
        console.error('Error en la solicitud:', error);
      }
    );


  }
  else {
    this.markFormGroupTouched(this.form);
    //alert('Por favor, complete todos los campos del formulario.');
      this.showModal = true;
      this.description = "Por favor, complete todos los campos del formulario.";
    this.showModalButtonDisabled = true;
    
  }

  }

  typeWriterEffect(text: string) {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      this.sugerencias_IA = text.slice(0, charIndex);
      charIndex++;
      if (charIndex > text.length) {
        clearInterval(typingInterval);
      }
    }, 10);
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
        this.showModal = true;
        this.description = "No se pudo cargar la sugerencia.";
        //MENSAJE DE ERROR QUE NO RESPONDIO CHATGPT
        return
      }
      this.typeWriterEffect(response.respuesta);
    })
    
  }
  

}
