import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header.jsx'; 
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import MediaGallery from './components/MediaGallery';
import MediaManagement from './components/admin/MediaManagement';
import SiteLayout from './SiteLayout';

// Lazy load components
const MainPageComp = lazy(() => import('./components/MainPageComp.jsx'));
const FederationPage = lazy(() => import('./components/FederationPage.jsx'));
const CalendarPage = lazy(() => import('./components/CalendarPage.jsx'));
// const LearningPage = lazy(() => import('./components/LearningPage.jsx'));
const CompetitionsPage = lazy(() => import('./components/CompetitionsPage.jsx'));
const NewsPage = lazy(() => import('./components/NewsPage.jsx'));
const NewsDetailPage = lazy(() => import('./components/NewsDetailPage.jsx'));
const ContactsPage = lazy(() => import('./components/ContactsPage.jsx'));
const PartnersPage = lazy(() => import('./pages/Partners.jsx'));
const HistoryPage = lazy(() => import('./components/judo/HistoryPage.jsx'));
const InterestingFactsPage = lazy(() => import('./components/judo/InterestingFactsPage.jsx'));
const OathPage = lazy(() => import('./components/judo/OathPage.jsx'));
const PrinciplesPage = lazy(() => import('./components/judo/PrinciplesPage.jsx'));
const TechniquesPage = lazy(() => import('./components/judo/TechniquesPage.jsx'));
const WisdomPage = lazy(() => import('./components/judo/WisdomPage.jsx'));

// Admin imports
import { AuthProvider } from './context/AuthContext';
import { NewsProvider } from './context/NewsContext';
import { CompetitionsProvider } from './context/CompetitionsContext';
import { CalendarProvider } from './context/CalendarContext';
import { ContactsProvider } from './context/ContactsContext';
import { PartnersProvider } from './context/PartnersContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Lazy load admin components
const Login = lazy(() => import('./components/admin/Login'));
const NewsAdmin = lazy(() => import('./components/admin/pages/NewsAdmin'));
const CompetitionsAdmin = lazy(() => import('./components/admin/pages/CompetitionsAdmin'));
const CalendarAdmin = lazy(() => import('./components/admin/pages/CalendarAdmin'));
const ContactsAdmin = lazy(() => import('./components/admin/pages/ContactsAdmin'));
const PartnersAdmin = lazy(() => import('./components/admin/pages/PartnersAdmin'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NewsProvider>
          <CompetitionsProvider>
            <CalendarProvider>
              <ContactsProvider>
                <PartnersProvider>
                  <div className="app">
                    <Routes>
                      {/* Admin routes */}
                      <Route path="/admin/login" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <Login />
                        </Suspense>
                      } />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <AdminLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route path="news" element={
                          <Suspense fallback={<LoadingSpinner />}>
                            <NewsAdmin />
                          </Suspense>
                        } />
                        <Route path="competitions" element={
                          <Suspense fallback={<LoadingSpinner />}>
                            <CompetitionsAdmin />
                          </Suspense>
                        } />
                        <Route path="calendar" element={
                          <Suspense fallback={<LoadingSpinner />}>
                            <CalendarAdmin />
                          </Suspense>
                        } />
                        <Route path="contacts" element={
                          <Suspense fallback={<LoadingSpinner />}>
                            <ContactsAdmin />
                          </Suspense>
                        } />
                        <Route path="media" element={
                          <Suspense fallback={<LoadingSpinner />}>
                            <MediaManagement />
                          </Suspense>
                        } />
                        <Route path="partners" element={
                          <Suspense fallback={<LoadingSpinner />}>
                            <PartnersAdmin />
                          </Suspense>
                        } />
                      </Route>

                      {/* Публичные страницы с layout */}
                      <Route path="/" element={<SiteLayout />}>
                        <Route index element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <MainPageComp />
                                  </Suspense>
                                } />
                        <Route path="media" element={<MediaGallery />} />
                        <Route path="news" element={
                          <Suspense fallback={<LoadingSpinner />}>
                            <NewsPage />
                          </Suspense>
                        } />
                        <Route path="news/:id" element={
                          <Suspense fallback={<LoadingSpinner />}>
                            <NewsDetailPage />
                          </Suspense>
                        } />
                                <Route path="federation" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <FederationPage />
                                  </Suspense>
                                } />
                                <Route path="calendar" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <CalendarPage />
                                  </Suspense>
                                } />
                                {/* Временно отключенный маршрут обучения
                                <Route path="learning" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <LearningPage />
                                  </Suspense>
                                } />
                                */}
                                <Route path="competitions" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <CompetitionsPage />
                                  </Suspense>
                                } />
                                <Route path="contacts" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <ContactsPage />
                                  </Suspense>
                                } />
                                <Route path="about-judo/history" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <HistoryPage />
                                  </Suspense>
                                } />
                                <Route path="about-judo/interesting-facts" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <InterestingFactsPage />
                                  </Suspense>
                                } />
                                <Route path="about-judo/oath" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <OathPage />
                                  </Suspense>
                                } />
                                <Route path="about-judo/principles" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <PrinciplesPage />
                                  </Suspense>
                                } />
                                <Route path="about-judo/techniques" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <TechniquesPage />
                                  </Suspense>
                                } />
                                <Route path="about-judo/wisdom" element={
                                  <Suspense fallback={<LoadingSpinner />}>
                                    <WisdomPage />
                                  </Suspense>
                                } />
                        <Route path="partners" element={
                          <Suspense fallback={<LoadingSpinner />}>
                            <PartnersPage />
                          </Suspense>
                        } />
                      </Route>
                    </Routes>
                  </div>
                </PartnersProvider>
              </ContactsProvider>
            </CalendarProvider>
          </CompetitionsProvider>
        </NewsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
