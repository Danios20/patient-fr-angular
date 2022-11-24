import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Patient } from 'src/app/models/patient.model';
import { PatientsService } from 'src/app/services/patients.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.scss']
})
export class FormRegisterComponent implements OnInit {
  @Output() addedPatient = new EventEmitter<FormGroup>();
  public frmFormulario: FormGroup;
  activeSideMenu: boolean = false;

  patientChosen!: Patient;

  constructor(
    private patientsService: PatientsService
  ) {
    this.frmFormulario = new FormGroup({
      patient: new FormControl(null, [Validators.required]),
      documentType: new FormControl(null, [Validators.required]),
      document: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      address: new FormControl(null, [Validators.required]),
      dentist: new FormControl(null, [Validators.required]),
      bloodType: new FormControl(null, [Validators.required]),
      treatment: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    // this.patientsService.patientCurrent$.subscribe(patient => {
    //   this.patientChosen = patient;
    // })
  }

  // Móstrar/ocultar side menu (mobile)
  toggleSideMenu() {
    this.activeSideMenu = !this.activeSideMenu;
  }

  sendData(): void {
    console.log(this.frmFormulario.getRawValue());
    this.addedPatient.emit(this.frmFormulario);
  }

}
