import { Colors } from "@/shared/constants";
import React from "react";
import { StatusBar } from "react-native";
import { RootNavigator } from "./navigation/RootNavigator";
import { Providers } from "./providers";

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
