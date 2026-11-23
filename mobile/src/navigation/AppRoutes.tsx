import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../classes/Usuario/Login';
import Register from '../classes/Usuario/Register';
import AppLayout from '../components/AppLayout';
import { cores } from '../styles/theme';
import type { RootStackParamList } from './types';

// Cria o navegador de pilha tipado com a lista de rotas
const Stack = createNativeStackNavigator<RootStackParamList>();

const stackOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: cores.fundo },
};

export default function AppRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={stackOptions}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registro" component={Register} />
      <Stack.Screen name="Principal" component={AppLayout} />
    </Stack.Navigator>
  );
}
