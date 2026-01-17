import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/shared/components';
import { Colors, SPACING, BORDER_RADIUS } from '@/shared/constants';
import { CreateTaskFormData, Priority } from '../types';

interface TaskFormProps {
  form: UseFormReturn<CreateTaskFormData>;
  onSubmit: () => void;
  isLoading: boolean;
  submitLabel: string;
}

const priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

export const TaskForm: React.FC<TaskFormProps> = ({
  form,
  onSubmit,
  isLoading,
  submitLabel,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Controller
        control={form.control}
        name="title"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <Input
            label={t('tasks.taskTitle')}
            placeholder={t('tasks.taskTitle')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message ? t(error.message) : undefined}
          />
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('tasks.taskDescription')}
            placeholder={t('tasks.taskDescription')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={4}
            style={styles.descriptionInput}
          />
        )}
      />

      <View style={styles.prioritySection}>
        <Text style={styles.priorityLabel}>{t('tasks.priority')}</Text>
        <Controller
          control={form.control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <View style={styles.priorityButtons}>
              {priorities.map((priority) => (
                <Pressable
                  key={priority}
                  style={[
                    styles.priorityButton,
                    value === priority && styles.priorityButton_selected,
                    value === priority && {
                      backgroundColor:
                        priority === 'LOW'
                          ? Colors.semantic.success
                          : priority === 'MEDIUM'
                          ? Colors.semantic.warning
                          : Colors.semantic.error,
                    },
                  ]}
                  onPress={() => onChange(priority)}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      value === priority && styles.priorityButtonText_selected,
                    ]}
                  >
                    {t(`tasks.priority${priority.charAt(0) + priority.slice(1).toLowerCase()}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />
      </View>

      <Button
        title={submitLabel}
        onPress={onSubmit}
        loading={isLoading}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  prioritySection: {
    marginBottom: SPACING.lg,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: SPACING.sm,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: 'center',
  },
  priorityButton_selected: {
    borderColor: 'transparent',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  priorityButtonText_selected: {
    color: Colors.neutral.white,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});

export default TaskForm;
