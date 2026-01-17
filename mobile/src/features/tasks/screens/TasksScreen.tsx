import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors, SPACING } from '@/shared/constants';
import { Button } from '@/shared/components';
import { useTasks, useCompleteTask } from '../hooks/useTasks';
import { TaskList } from '../components/TaskList';
import { Task } from '../types';
import { MainStackParamList } from '@/app/navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'TasksList'>;

export const TasksScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isRefetching, refetch } = useTasks({ page, limit: 20 });
  const { mutate: completeTask } = useCompleteTask();

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  const handleTaskComplete = (task: Task) => {
    if (!task.isCompleted) {
      completeTask(task.id);
    }
  };

  const handleCreateTask = () => {
    navigation.navigate('CreateTask');
  };

  const handleLoadMore = () => {
    if (data && page < data.meta.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TaskList
          tasks={data?.data || []}
          isLoading={isLoading}
          isRefetching={isRefetching}
          onRefresh={refetch}
          onTaskPress={handleTaskPress}
          onTaskComplete={handleTaskComplete}
          onEndReached={handleLoadMore}
        />
      </View>

      <View style={styles.fab}>
        <Button
          title="+"
          onPress={handleCreateTask}
          style={styles.fabButton}
          textStyle={styles.fabText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  fabText: {
    fontSize: 24,
  },
});

export default TasksScreen;
