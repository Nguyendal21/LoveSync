import React, { useState } from 'react';
import { User, PairingSession } from '../types';
import { saveSession, fileToBase64 } from '../services/storage';
import { Camera, Calendar } from 'lucide-react';

interface SettingsProps {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  session: PairingSession;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, setCurrentUser, session }) => {
  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age.toString());
  const [avatar, setAvatar] = useState(currentUser.avatarUrl);
  
  // Date handling
  const [startDate, setStartDate] = useState(session.startDate.split('T')[0]);

  const handleSave = () => {
    const updatedUser: User = {
      ...currentUser,
      name,
      age: parseInt(age) || 18,
      avatarUrl: avatar,
    };
    
    // Update local state
    setCurrentUser(updatedUser);
    
    // Update session storage (User + Date)
    const updatedUsers = session.users.map(u => u.id === currentUser.id ? updatedUser : u);
    
    // Ensure date maintains time or resets correctly
    const newDateObj = new Date(startDate);
    const updatedSession = { 
        ...session, 
        users: updatedUsers,
        startDate: newDateObj.toISOString() 
    };
    
    saveSession(updatedSession);
    
    // Reload page to reflect date changes in other components effectively if needed
    // or just rely on React state updates if passed down correctly. 
    // Here we might need to lift state up in App.tsx to see immediate changes in Home,
    // but saving to localStorage handles the persistence.
    // For smoother UX, we assume App.tsx re-reads or we trigger a reload.
    alert('Đã cập nhật thông tin thành công! Tải lại trang để áp dụng thay đổi ngày.');
    window.location.reload(); 
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setAvatar(base64);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
      <div className="bg-rose-50 p-6 text-center border-b border-rose-100">
        <h2 className="text-2xl font-bold text-gray-800">Cài đặt cá nhân</h2>
      </div>
      
      <div className="p-6 space-y-6">
        
        {/* Avatar Upload */}
        <div className="flex justify-center">
            <div className="relative group cursor-pointer">
                <img src={avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-rose-100 shadow-sm" />
                <label className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium">
                    <Camera className="mr-2" size={20} />
                    Sửa ảnh
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
            </div>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-400 outline-none"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi</label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-400 outline-none"
                />
            </div>
            
            <div className="pt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar size={16} className="mr-1 text-rose-500" />
                    Ngày bắt đầu yêu
                </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-400 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Thay đổi này sẽ cập nhật cho cả hai người.</p>
            </div>

            <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã ghép đôi (Chia sẻ cho người ấy)</label>
                <div className="bg-gray-100 p-3 rounded-xl text-center font-mono text-lg tracking-widest text-gray-600 select-all">
                    {session.code}
                </div>
            </div>
        </div>

        <button 
            onClick={handleSave}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-4"
        >
            Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default Settings;