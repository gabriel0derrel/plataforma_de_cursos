import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppRoutes from './src/navigation/AppRoutes';
import { UserProvider } from './src/classes/Usuario/AuthContext';
import { cores } from './src/styles/theme';

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
    <UserProvider>
      <NavigationContainer theme={temaLcars}>
        <AppRoutes />
        <StatusBar style="light" />
      </NavigationContainer>
    </UserProvider>
  );
}
