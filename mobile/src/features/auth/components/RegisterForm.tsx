import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/shared/components';
import { Colors, SPACING } from '@/shared/constants';
import { useRegister } from '../hooks/useRegister';

interface RegisterFormProps {
  onLoginPress: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginPress }) => {
  const { t } = useTranslation();
  const { form, error, isLoading, onSubmit } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Controller
        control={form.control}
        name="name"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <Input
            label={t('auth.name')}
            placeholder={t('auth.name')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message ? t(error.message) : undefined}
            autoCapitalize="words"
          />
        )}
      />

      <Controller
        control={form.control}
        name="email"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <Input
            label={t('auth.email')}
            placeholder={t('auth.email')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message ? t(error.message) : undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />

      <Controller
        control={form.control}
        name="password"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <Input
            label={t('auth.password')}
            placeholder={t('auth.password')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message ? t(error.message) : undefined}
            secureTextEntry={!showPassword}
            rightIcon={
              <Text style={styles.showHide}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
        )}
      />

      {error && <Text style={styles.error}>{t(error)}</Text>}

      <Button
        title={t('auth.register')}
        onPress={onSubmit}
        loading={isLoading}
        style={styles.button}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('auth.haveAccount')}</Text>
        <Pressable onPress={onLoginPress}>
          <Text style={styles.link}>{t('auth.signIn')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  button: {
    marginTop: SPACING.md,
  },
  error: {
    color: Colors.semantic.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  link: {
    color: Colors.primary.main,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  showHide: {
    color: Colors.primary.main,
    fontSize: 14,
  },
});

export default RegisterForm;
