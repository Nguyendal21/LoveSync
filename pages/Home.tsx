import React, { useMemo } from 'react';
import { User, PairingSession, ThemeType } from '../types';
import { getDailyQuote } from '../services/storage';
import { THEMES } from '../services/theme';
import GlossyHeart from '../components/GlossyHeart';

interface HomeProps {
  currentUser: User;
  partner: User | null;
  session: PairingSession;
  themeType: ThemeType;
}

const Home: React.FC<HomeProps> = ({ currentUser, partner, session, themeType }) => {
  const theme = THEMES[themeType];

  const daysTogether = useMemo(() => {
    const start = new Date(session.startDate).getTime();
    const now = new Date().getTime();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [session.startDate]);

  const quote = useMemo(() => getDailyQuote(session.startDate), [session.startDate]);

  const Avatar = ({ user, isCurrentUser }: { user: User | null, isCurrentUser?: boolean }) => {
    if (!user) return (
      <div className="flex flex-col items-center opacity-70">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/50 border-4 border-white shadow-lg flex items-center justify-center mb-3 backdrop-blur-sm">
           <span className="text-4xl text-gray-400">?</span>
        </div>
        <h3 className="text-xl font-bold text-gray-600">Đang chờ...</h3>
        <p className="text-gray-500">Mã: {session.code}</p>
      </div>
    );

    return (
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-white/50 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-xl transform transition hover:scale-105"
          />
          {/* Decorative halo based on theme */}
           <div className={`absolute -inset-2 rounded-full border-2 border-dashed opacity-30 animate-spin-slow ${theme.primaryColor} border-current w-[calc(100%+1rem)] h-[calc(100%+1rem)] -ml-2 -mt-2 pointer-events-none`}></div>
        </div>
        <h3 className={`text-xl md:text-2xl font-bold mt-4 ${theme.primaryColor.replace('text-', 'text-gray-800 ')}`}>{user.name}</h3>
        <p className={`${theme.primaryColor} font-medium`}>{user.age} tuổi</p>
      </div>
    );
  };

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-[80vh] space-y-12 animate-fade-in transition-colors duration-1000`}>
      
      {/* Background Decor handled in Layout, local overrides removed for consistency */}
      
      {/* Top Section: Profiles & Heart */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-16 z-10">
        
        {/* Current User */}
        <div className="order-2 md:order-1">
          <Avatar user={currentUser} isCurrentUser />
        </div>

        {/* Heart Counter */}
        <div className="order-1 md:order-2 flex flex-col items-center justify-center relative">
          <GlossyHeart days={daysTogether} />
          
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Bắt đầu yêu</p>
            <p className="text-lg font-semibold text-gray-700 bg-white/50 px-4 py-1 rounded-full shadow-sm backdrop-blur-sm">
                {new Date(session.startDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Partner */}
        <div className="order-3 flex flex-col items-center">
          <Avatar user={partner} />
        </div>
      </div>

      {/* Quote Section */}
      <div className={`w-full max-w-2xl text-center px-6 py-8 ${theme.overlayColor} backdrop-blur-md rounded-3xl shadow-sm border border-white/50 relative overflow-hidden group hover:bg-white/60 transition-colors z-10`}>
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${theme.primaryColor}`}></div>
        
        <p className="font-serif italic text-xl md:text-2xl text-gray-700 leading-relaxed relative z-10">
          "{quote}"
        </p>
      </div>

    </div>
  );
};

export default Home;