import React from 'react';
import { StatusBar } from 'react-native';
import { Providers } from './providers';
import { RootNavigator } from './navigation/RootNavigator';
import { Colors } from '@/shared/constants';

const App: React.FC = () => {
  return (
    <Providers>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background.default}
      />
      <RootNavigator />
    </Providers>
  );
};

export default App;
