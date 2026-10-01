import { Navigate, Route, Routes } from 'react-router-dom';
import { configByRoute, classConfigs } from './classes';
import { AppLayout } from './components/AppLayout';
import { EntityForm, EntityList } from './components/EntityPage';
import { Dashboard } from './pages/Dashboard';
import { AssinaturasPage, AvaliacoesPage, CertificadosPage, ContaPage, MatriculasPage, PagamentosPage, ProgressoPage } from './classes/Aluno/AreaAluno';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/minhas-matriculas" element={<MatriculasPage />} />
        <Route path="/meu-progresso" element={<ProgressoPage />} />
        <Route path="/minhas-avaliacoes" element={<AvaliacoesPage />} />
        <Route path="/meus-certificados" element={<CertificadosPage />} />
        <Route path="/minhas-assinaturas" element={<AssinaturasPage />} />
        <Route path="/meus-pagamentos" element={<PagamentosPage />} />
        <Route path="/minha-conta" element={<ContaPage />} />
        {classConfigs.map((config) => <Route key={config.route} path={config.route} element={<EntityList config={configByRoute[config.route]} />} />)}
        {classConfigs.map((config) => <Route key={config.route + '-novo'} path={config.route + '/novo'} element={<EntityForm config={configByRoute[config.route]} />} />)}
        {classConfigs.map((config) => <Route key={config.route + '-editar'} path={config.route + '/:id/editar'} element={<EntityForm config={configByRoute[config.route]} edit />} />)}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
