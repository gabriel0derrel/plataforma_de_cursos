import { Navigate, Route, Routes } from 'react-router-dom';
import { configByRoute, classConfigs } from './classes';
import { AppLayout } from './components/AppLayout';
import { EntityForm, EntityList } from './components/EntityPage';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        {classConfigs.map((config) => <Route key={config.route} path={config.route} element={<EntityList config={configByRoute[config.route]} />} />)}
        {classConfigs.map((config) => <Route key={config.route + '-novo'} path={config.route + '/novo'} element={<EntityForm config={configByRoute[config.route]} />} />)}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
