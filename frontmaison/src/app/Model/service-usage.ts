export interface CreateServiceUsageDto {
  user: string; // MongoDB ObjectId of the guest (user)
  responsable: string; // MongoDB ObjectId of the responsable
  service: string; // MongoDB ObjectId of the service
  duration: number; // Duration in minutes (30, 60, 90, 120)
  price: number; // Calculated price
  notes?: string; // Optional notes
  usageTime?: Date; // Optional, set by backend
}