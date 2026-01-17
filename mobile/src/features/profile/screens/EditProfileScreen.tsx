import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Colors, SPACING } from '@/shared/constants';
import { Button, Input } from '@/shared/components';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useUpdateProfile } from '../hooks/useProfile';

interface FormData {
  name: string;
}

export const EditProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    updateProfile(data, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Controller
              control={form.control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.name')}
                  placeholder={t('auth.name')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                />
              )}
            />

            <Button
              title={t('common.save')}
              onPress={handleSubmit}
              loading={isPending}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  button: {
    marginTop: SPACING.lg,
  },
});

export default EditProfileScreen;
