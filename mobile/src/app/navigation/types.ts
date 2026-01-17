export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  TasksList: undefined;
  TaskDetail: { taskId: string };
  CreateTask: undefined;
  Profile: undefined;
  EditProfile: undefined;
};

export type MainTabParamList = {
  Tasks: undefined;
  ProfileTab: undefined;
};
