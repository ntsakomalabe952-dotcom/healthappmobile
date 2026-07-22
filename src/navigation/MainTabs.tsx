import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import AppointmentsStack from './AppointmentsStack';

const Tab = createBottomTabNavigator();

const TelemedicineScreen = () => (
  <PlaceholderScreen
    title="Telemedicine"
    subtitle="Video consultations with clinicians, coming soon."
    icon="videocam-outline"
  />
);

const MessagesScreen = () => (
  <PlaceholderScreen
    title="Messages"
    subtitle="Secure messaging with your care team."
    icon="chatbubble-ellipses-outline"
  />
);

const ProfileScreen = () => (
  <PlaceholderScreen
    title="Profile"
    subtitle="Your health profile, synced from EMR & HRIS."
    icon="person-circle-outline"
  />
);

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Appointments: focused ? 'calendar' : 'calendar-outline',
            Telemedicine: focused ? 'videocam' : 'videocam-outline',
            Messages: focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline',
            Profile: focused ? 'person-circle' : 'person-circle-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsStack} />
      <Tab.Screen name="Telemedicine" component={TelemedicineScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
