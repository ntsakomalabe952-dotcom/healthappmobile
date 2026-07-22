// Domain types for Appointments & Scheduling.
// Kept separate from mock data / services so the UI never depends on
// how the data is sourced (mock now, real API later).

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export type AppointmentModality = 'in-person' | 'telemedicine';

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: string; // Ionicons name
  durationMinutes: number;
  modality: AppointmentModality | 'both';
}

export interface Clinician {
  id: string;
  name: string;
  title: string;
  specialty: string;
  site: string;
  avatarInitials: string;
}

export interface TimeSlot {
  id: string;
  date: string; // ISO date, e.g. '2026-07-24'
  time: string; // '09:30'
}

export interface Appointment {
  id: string;
  serviceTypeId: string;
  serviceName: string;
  clinicianId: string;
  clinicianName: string;
  clinicianTitle: string;
  date: string; // ISO date
  time: string; // '09:30'
  durationMinutes: number;
  location: string;
  modality: AppointmentModality;
  status: AppointmentStatus;
  notes?: string;
}

export interface BookAppointmentInput {
  serviceTypeId: string;
  clinicianId: string;
  slotId: string;
  notes?: string;
}
