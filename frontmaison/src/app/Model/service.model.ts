export enum ServiceType {
  ACTIVITY = 'activity',
  WELLNESS = 'wellness',
  CULINARY = 'culinary',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
}

export enum Location {
  SEA = 'sea',
  MOUNTAIN = 'mountain',
  LOCAL = 'local'
}

export interface Service {
  _id?: string;
  name: string;
  description: string;
  type: ServiceType;
  price: number;
  images?: string[];
  duration: string;
  minParticipants: number;
  minAge: number;
  startTime:string;
  endTime:string;
  location: Location;
  isActive: boolean;
}

export interface createService {
_id?: string;
name: string;
description: string;
type: ServiceType;
price: number;
images?: string[];
duration: string;
minParticipants: number;
minAge:number;
startTime:string;
endTime:string;
location:Location;
isActive?: boolean;

}