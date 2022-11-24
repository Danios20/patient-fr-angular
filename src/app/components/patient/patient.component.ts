import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent {

  @Input() patient!: Patient;
  @Output() showPatient = new EventEmitter<number>();

  constructor() { }


  onShowDetail() {
    this.showPatient.emit(this.patient.id);
  }

}
