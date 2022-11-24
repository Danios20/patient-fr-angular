import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip, BehaviorSubject } from 'rxjs';

import { Patient, CreatePatientDTO, UpdatePatientDTO } from './../models/patient.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  private apiUrl = `${environment.API_URL}/patients`;

  // private patientCurrent = new BehaviorSubject<Patient>({
  //   id: 0,
  //   patient: '',
  //   documentType: '',
  //   document: '',
  //   email: '',
  //   address: '',
  //   dentist: '',
  //   bloodType: '',
  //   treatment: '',
  //   price: 0,
  // });
patientChosen!: Patient;

  // patientCurrent$ = this.patientCurrent.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getAllPatients(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit !== undefined && offset !== undefined) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Patient[]>(`${this.apiUrl}/${limit}/${offset}`)
  }

  getPatient(id: number) {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Conflict) {
            return throwError('Algo esta fallando en el server');
          }
          if (error.status === HttpStatusCode.NotFound) {
            return throwError('El producto no existe');
          }
          if (error.status === HttpStatusCode.Unauthorized) {
            return throwError('No estas permitido');
          }
          return throwError('Ups algo salio mal');
        })
      )
  }

  // setPatientChosen(patient: Patient) {
  //   this.patientChosen = patient;
  //   // this.patientCurrent.next(this.patientChosen);
  // }
  // getPatientChosen() {
  //   return this.patientChosen;
  // }

  update(id: number, dto: UpdatePatientDTO) {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, dto);
  }

  // fetchReadAndUpdate(id: number, dto: UpdatePatientDTO) {
  //   return zip(
  //     this.getPatient(id),
  //     this.update(id, dto)
  //   );
  // }

  delete(id: number) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  create(productData: CreatePatientDTO) {
    return this.http.post<Patient>(this.apiUrl, productData);
  }

}
