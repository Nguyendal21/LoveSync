import React, { useState } from 'react';
import { User, PairingSession } from '../types';
import { getSession, saveSession } from '../services/storage';
import { Heart } from 'lucide-react';

interface OnboardingProps {
  onLogin: (user: User, session: PairingSession) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !age || !code) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const userId = Date.now().toString();
    const newUser: User = {
      id: userId,
      name,
      age: parseInt(age),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, // Random avatar generator
      gender: 'other' // Default
    };

    const existingSession = getSession(code);

    if (mode === 'create') {
      if (existingSession) {
        setError('Mã này đã tồn tại. Hãy chọn mã khác hoặc chuyển sang chế độ "Ghép đôi".');
        return;
      }
      
      const newSession: PairingSession = {
        code,
        startDate: new Date().toISOString(),
        users: [newUser]
      };
      
      saveSession(newSession);
      onLogin(newUser, newSession);

    } else {
      // JOIN mode
      if (!existingSession) {
        setError('Mã ghép đôi không tồn tại.');
        return;
      }

      if (existingSession.users.length >= 2) {
        setError('Mã này đã có đủ 2 người.');
        return;
      }

      const updatedSession = {
        ...existingSession,
        users: [...existingSession.users, newUser]
      };
      
      saveSession(updatedSession);
      onLogin(newUser, updatedSession);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 animate-fade-in border border-rose-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-rose-100 p-4 rounded-full mb-4 animate-bounce">
            <Heart className="text-rose-500 fill-rose-500" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">LoveSync</h1>
          <p className="text-gray-500 mt-2 text-center">Lưu giữ khoảnh khắc yêu thương</p>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'create' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setMode('create')}
          >
            Tạo mới
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'join' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setMode('join')}
          >
            Ghép đôi
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên của bạn</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all"
              placeholder="Nhập tên..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi</label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all"
              placeholder="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {mode === 'create' ? 'Tự tạo mã số bí mật' : 'Nhập mã số của người ấy'}
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all font-mono tracking-widest text-center uppercase"
              placeholder="LOVE123"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 transition-all transform hover:scale-[1.02] mt-4"
          >
            {mode === 'create' ? 'Bắt đầu hành trình' : 'Kết nối yêu thương'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;