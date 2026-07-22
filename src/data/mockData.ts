export const currentUser = {
  name: 'Thabo Nkosi',
  employeeNumber: 'SS-004521',
  role: 'Underground Operator',
  site: 'Kloof Operations',
  fitnessStatus: 'Fit for Duty' as const,
};

export const quickActions = [
  { id: '1', label: 'Book Appointment', icon: 'calendar-outline' },
  { id: '2', label: 'Telemedicine', icon: 'videocam-outline' },
  { id: '3', label: 'Report Incident', icon: 'alert-circle-outline' },
  { id: '4', label: 'Messages', icon: 'chatbubble-ellipses-outline' },
] as const;

export const notifications = [
  {
    id: 'n1',
    title: 'Medical surveillance due',
    body: 'Your annual medical surveillance is due in 3 days.',
    time: '2h ago',
    type: 'warning' as const,
  },
  {
    id: 'n2',
    title: 'Appointment confirmed',
    body: 'Your telemedicine consultation was confirmed for 28 Jul.',
    time: '1d ago',
    type: 'success' as const,
  },
  {
    id: 'n3',
    title: 'New message from clinician',
    body: 'Sr. van Wyk sent you a message regarding your results.',
    time: '2d ago',
    type: 'info' as const,
  },
];
