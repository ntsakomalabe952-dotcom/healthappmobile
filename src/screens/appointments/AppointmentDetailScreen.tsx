import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import ScreenHeader from '../../components/ScreenHeader';
import { getAppointmentById, cancelAppointment } from '../../services/appointmentsService';
import { Appointment } from '../../types/appointment';

function formatFullDate(dateISO: string): string {
  const d = new Date(`${dateISO}T00:00:00`);
  return d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function statusBadgeProps(status: Appointment['status']): { label: string; status: 'success' | 'warning' | 'danger' | 'info' } {
  switch (status) {
    case 'upcoming':
      return { label: 'Upcoming', status: 'info' };
    case 'completed':
      return { label: 'Completed', status: 'success' };
    case 'cancelled':
      return { label: 'Cancelled', status: 'danger' };
  }
}

export default function AppointmentDetailScreen({ route, navigation }: any) {
  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState<Appointment | undefined>();
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAppointmentById(appointmentId);
    setAppointment(data);
    setLoading(false);
  }, [appointmentId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleCancel = () => {
    Alert.alert(
      'Cancel appointment?',
      'This will cancel your appointment. You can book a new one at any time.',
      [
        { text: 'Keep appointment', style: 'cancel' },
        {
          text: 'Cancel appointment',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            const updated = await cancelAppointment(appointmentId);
            setAppointment(updated);
            setCancelling(false);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScreenHeader title="Appointment" onBack={() => navigation.goBack()} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScreenHeader title="Appointment" onBack={() => navigation.goBack()} />
        <View style={styles.loadingWrap}>
          <Text style={typography.bodySecondary as any}>Appointment not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const badge = statusBadgeProps(appointment.status);
  const isUpcoming = appointment.status === 'upcoming';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenHeader title="Appointment" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIconCircle}>
              <Ionicons
                name={appointment.modality === 'telemedicine' ? 'videocam' : 'medkit'}
                size={24}
                color={colors.primary}
              />
            </View>
            <StatusBadge label={badge.label} status={badge.status} />
          </View>
          <Text style={styles.serviceName}>{appointment.serviceName}</Text>
          <Text style={styles.clinicianName}>
            {appointment.clinicianName} · {appointment.clinicianTitle}
          </Text>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Card>
            <DetailRow icon="calendar-outline" label="Date" value={formatFullDate(appointment.date)} />
            <DetailRow icon="time-outline" label="Time" value={appointment.time} />
            <DetailRow
              icon="hourglass-outline"
              label="Duration"
              value={`${appointment.durationMinutes} minutes`}
            />
            <DetailRow
              icon={appointment.modality === 'telemedicine' ? 'videocam-outline' : 'location-outline'}
              label={appointment.modality === 'telemedicine' ? 'Modality' : 'Location'}
              value={appointment.location}
              last
            />
          </Card>
        </View>

        {appointment.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Card>
              <Text style={styles.notesText}>{appointment.notes}</Text>
            </Card>
          </View>
        ) : null}

        {isUpcoming && (
          <View style={styles.actionsSection}>
            {appointment.modality === 'telemedicine' && (
              <Button
                label="Join Video Call"
                onPress={() => navigation.navigate('Telemedicine')}
                style={{ marginBottom: spacing.sm }}
              />
            )}
            <Button
              label="Reschedule"
              variant="outline"
              onPress={() =>
                navigation.navigate('BookAppointment', {
                  rescheduleFrom: appointment.id,
                  serviceTypeId: appointment.serviceTypeId,
                })
              }
              style={{ marginBottom: spacing.sm }}
            />
            <Button
              label="Cancel Appointment"
              variant="ghost"
              loading={cancelling}
              onPress={handleCancel}
              style={{ backgroundColor: colors.dangerSoft }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
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
    <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
      <View style={styles.detailIconCircle}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    marginBottom: spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    ...typography.h2,
  },
  clinicianName: {
    ...typography.bodySecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  notesText: {
    ...typography.body,
  },
  actionsSection: {
    marginTop: spacing.sm,
  },
});
