import { Appointment, Clinician, ServiceType, TimeSlot } from '../types/appointment';

export const serviceTypes: ServiceType[] = [
  {
    id: 'svc-surveillance',
    name: 'Medical Surveillance',
    description: 'Annual or periodic occupational health screening',
    icon: 'shield-checkmark-outline',
    durationMinutes: 45,
    modality: 'in-person',
  },
  {
    id: 'svc-general',
    name: 'General Consultation',
    description: 'Speak to a clinician about a health concern',
    icon: 'medkit-outline',
    durationMinutes: 20,
    modality: 'both',
  },
  {
    id: 'svc-followup',
    name: 'Follow-up Consultation',
    description: 'Review results or continue a treatment plan',
    icon: 'refresh-outline',
    durationMinutes: 15,
    modality: 'both',
  },
  {
    id: 'svc-fitness',
    name: 'Fitness for Duty Assessment',
    description: 'Return-to-work or role-specific fitness check',
    icon: 'body-outline',
    durationMinutes: 30,
    modality: 'in-person',
  },
  {
    id: 'svc-vaccination',
    name: 'Vaccination / Immunization',
    description: 'Scheduled or catch-up immunizations',
    icon: 'bandage-outline',
    durationMinutes: 10,
    modality: 'in-person',
  },
];

export const clinicians: Clinician[] = [
  {
    id: 'clin-mahlangu',
    name: 'Dr. N. Mahlangu',
    title: 'Occupational Health Physician',
    specialty: 'Medical Surveillance',
    site: 'Kloof Occupational Health Clinic',
    avatarInitials: 'NM',
  },
  {
    id: 'clin-vanwyk',
    name: 'Sr. P. van Wyk',
    title: 'Occupational Health Nurse',
    specialty: 'General & Follow-up Care',
    site: 'Kloof Occupational Health Clinic',
    avatarInitials: 'PV',
  },
  {
    id: 'clin-dube',
    name: 'Dr. T. Dube',
    title: 'General Practitioner',
    specialty: 'Telemedicine Consultations',
    site: 'Remote / Telemedicine',
    avatarInitials: 'TD',
  },
  {
    id: 'clin-khumalo',
    name: 'Sr. L. Khumalo',
    title: 'Registered Nurse',
    specialty: 'Vaccinations & Fitness Checks',
    site: 'Driefontein Clinic',
    avatarInitials: 'LK',
  },
];

// Which clinicians can perform which service types.
export const clinicianServiceMap: Record<string, string[]> = {
  'svc-surveillance': ['clin-mahlangu'],
  'svc-general': ['clin-vanwyk', 'clin-dube'],
  'svc-followup': ['clin-vanwyk', 'clin-dube'],
  'svc-fitness': ['clin-mahlangu', 'clin-khumalo'],
  'svc-vaccination': ['clin-khumalo'],
};

// Simple slot generator so we don't hand-maintain hundreds of rows.
// Business hours 08:00-16:00, 7 days out, every 30 min, weekdays only,
// with a handful pseudo-randomly removed to look like a real calendar.
function generateSlots(clinicianId: string, daysOut = 10): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const start = new Date('2026-07-22T00:00:00');
  const hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];

  let seed = clinicianId.length * 7;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let d = 1; d <= daysOut; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends

    const iso = date.toISOString().split('T')[0];
    hours.forEach((time) => {
      if (pseudoRandom() > 0.35) {
        slots.push({ id: `${clinicianId}-${iso}-${time}`, date: iso, time });
      }
    });
  }
  return slots;
}

export const slotsByClinician: Record<string, TimeSlot[]> = clinicians.reduce(
  (acc, c) => {
    acc[c.id] = generateSlots(c.id);
    return acc;
  },
  {} as Record<string, TimeSlot[]>
);

// Seed data for "my appointments" — mutable at runtime via the service layer
// to simulate booking/cancelling without a backend.
export const initialAppointments: Appointment[] = [
  {
    id: 'appt-1001',
    serviceTypeId: 'svc-surveillance',
    serviceName: 'Annual Medical Surveillance',
    clinicianId: 'clin-mahlangu',
    clinicianName: 'Dr. N. Mahlangu',
    clinicianTitle: 'Occupational Health Physician',
    date: '2026-07-24',
    time: '09:30',
    durationMinutes: 45,
    location: 'Kloof Occupational Health Clinic',
    modality: 'in-person',
    status: 'upcoming',
  },
  {
    id: 'appt-1002',
    serviceTypeId: 'svc-followup',
    serviceName: 'Follow-up Consultation',
    clinicianId: 'clin-vanwyk',
    clinicianName: 'Sr. P. van Wyk',
    clinicianTitle: 'Occupational Health Nurse',
    date: '2026-07-28',
    time: '14:00',
    durationMinutes: 15,
    location: 'Telemedicine (Video)',
    modality: 'telemedicine',
    status: 'upcoming',
  },
  {
    id: 'appt-0987',
    serviceTypeId: 'svc-vaccination',
    serviceName: 'Vaccination / Immunization',
    clinicianId: 'clin-khumalo',
    clinicianName: 'Sr. L. Khumalo',
    clinicianTitle: 'Registered Nurse',
    date: '2026-06-10',
    time: '10:00',
    durationMinutes: 10,
    location: 'Driefontein Clinic',
    modality: 'in-person',
    status: 'completed',
  },
  {
    id: 'appt-0954',
    serviceTypeId: 'svc-general',
    serviceName: 'General Consultation',
    clinicianId: 'clin-dube',
    clinicianName: 'Dr. T. Dube',
    clinicianTitle: 'General Practitioner',
    date: '2026-05-30',
    time: '11:00',
    durationMinutes: 20,
    location: 'Telemedicine (Video)',
    modality: 'telemedicine',
    status: 'cancelled',
  },
];
