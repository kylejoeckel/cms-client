import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Adjust the import path as necessary
import ContentForm from './pages/ContentForm'; // Adjust the import path as necessary
import { AuthProvider } from './hooks/useAuth'; // Adjust the import path as necessary
import theme from './theme';
import PageTemplate from './components/PageTemplate';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<PageTemplate><Login /></PageTemplate>} />
            <Route path="/" element={
              <ProtectedRoute>
                <PageTemplate>
                  <ContentForm />
                </PageTemplate>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

