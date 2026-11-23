import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../features/autenticacao/Login';
import Register from '../features/autenticacao/Register';
import AppLayout from '../AppLayout';
import { cores } from '../colors';
import type { RootStackParamList } from './navigationTypes';

// Cria o navegador de pilha tipado com a lista de rotas
const Stack = createNativeStackNavigator<RootStackParamList>();

const stackOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: cores.fundo },
};

export default function AppNavigator() {
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
