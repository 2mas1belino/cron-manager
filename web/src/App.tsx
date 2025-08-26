import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CreateCron } from './pages/CreateCronJob';
import { EditCron } from './pages/EditCronJob';
import { ThemeProvider } from './components/shadcn/theme-provider';
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateCron />} />
          <Route path="/edit/:id" element={<EditCron />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    );
}

export default App
