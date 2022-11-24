export interface Patient {
  id: number;
  patient: string;
  documentType: string;
  document: string;
  email: string;
  address: string;
  dentist: string;
  bloodType: string;
  treatment: string;
  price: number;
  state?: number;
}


export interface CreatePatientDTO extends Omit<Patient, 'id' | 'state'> {
}

export interface UpdatePatientDTO extends Partial<CreatePatientDTO> { }

