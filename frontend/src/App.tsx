import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ConversationListPage from './pages/ConversationListPage.tsx';
import ConversationDetailPage from './pages/ConversationDetailPage.tsx';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/conversations" element={<ConversationListPage />} />
          <Route path="/conversations/:id" element={<ConversationDetailPage />} />
          <Route path="/" element={<Navigate replace to="/conversations" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;