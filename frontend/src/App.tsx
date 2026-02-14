
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AppPage } from './pages/AppPage';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>




        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
