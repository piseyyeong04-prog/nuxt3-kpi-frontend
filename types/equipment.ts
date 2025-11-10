export interface Equipment {
  id: number;
  name: string;
}

export interface ShootingTime {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  title: string;
}

export interface UserCreated {
  id: string;
  first_name: string;
  last_name: string;
  title?: string;
  department?: Department;
}
export interface UserCreator {
  id: string;
  first_name: string;
  last_name: string;
  title?: string;
  department?: Department;
}
export interface UserCameraman {
  id: string;
  first_name: string;
  last_name: string;
  title?: string;
  department?: Department;
}
export interface EquipmentRequest {
  id?: number;
  shooting_date: string;
  return_date: string;
  user_created: UserCreated;
  shooting_time: ShootingTime;
  program_name: string;
  content_creator: UserCreator;
  camera_man: UserCameraman;
  microphone: Equipment[];
  camera: Equipment[];
  tripod: Equipment[];
  gimbal: Equipment[];
  camera_lens: Equipment[];
  light: Equipment[];
  drone: Equipment[];
  status?: string;
  date_created?: string;
}