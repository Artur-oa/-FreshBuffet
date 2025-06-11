import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import Root from './app/Root';
import MainPage from './pages/MainPage';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Root user={user} setUser={setUser} />}>
          {/* <Route
            path='/auth'
            element={<AuthPage user={user} setUser={setUser} />}
          /> */}
          <Route path='/recipes' element={<MainPage user={user} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
