import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppointmentsListScreen from '../screens/appointments/AppointmentsListScreen';
import AppointmentDetailScreen from '../screens/appointments/AppointmentDetailScreen';
import BookAppointmentScreen from '../screens/appointments/BookAppointmentScreen';

export type AppointmentsStackParamList = {
  AppointmentsList: undefined;
  AppointmentDetail: { appointmentId: string };
  BookAppointment: { rescheduleFrom?: string; serviceTypeId?: string } | undefined;
};

const Stack = createNativeStackNavigator<AppointmentsStackParamList>();

export default function AppointmentsStack() {
  return (
    <Stack.Navigator initialRouteName="AppointmentsList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppointmentsList" component={AppointmentsListScreen} />
      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
