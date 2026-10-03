import { useState } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { RouterProvider, useRouter } from './router';
import { AuthProvider } from './context/AuthContext';
import { CmsProvider } from './cms/CmsContext';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CommunityPage } from './pages/CommunityPage';
import { EventsPage } from './pages/EventsPage';
import { CollaboratePage } from './pages/CollaboratePage';
import { MindsBehindDetoxPage } from './pages/MindsBehindDetoxPage';
import { PersonProfilePage } from './pages/PersonProfilePage';
import { MembersPortal } from './pages/MembersPortal';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SubmissionsGalleryPage } from './pages/SubmissionsGalleryPage';
import { SubmissionDetailPage } from './pages/SubmissionDetailPage';
import { ArtifactModal } from './components/ArtifactModal';

function AppContent() {
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { path } = useRouter();

  // If on admin route, render full-screen admin control room
  if (path === '/admin') {
    return <AdminDashboard />;
  }

  const renderActivePage = () => {
    if (path.startsWith('/people/')) {
      return <PersonProfilePage />;
    }

    // Dynamic Hackathon / Event Submissions routing:
    // /events/:eventId/submissions/:submissionId
    // /events/:eventId/submissions
    if (path.startsWith('/events/')) {
      const parts = path.split('/').filter(Boolean);
      if (parts.length >= 4 && parts[2] === 'submissions') {
        return <SubmissionDetailPage eventId={parts[1]} submissionId={parts[3]} />;
      }
      if (parts.length >= 3 && parts[2] === 'submissions') {
        return <SubmissionsGalleryPage eventId={parts[1]} />;
      }
    }

    switch (path) {
      case '/about':
        return <AboutPage />;
      case '/projects':
        return <ProjectsPage />;
      case '/community':
        return <CommunityPage />;
      case '/events':
        return <EventsPage />;
      case '/minds':
        return <MindsBehindDetoxPage />;
      case '/collaborate':
        return <CollaboratePage />;
      case '/members':
        return <MembersPortal />;
      case '/':
      default:
        return <HomePage onSelectArtifact={(id) => setSelectedArtifact(id)} />;
    }
  };

  return (
    <div
      className={`relative min-h-screen font-sans selection:bg-[#235347] selection:text-white transition-colors duration-700 ${
        isLight ? 'bg-[#ece9e2] text-[#18181b]' : 'bg-[#0b0c0e] text-[#d4d4d8]'
      }`}
    >
      {/* 1. Unified Fixed Engineering Navigation */}
      <Navigation />

      {/* 2. Active Page View */}
      <main className="transition-opacity duration-300">
        {renderActivePage()}
      </main>

      {/* 3. Unified Archival Colophon & TTY1 Terminal */}
      <Footer />

      {/* Artifact High-Resolution Inspection Modal */}
      <ArtifactModal
        artifactId={selectedArtifact}
        onClose={() => setSelectedArtifact(null)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CmsProvider>
          <RouterProvider>
            <AppContent />
          </RouterProvider>
        </CmsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

