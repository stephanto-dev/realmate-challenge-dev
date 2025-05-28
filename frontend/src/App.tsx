import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ConversationListPage from './pages/ConversationListPage.tsx';
import ConversationDetailPage from './pages/ConversationDetailPage.tsx';

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4"> {/* Container básico com Tailwind */}
      <Routes>
        {/* Rota para a lista de conversas */}
        <Route path="/conversations" element={<ConversationListPage />} />

        {/* Rota para os detalhes de uma conversa específica */}
        {/* O ':id' na URL será um parâmetro dinâmico */}
        <Route path="/conversations/:id" element={<ConversationDetailPage />} />

        {/* Rota padrão: redireciona de '/' para '/conversations' */}
        <Route path="/" element={<Navigate replace to="/conversations" />} />

        {/* <Route path="*" element={<div>Página Não Encontrada</div>} /> */}
      </Routes>
    </div>
  );
};

export default App;