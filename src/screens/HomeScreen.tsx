import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography, radii } from '../theme/theme';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { currentUser, quickActions, notifications } from '../data/mockData';
import { getAppointments } from '../services/appointmentsService';
import { Appointment } from '../types/appointment';

function handleQuickAction(actionId: string, navigation: any) {
  switch (actionId) {
    case '1': // Book Appointment
      navigation.navigate('Appointments', { screen: 'BookAppointment' });
      break;
    case '2': // Telemedicine
      navigation.navigate('Telemedicine');
      break;
    case '4': // Messages
      navigation.navigate('Messages');
      break;
    default:
      break;
  }
}

export default function HomeScreen({ navigation }: any) {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAppointments().then((all) =>
        setUpcomingAppointments(all.filter((a) => a.status === 'upcoming').slice(0, 2))
      );
    }, [])
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>{currentUser.name}</Text>
            </View>
            <Pressable style={styles.bellButton}>
              <Ionicons name="notifications-outline" size={22} color={colors.white} />
              <View style={styles.bellDot} />
            </Pressable>
          </View>

          <View style={styles.idRow}>
            <Text style={styles.idText}>{currentUser.employeeNumber}</Text>
            <View style={styles.idDivider} />
            <Text style={styles.idText}>{currentUser.site}</Text>
          </View>

          <View style={styles.fitnessCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fitnessLabel}>Fitness for Duty</Text>
              <StatusBadge label={currentUser.fitnessStatus} status="success" />
            </View>
            <Ionicons name="shield-checkmark" size={30} color={colors.gold} />
          </View>
        </LinearGradient>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                style={styles.actionItem}
                onPress={() => handleQuickAction(action.id, navigation)}
              >
                <View style={styles.actionIconCircle}>
                  <Ionicons name={action.icon as any} size={22} color={colors.primary} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Upcoming appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <Pressable onPress={() => navigation.navigate('Appointments', { screen: 'AppointmentsList' })}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          {upcomingAppointments.length === 0 ? (
            <Card style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
              <Text style={styles.apptMeta}>No upcoming appointments</Text>
            </Card>
          ) : (
            upcomingAppointments.map((appt) => {
              const d = new Date(`${appt.date}T00:00:00`);
              const day = d.toLocaleDateString('en-ZA', { day: '2-digit' });
              const month = d.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase();
              return (
                <Pressable
                  key={appt.id}
                  onPress={() =>
                    navigation.navigate('Appointments', {
                      screen: 'AppointmentDetail',
                      params: { appointmentId: appt.id },
                    })
                  }
                >
                  <Card style={styles.apptCard}>
                    <View style={styles.apptDateBlock}>
                      <Text style={styles.apptDay}>{day}</Text>
                      <Text style={styles.apptMonth}>{month}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text style={styles.apptTitle}>{appt.serviceName}</Text>
                      <Text style={styles.apptMeta}>{appt.clinicianName}</Text>
                      <View style={styles.apptTimeRow}>
                        <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                        <Text style={styles.apptTimeText}>{appt.time}</Text>
                        <Ionicons
                          name={appt.modality === 'telemedicine' ? 'videocam-outline' : 'location-outline'}
                          size={13}
                          color={colors.textMuted}
                          style={{ marginLeft: spacing.sm }}
                        />
                        <Text style={styles.apptTimeText}>{appt.location}</Text>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              );
            })
          )}
        </View>

        {/* Notifications preview */}
        <View style={[styles.section, { marginBottom: spacing.xl }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
          </View>
          {notifications.slice(0, 3).map((n) => (
            <Card key={n.id} style={styles.notifCard} padded={false}>
              <View style={styles.notifRow}>
                <View
                  style={[
                    styles.notifDot,
                    {
                      backgroundColor:
                        n.type === 'warning'
                          ? colors.warning
                          : n.type === 'success'
                          ? colors.success
                          : colors.info,
                    },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>{n.title}</Text>
                  <Text style={styles.notifBody}>{n.body}</Text>
                  <Text style={styles.notifTime}>{n.time}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  userName: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  idText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
  },
  idDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: spacing.sm,
  },
  fitnessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  fitnessLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAll: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  actionItem: {
    alignItems: 'center',
    width: '23%',
  },
  actionIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  apptCard: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    alignItems: 'center',
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
  apptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  apptMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  apptTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  apptTimeText: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 3,
  },
  notifCard: {
    marginBottom: spacing.sm,
  },
  notifRow: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notifBody: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notifTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
});
