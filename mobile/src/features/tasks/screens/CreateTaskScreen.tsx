import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/shared/constants';
import { useCreateTask } from '../hooks/useTasks';
import { TaskForm } from '../components/TaskForm';
import { CreateTaskFormData, createTaskSchema } from '../types';

export const CreateTaskScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutate: createTask, isPending } = useCreateTask();

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    createTask(data, {
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
          <TaskForm
            form={form}
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel={t('tasks.addTask')}
          />
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
});

export default CreateTaskScreen;
