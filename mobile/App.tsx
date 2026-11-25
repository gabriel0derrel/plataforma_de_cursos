import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/features/autenticacao/AuthContext';
import { cores } from './src/colors';

// Tema escuro do React Navigation com as cores LCARS
const temaLcars: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: cores.primaria,
    background: cores.fundo,
    card: cores.superficie,
    text: cores.texto,
    border: cores.primaria,
  },
};

export default function App() {
  return (
    // NavigationContainer envolve TODA a navegação do app (apenas um por app)
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <UserProvider>
        <NavigationContainer theme={temaLcars}>
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}
