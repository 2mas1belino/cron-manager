import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CreateCron } from './pages/CreateCronJob';
import { EditCron } from './pages/EditCronJob';
import './App.css'

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateCron />} />
          <Route path="/edit/:id" element={<EditCron />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    );
}

export default App
