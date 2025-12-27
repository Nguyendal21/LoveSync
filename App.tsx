import React, { useState, useEffect } from 'react';
import { User, PairingSession, ViewState, Post, AlbumPhoto, Goal, ThemeType } from './types';
import { getData } from './services/storage';
import { getThemeForDate } from './services/theme';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Memories from './pages/Memories';
import Album from './pages/Album';
import Goals from './pages/Goals';
import Settings from './pages/Settings';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<PairingSession | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.ONBOARDING);
  
  // Theme State
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('DEFAULT');

  // Data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [album, setAlbum] = useState<AlbumPhoto[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Check for local session on load (Auto-login simulation)
  useEffect(() => {
    // Load initial theme based on date
    setCurrentTheme(getThemeForDate());

    const savedUserId = localStorage.getItem('lovesync_current_user_id');
    const savedSessionCode = localStorage.getItem('lovesync_current_code');

    if (savedUserId && savedSessionCode) {
      const sessionData = localStorage.getItem(`lovesync_${savedSessionCode}`);
      if (sessionData) {
        const parsedSession: PairingSession = JSON.parse(sessionData);
        const user = parsedSession.users.find(u => u.id === savedUserId);
        
        if (user) {
          setCurrentUser(user);
          setSession(parsedSession);
          setView(ViewState.HOME);
          loadData(parsedSession.code);
        }
      }
    }
  }, []);

  const loadData = (code: string) => {
    setPosts(getData(code, 'posts', []));
    setAlbum(getData(code, 'album', []));
    setGoals(getData(code, 'goals', []));
  };

  const handleLogin = (user: User, newSession: PairingSession) => {
    setCurrentUser(user);
    setSession(newSession);
    setView(ViewState.HOME);
    
    // Persist login state
    localStorage.setItem('lovesync_current_user_id', user.id);
    localStorage.setItem('lovesync_current_code', newSession.code);
    
    loadData(newSession.code);
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('lovesync_current_user_id');
        localStorage.removeItem('lovesync_current_code');
        setCurrentUser(null);
        setSession(null);
        setView(ViewState.ONBOARDING);
    }
  };

  if (!currentUser || !session || view === ViewState.ONBOARDING) {
    return <Onboarding onLogin={handleLogin} />;
  }

  // Identify partner
  const partner = session.users.find(u => u.id !== currentUser.id) || null;

  const renderContent = () => {
    switch (view) {
      case ViewState.HOME:
        return <Home currentUser={currentUser} partner={partner} session={session} themeType={currentTheme} />;
      case ViewState.MEMORIES:
        return <Memories currentUser={currentUser} partner={partner} session={session} posts={posts} setPosts={setPosts} />;
      case ViewState.ALBUM:
        return <Album currentUser={currentUser} session={session} album={album} setAlbum={setAlbum} />;
      case ViewState.GOALS:
        return <Goals currentUser={currentUser} session={session} goals={goals} setGoals={setGoals} />;
      case ViewState.SETTINGS:
        return <Settings currentUser={currentUser} setCurrentUser={setCurrentUser} session={session} />;
      default:
        return <Home currentUser={currentUser} partner={partner} session={session} themeType={currentTheme} />;
    }
  };

  return (
    <Layout 
        currentView={view} 
        onChangeView={setView} 
        onLogout={handleLogout}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;