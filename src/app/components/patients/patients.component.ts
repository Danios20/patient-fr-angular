import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CreatePatientDTO, Patient, UpdatePatientDTO } from 'src/app/models/patient.model';
import { PatientsService } from '../../services/patients.service';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent {


  patients: Patient[] = [];
  showPatientDetail = false;
  patientChosen!: Patient;
  limit: number = 0;
  offset: number = 10;

  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private patientsService: PatientsService,
  ) { }


  ngOnInit(): void {
    this.patientsService.getAllPatients(0, 10)
      .subscribe(data => {
        this.patients = data;
        // this.offset += this.limit;
      });
  }


  togglePatientDetail() {
    this.showPatientDetail = !this.showPatientDetail;
  }

  onShowDetail(id: number) {
    this.statusDetail = 'loading';
    this.togglePatientDetail();
    this.patientsService.getPatient(id)
      .subscribe(data => {
        this.patientChosen = data;
        // this.patientsService.setPatientChosen(data);
        this.statusDetail = 'success';
      }, errorMsg => {
        window.alert(errorMsg);
        this.statusDetail = 'error';
      })
  }

  // readAndUpdate(id: string) {
  //   // this.productsService.getProduct(id)
  //   // .pipe(
  //   //   switchMap((product) => this.productsService.update(product.id, {title: 'change'})),
  //   // )
  //   // .subscribe(data => {
  //   //   console.log(data);
  //   // });
  //   // this.productsService.fetchReadAndUpdate(id, {title: 'change'})
  //   // .subscribe(response => {
  //   //   const read = response[0];
  //   //   const update = response[1];
  //   // })
  // }

  createNewPatient(frmFormulario: FormGroup) {
    console.log('Log padre :>> ', frmFormulario);
    const patient: CreatePatientDTO = {
      patient: frmFormulario.value.patient,
      documentType: frmFormulario.value.documentType,
      document: frmFormulario.value.document,
      email: frmFormulario.value.email,
      address: frmFormulario.value.address,
      dentist: frmFormulario.value.dentist,
      bloodType: frmFormulario.value.bloodType,
      treatment: frmFormulario.value.treatment,
      price: frmFormulario.value.price,

    }
    this.patientsService.create(patient)
      .subscribe({
        next: (data) => {
            console.log('data :>> ', data);
            this.patients.unshift(data);
        },
        error: (error: HttpErrorResponse) => {
          try {
            if (error.error.document[0]) {
              console.log('error :>> ', error.error.document);
              Swal.fire({
                icon: 'error',
                title: 'Status',
                html:`
                <p> ${ error.error.document[0] } </p>
                `
              });
            }
          } catch (e) {
            if( error.error.email[0]) {
              console.log('error :>> ', error.error.email[0]);
              Swal.fire({
                icon: 'error',
                title: 'Status',
                html:`
                <p> ${ error.error.email[0] } </p>
                `
              });
            }
          }



        },
        complete: () => {
          Swal.fire({
            icon: 'success',
            title: 'Status',
            html:`
            <p> El paciente se ha resigrado.   </p>
            `
          });
         },
      });
  }

  updatePatient() {
    const changes: UpdatePatientDTO = {
      patient: 'change title',
      documentType: this.patientChosen.documentType,
      document: this.patientChosen.document,
      email: this.patientChosen.email,
      address: this.patientChosen.address,
      dentist: this.patientChosen.dentist,
      bloodType: this.patientChosen.bloodType,
      treatment: this.patientChosen.treatment,
      price: this.patientChosen.price
    }
    const id = this.patientChosen.id;
    this.patientsService.update(id, changes)
    .subscribe((data: any) => {
      console.log('data :>> ', data);
      Swal.fire({
        icon: 'info',
        title: 'Status',
        html:`
        <p> ${ JSON.stringify(data.mensaje) } </p>
        `})
      const productIndex = this.patients.findIndex(item => item.id === this.patientChosen.id);
      this.patients[productIndex] = data;
      this.patientChosen = data;
    });
  }

  deletePatient() {
    const id = this.patientChosen.id;
    this.patientsService.delete(id)
      .subscribe((data: any) => {
        console.log('data :>> ', data.mensaje);
        Swal.fire({
          icon: 'warning',
          title: 'Status',
          html:`
          <p> ${ JSON.stringify(data.mensaje) } </p>
          `
        })
        const productIndex = this.patients.findIndex(item => item.id === this.patientChosen.id);
        this.patients.splice(productIndex, 1);
        this.showPatientDetail = false;
      });
  }

  loadMore() {
    this.offset += 10;
    this.limit += 10;
    this.patientsService.getAllPatients(this.limit, this.offset)
      .subscribe(data => {
        this.patients = this.patients.concat(data);
        // this.offset += this.limit;
      });
  }

}
