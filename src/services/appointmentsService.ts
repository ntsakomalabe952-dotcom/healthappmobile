// Appointments service layer.
//
// Every function here returns a Promise and is shaped the way a real API
// client would be (async, can reject, takes/returns plain data). Screens
// only ever call these functions — never the mock data directly — so
// swapping this file's internals for real `fetch`/axios calls against the
// backend later won't require touching any screen code.
//
// TODO(backend): replace internals with real HTTP calls once the API is
// available, keeping the same function signatures.

import {
  Appointment,
  BookAppointmentInput,
  Clinician,
  ServiceType,
  TimeSlot,
} from '../types/appointment';
import {
  clinicianServiceMap,
  clinicians,
  initialAppointments,
  serviceTypes,
  slotsByClinician,
} from '../data/mockAppointments';

const MOCK_DELAY_MS = 350;

// In-memory store standing in for a backend, so booking/cancelling feels real
// within a single app session. Resets on reload — expected for a mock.
let appointmentsStore: Appointment[] = [...initialAppointments];

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAppointments(): Promise<Appointment[]> {
  const sorted = [...appointmentsStore].sort((a, b) =>
    `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
  );
  return delay(sorted);
}

export async function getAppointmentById(id: string): Promise<Appointment | undefined> {
  return delay(appointmentsStore.find((a) => a.id === id));
}

export async function getServiceTypes(): Promise<ServiceType[]> {
  return delay([...serviceTypes]);
}

export async function getCliniciansForService(serviceTypeId: string): Promise<Clinician[]> {
  const ids = clinicianServiceMap[serviceTypeId] ?? [];
  return delay(clinicians.filter((c) => ids.includes(c.id)));
}

export async function getAvailableSlots(clinicianId: string): Promise<TimeSlot[]> {
  const slots = slotsByClinician[clinicianId] ?? [];
  return delay([...slots]);
}

export async function bookAppointment(input: BookAppointmentInput): Promise<Appointment> {
  const service = serviceTypes.find((s) => s.id === input.serviceTypeId);
  const clinician = clinicians.find((c) => c.id === input.clinicianId);
  const slot = (slotsByClinician[input.clinicianId] ?? []).find((s) => s.id === input.slotId);

  if (!service || !clinician || !slot) {
    return Promise.reject(new Error('Unable to book appointment — missing service, clinician, or slot.'));
  }

  const newAppointment: Appointment = {
    id: `appt-${Date.now()}`,
    serviceTypeId: service.id,
    serviceName: service.name,
    clinicianId: clinician.id,
    clinicianName: clinician.name,
    clinicianTitle: clinician.title,
    date: slot.date,
    time: slot.time,
    durationMinutes: service.durationMinutes,
    location: service.modality === 'telemedicine' ? 'Telemedicine (Video)' : clinician.site,
    modality: service.modality === 'telemedicine' ? 'telemedicine' : 'in-person',
    status: 'upcoming',
    notes: input.notes,
  };

  appointmentsStore = [...appointmentsStore, newAppointment];

  // Remove the booked slot so it can't be double-booked within this session.
  slotsByClinician[input.clinicianId] = (slotsByClinician[input.clinicianId] ?? []).filter(
    (s) => s.id !== input.slotId
  );

  return delay(newAppointment, 600);
}

export async function cancelAppointment(id: string): Promise<Appointment | undefined> {
  appointmentsStore = appointmentsStore.map((a) =>
    a.id === id ? { ...a, status: 'cancelled' as const } : a
  );
  return delay(appointmentsStore.find((a) => a.id === id), 400);
}
