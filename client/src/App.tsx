import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateEventWizardPage } from './pages/CreateEventWizardPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Auto scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <EventProvider>
        <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-slate-900">
          <ScrollToTop />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/wizard" element={<CreateEventWizardPage />} />
              <Route path="/event/:id" element={<EventDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </EventProvider>
    </Router>
  );
};

export default App;
