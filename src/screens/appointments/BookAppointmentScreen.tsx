import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '../../theme/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import ScreenHeader from '../../components/ScreenHeader';
import {
  bookAppointment,
  getAvailableSlots,
  getCliniciansForService,
  getServiceTypes,
} from '../../services/appointmentsService';
import { Clinician, ServiceType, TimeSlot } from '../../types/appointment';

type Step = 'service' | 'clinician' | 'slot' | 'confirm' | 'success';

const STEP_ORDER: Step[] = ['service', 'clinician', 'slot', 'confirm'];
const STEP_LABELS: Record<Step, string> = {
  service: 'Service',
  clinician: 'Clinician',
  slot: 'Date & Time',
  confirm: 'Confirm',
  success: 'Done',
};

function formatDateLabel(dateISO: string): string {
  const d = new Date(`${dateISO}T00:00:00`);
  return d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function BookAppointmentScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>('service');
  const [submitting, setSubmitting] = useState(false);

  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const [clinicians, setClinicians] = useState<Clinician[]>([]);
  const [loadingClinicians, setLoadingClinicians] = useState(false);
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(null);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [notes, setNotes] = useState('');
  const [bookedAppointmentId, setBookedAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    getServiceTypes().then((data) => {
      setServices(data);
      setLoadingServices(false);
    });
  }, []);

  const handleSelectService = async (service: ServiceType) => {
    setSelectedService(service);
    setSelectedClinician(null);
    setSelectedSlot(null);
    setSelectedDate(null);
    setLoadingClinicians(true);
    setStep('clinician');
    const data = await getCliniciansForService(service.id);
    setClinicians(data);
    setLoadingClinicians(false);
  };

  const handleSelectClinician = async (clinician: Clinician) => {
    setSelectedClinician(clinician);
    setSelectedSlot(null);
    setSelectedDate(null);
    setLoadingSlots(true);
    setStep('slot');
    const data = await getAvailableSlots(clinician.id);
    setSlots(data);
    setLoadingSlots(false);
  };

  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(slots.map((s) => s.date))).sort();
    return dates;
  }, [slots]);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const slotsForSelectedDate = useMemo(
    () => slots.filter((s) => s.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [slots, selectedDate]
  );

  const handleConfirmSlot = () => {
    if (selectedSlot) setStep('confirm');
  };

  const handleBook = async () => {
    if (!selectedService || !selectedClinician || !selectedSlot) return;
    setSubmitting(true);
    try {
      const appt = await bookAppointment({
        serviceTypeId: selectedService.id,
        clinicianId: selectedClinician.id,
        slotId: selectedSlot.id,
        notes: notes.trim() || undefined,
      });
      setBookedAppointmentId(appt.id);
      setStep('success');
    } catch (e) {
      // Mock layer rarely rejects, but handle gracefully if it does.
      setStep('slot');
    } finally {
      setSubmitting(false);
    }
  };

  const goBackAStep = () => {
    if (step === 'clinician') setStep('service');
    else if (step === 'slot') setStep('clinician');
    else if (step === 'confirm') setStep('slot');
    else navigation.goBack();
  };

  const currentStepIndex = STEP_ORDER.indexOf(step);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenHeader
        title={step === 'success' ? 'Booked' : 'Book Appointment'}
        onBack={step === 'success' ? undefined : goBackAStep}
      />

      {step !== 'success' && (
        <View style={styles.stepperRow}>
          {STEP_ORDER.map((s, i) => (
            <View key={s} style={styles.stepperItem}>
              <View
                style={[
                  styles.stepDot,
                  i <= currentStepIndex && styles.stepDotActive,
                ]}
              >
                {i < currentStepIndex ? (
                  <Ionicons name="checkmark" size={12} color={colors.white} />
                ) : (
                  <Text style={[styles.stepDotText, i <= currentStepIndex && styles.stepDotTextActive]}>
                    {i + 1}
                  </Text>
                )}
              </View>
              {i < STEP_ORDER.length - 1 && (
                <View style={[styles.stepLine, i < currentStepIndex && styles.stepLineActive]} />
              )}
            </View>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {step === 'service' && (
          <>
            <Text style={styles.stepTitle}>What do you need?</Text>
            <Text style={styles.stepSubtitle}>Choose a service to book an appointment for.</Text>
            {loadingServices ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
            ) : (
              services.map((service) => (
                <Pressable key={service.id} onPress={() => handleSelectService(service)}>
                  <Card style={styles.optionCard}>
                    <View style={styles.optionIconCircle}>
                      <Ionicons name={service.icon as any} size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text style={styles.optionTitle}>{service.name}</Text>
                      <Text style={styles.optionSubtitle}>{service.description}</Text>
                      <Text style={styles.optionMeta}>~{service.durationMinutes} min</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  </Card>
                </Pressable>
              ))
            )}
          </>
        )}

        {step === 'clinician' && (
          <>
            <Text style={styles.stepTitle}>Choose a clinician</Text>
            <Text style={styles.stepSubtitle}>Available for {selectedService?.name}.</Text>
            {loadingClinicians ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
            ) : clinicians.length === 0 ? (
              <Text style={styles.emptyText}>No clinicians available for this service right now.</Text>
            ) : (
              clinicians.map((clinician) => (
                <Pressable key={clinician.id} onPress={() => handleSelectClinician(clinician)}>
                  <Card style={styles.optionCard}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>{clinician.avatarInitials}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text style={styles.optionTitle}>{clinician.name}</Text>
                      <Text style={styles.optionSubtitle}>{clinician.title}</Text>
                      <Text style={styles.optionMeta}>{clinician.site}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  </Card>
                </Pressable>
              ))
            )}
          </>
        )}

        {step === 'slot' && (
          <>
            <Text style={styles.stepTitle}>Pick a date & time</Text>
            <Text style={styles.stepSubtitle}>
              With {selectedClinician?.name} · {selectedService?.name}
            </Text>
            {loadingSlots ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
            ) : availableDates.length === 0 ? (
              <Text style={styles.emptyText}>No availability in the next few days. Please try another clinician.</Text>
            ) : (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
                  {availableDates.map((date) => {
                    const active = date === selectedDate;
                    return (
                      <Pressable
                        key={date}
                        onPress={() => {
                          setSelectedDate(date);
                          setSelectedSlot(null);
                        }}
                        style={[styles.dateChip, active && styles.dateChipActive]}
                      >
                        <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>
                          {formatDateLabel(date)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <View style={styles.slotGrid}>
                  {slotsForSelectedDate.map((slot) => {
                    const active = slot.id === selectedSlot?.id;
                    return (
                      <Pressable
                        key={slot.id}
                        onPress={() => setSelectedSlot(slot)}
                        style={[styles.slotChip, active && styles.slotChipActive]}
                      >
                        <Text style={[styles.slotChipText, active && styles.slotChipTextActive]}>
                          {slot.time}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Button
                  label="Continue"
                  onPress={handleConfirmSlot}
                  disabled={!selectedSlot}
                  style={{ marginTop: spacing.lg }}
                />
              </>
            )}
          </>
        )}

        {step === 'confirm' && selectedService && selectedClinician && selectedSlot && (
          <>
            <Text style={styles.stepTitle}>Confirm booking</Text>
            <Text style={styles.stepSubtitle}>Review your appointment details before confirming.</Text>

            <Card style={{ marginTop: spacing.md }}>
              <SummaryRow icon="medkit-outline" label="Service" value={selectedService.name} />
              <SummaryRow icon="person-outline" label="Clinician" value={selectedClinician.name} />
              <SummaryRow
                icon="calendar-outline"
                label="Date"
                value={formatDateLabel(selectedSlot.date)}
              />
              <SummaryRow icon="time-outline" label="Time" value={selectedSlot.time} />
              <SummaryRow
                icon="location-outline"
                label="Location"
                value={selectedService.modality === 'telemedicine' ? 'Telemedicine (Video)' : selectedClinician.site}
                last
              />
            </Card>

            <View style={{ marginTop: spacing.lg }}>
              <TextField
                label="Notes for the clinician (optional)"
                placeholder="e.g. reason for visit, symptoms"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                style={{ height: 80, textAlignVertical: 'top', paddingTop: spacing.sm }}
              />
            </View>

            <Button
              label="Confirm Appointment"
              onPress={handleBook}
              loading={submitting}
              style={{ marginTop: spacing.md }}
            />
          </>
        )}

        {step === 'success' && (
          <View style={styles.successWrap}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={36} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>Appointment booked</Text>
            <Text style={styles.successSubtitle}>
              {selectedService?.name} with {selectedClinician?.name} on{' '}
              {selectedSlot ? formatDateLabel(selectedSlot.date) : ''} at {selectedSlot?.time}.
            </Text>
            <Button
              label="View Appointment"
              onPress={() =>
                navigation.replace('AppointmentDetail', { appointmentId: bookedAppointmentId })
              }
              style={{ marginTop: spacing.xl }}
            />
            <Button
              label="Back to Appointments"
              variant="ghost"
              onPress={() => navigation.navigate('AppointmentsList')}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, !last && styles.summaryRowBorder]}>
      <Ionicons name={icon} size={16} color={colors.primary} style={{ marginRight: spacing.sm }} />
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  stepperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.platinum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepDotText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  stepDotTextActive: {
    color: colors.white,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.platinum,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  stepTitle: {
    ...typography.h2,
  },
  stepSubtitle: {
    ...typography.bodySecondary,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  optionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  optionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  optionMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  dateChip: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  dateChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dateChipTextActive: {
    color: colors.white,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slotChip: {
    width: '31%',
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginRight: '2%',
    marginBottom: spacing.sm,
  },
  slotChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  slotChipTextActive: {
    color: colors.white,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    width: 80,
  },
  summaryValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  successWrap: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.h2,
  },
  successSubtitle: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
