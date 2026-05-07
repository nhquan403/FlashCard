import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/home-page'
import FolderDetailPage from './pages/folder-detail-page'
import StudySessionPage from './pages/study-session-page'
import StatsPage from './pages/stats-page'
import TopNav from './components/ui/top-nav'
import BottomNav from './components/ui/bottom-nav'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-16 sm:pb-0">
        <TopNav />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/folder/:id" element={<FolderDetailPage />} />
            <Route path="/study/:folderId" element={<StudySessionPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
