import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Root from './app/Root';
import { useState } from 'react';

import AuthPage from './features/auth/ui/AuthPage/AuthPage';
import MainPage from './pages/MainPage';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Root user={user} setUser={setUser} />}>
          {/* Редирект с корня на /recipes */}
          <Route index element={<Navigate to='/recipes' replace />} />

          {/* Всегда доступна для любого пользователя*/}
          <Route
            path='/auth'
            element={<AuthPage user={user} setUser={setUser} />}
          />
          
          <Route path='/recipes' element={<MainPage user={user} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
