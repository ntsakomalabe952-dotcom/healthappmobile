import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '../theme/theme';
import TextField from '../components/TextField';
import Button from '../components/Button';

export default function LoginScreen({ navigation }: any) {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Placeholder — wire up to auth API later
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary, colors.primaryLight]}
        style={styles.headerArea}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Ionicons name="medkit" size={32} color={colors.gold} />
            </View>
            <Text style={styles.brand}>Sibanye-Stillwater</Text>
            <Text style={styles.brandSub}>Health & Wellness</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.sheet}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.sheetContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to access your health profile</Text>

          <TextField
            label="Employee Number"
            placeholder="e.g. SS-004521"
            icon="person-outline"
            autoCapitalize="none"
            value={employeeNumber}
            onChangeText={setEmployeeNumber}
          />
          <TextField
            label="Password"
            placeholder="Enter your password"
            icon="lock-closed-outline"
            isPassword
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <Button label="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: spacing.sm }} />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <Button
            label="Sign in with Company SSO"
            onPress={() => {}}
            variant="outline"
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New employee? </Text>
            <Pressable>
              <Text style={styles.footerLink}>Contact HR to register</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerArea: {
    paddingBottom: spacing.xl,
  },
  logoWrap: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brand: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  brandSub: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    marginTop: -radii.xl,
  },
  sheetContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  welcome: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.sm,
    color: colors.textMuted,
    fontSize: 13,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
