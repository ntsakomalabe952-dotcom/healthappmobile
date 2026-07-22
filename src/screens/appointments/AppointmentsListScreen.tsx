import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '../../theme/theme';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import { getAppointments } from '../../services/appointmentsService';
import { Appointment } from '../../types/appointment';

type FilterKey = 'upcoming' | 'past';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

function formatDateLabel(dateISO: string): { day: string; month: string } {
  const d = new Date(`${dateISO}T00:00:00`);
  const day = d.toLocaleDateString('en-ZA', { day: '2-digit' });
  const month = d.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase();
  return { day, month };
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

export default function AppointmentsListScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterKey>('upcoming');

  const load = useCallback(async () => {
    const data = await getAppointments();
    setAppointments(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  // Refetch whenever the screen regains focus (e.g. after booking a new one).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const filtered = useMemo(() => {
    if (filter === 'upcoming') {
      return appointments.filter((a) => a.status === 'upcoming');
    }
    return appointments.filter((a) => a.status !== 'upcoming');
  }, [appointments, filter]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('BookAppointment')}
          hitSlop={8}
        >
          <Ionicons name="add" size={22} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>
                {filter === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {filter === 'upcoming'
                  ? 'Book an appointment to get started.'
                  : 'Completed and cancelled appointments will appear here.'}
              </Text>
              {filter === 'upcoming' && (
                <Button
                  label="Book Appointment"
                  onPress={() => navigation.navigate('BookAppointment')}
                  style={{ marginTop: spacing.lg, alignSelf: 'stretch' }}
                />
              )}
            </View>
          }
          renderItem={({ item }) => {
            const { day, month } = formatDateLabel(item.date);
            const badge = statusBadgeProps(item.status);
            return (
              <Pressable
                onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
              >
                <Card style={styles.apptCard}>
                  <View style={styles.apptDateBlock}>
                    <Text style={styles.apptDay}>{day}</Text>
                    <Text style={styles.apptMonth}>{month}</Text>
                  </View>
                  <View style={styles.apptBody}>
                    <View style={styles.apptTitleRow}>
                      <Text style={styles.apptTitle} numberOfLines={1}>
                        {item.serviceName}
                      </Text>
                    </View>
                    <Text style={styles.apptMeta}>{item.clinicianName}</Text>
                    <View style={styles.apptMetaRow}>
                      <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                      <Text style={styles.apptMetaText}>{item.time}</Text>
                      <Ionicons
                        name={item.modality === 'telemedicine' ? 'videocam-outline' : 'location-outline'}
                        size={13}
                        color={colors.textMuted}
                        style={{ marginLeft: spacing.sm }}
                      />
                      <Text style={styles.apptMetaText} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>
                    <View style={{ marginTop: spacing.sm }}>
                      <StatusBadge label={badge.label} status={badge.status} />
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </Card>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  apptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  apptDateBlock: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apptDay: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.goldDark,
  },
  apptMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.goldDark,
    textTransform: 'uppercase',
  },
  apptBody: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  apptTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    flexShrink: 1,
  },
  apptMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  apptMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  apptMetaText: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 3,
    flexShrink: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
