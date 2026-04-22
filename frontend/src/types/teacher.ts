export interface TeacherApplication {
  user: {
    _id: string;
  };
  resume: File | string;
  idFront: File | string;
  idBack: File | string;
}
