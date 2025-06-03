import React from 'react';
import Header from './components/header/Header';
import CounterpartyTable from './components/counterparty/table/Table';
import CounterpartyModal from './components/counterparty/modal/Modal';
import { CounterpartyProvider, useCounterpartyContext } from './context/CounterpartyContext';

const AppContent: React.FC = () => {
  const {
    counterparties,
    isModalOpen,
    isLoading,
    editingCounterparty,
    setIsModalOpen,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
  } = useCounterpartyContext();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <Header onAddNew={handleAddNew} />
        <main className="py-8">
          <div className="mt-8">
            <CounterpartyTable
              counterparties={counterparties}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>
      <CounterpartyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        counterparty={editingCounterparty}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CounterpartyProvider>
      <AppContent />
    </CounterpartyProvider>
  );
};

export default App;
