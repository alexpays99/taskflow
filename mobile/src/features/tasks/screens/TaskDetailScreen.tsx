import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Colors, SPACING } from '@/shared/constants';
import { Button, Card } from '@/shared/components';
import { useTask, useDeleteTask, useCompleteTask } from '../hooks/useTasks';
import { PriorityBadge } from '../components/PriorityBadge';
import { MainStackParamList } from '@/app/navigation/types';

type RouteProps = RouteProp<MainStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { taskId } = route.params;

  const { data: task, isLoading } = useTask(taskId);
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: completeTask, isPending: isCompleting } = useCompleteTask();

  const handleDelete = () => {
    Alert.alert(t('tasks.deleteTask'), t('tasks.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteTask(taskId, {
            onSuccess: () => navigation.goBack(),
          });
        },
      },
    ]);
  };

  const handleComplete = () => {
    if (task && !task.isCompleted) {
      completeTask(taskId);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{t('errors.resourceNotFound')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card} variant="elevated">
          <View style={styles.header}>
            <Text style={styles.title}>{task.title}</Text>
            <PriorityBadge priority={task.priority} />
          </View>

          {task.description && (
            <Text style={styles.description}>{task.description}</Text>
          )}

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{t('tasks.dueDate')}:</Text>
            <Text style={styles.metaValue}>
              {task.dueDate
                ? format(new Date(task.dueDate), 'MMM d, yyyy')
                : '-'}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status:</Text>
            <Text
              style={[
                styles.metaValue,
                task.isCompleted && styles.completedText,
              ]}
            >
              {task.isCompleted ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </Card>

        <View style={styles.actions}>
          {!task.isCompleted && (
            <Button
              title={t('tasks.markComplete')}
              onPress={handleComplete}
              loading={isCompleting}
              style={styles.completeButton}
            />
          )}

          <Button
            title={t('tasks.deleteTask')}
            onPress={handleDelete}
            loading={isDeleting}
            variant="outline"
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.md,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginRight: SPACING.md,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  metaLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: SPACING.sm,
  },
  metaValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  completedText: {
    color: Colors.semantic.success,
  },
  errorText: {
    fontSize: 16,
    color: Colors.semantic.error,
  },
  actions: {
    gap: SPACING.md,
  },
  completeButton: {
    backgroundColor: Colors.semantic.success,
  },
  deleteButton: {
    borderColor: Colors.semantic.error,
  },
  deleteButtonText: {
    color: Colors.semantic.error,
  },
});

export default TaskDetailScreen;
