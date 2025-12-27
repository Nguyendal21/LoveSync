import React, { useState, useRef } from 'react';
import { User, Post, PairingSession } from '../types';
import { fileToBase64, saveData } from '../services/storage';
import { Image as ImageIcon, Send, ThumbsUp, MessageCircle } from 'lucide-react';

interface MemoriesProps {
  currentUser: User;
  partner: User | null;
  session: PairingSession;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const Memories: React.FC<MemoriesProps> = ({ currentUser, partner, session, posts, setPosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setSelectedImage(base64);
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
  };

  const handleSubmit = () => {
    if (!newCaption.trim() && !selectedImage) return;

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: newCaption,
      imageUrl: selectedImage || undefined,
      timestamp: Date.now(),
      likes: 0,
      comments: []
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    saveData(session.code, 'posts', updatedPosts);

    // Reset
    setNewCaption('');
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const getUser = (id: string) => {
    if (currentUser.id === id) return currentUser;
    if (partner?.id === id) return partner;
    return { name: 'Người dùng', avatarUrl: 'https://picsum.photos/50' } as User;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Bảng tin Kỉ niệm</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center font-medium"
        >
          <ImageIcon className="w-5 h-5 mr-2" />
          Thêm kỉ niệm
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-rose-100">
                <p className="text-gray-500">Chưa có kỉ niệm nào. Hãy chia sẻ khoảnh khắc đầu tiên!</p>
            </div>
        )}
        {posts.map((post) => {
          const author = getUser(post.userId);
          return (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
              {/* Post Header */}
              <div className="p-4 flex items-center space-x-3">
                <img 
                  src={author.avatarUrl} 
                  alt={author.name} 
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{author.name}</h4>
                  <p className="text-xs text-gray-500">{formatTime(post.timestamp)}</p>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pb-2">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </div>

              {/* Image */}
              {post.imageUrl && (
                <div className="mt-2 w-full bg-gray-50">
                  <img src={post.imageUrl} alt="Memory" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              )}

              {/* Actions Footer */}
              <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between text-gray-500">
                 <div className="flex space-x-6">
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <ThumbsUp size={18} />
                        <span className="text-sm font-medium">Thích</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <MessageCircle size={18} />
                        <span className="text-sm font-medium">Bình luận</span>
                    </button>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="p-4 border-b flex justify-between items-center bg-rose-50">
              <h3 className="text-lg font-bold text-gray-800">Tạo kỉ niệm mới</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-start space-x-3">
                <img src={currentUser.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
                <textarea
                  className="flex-1 border-none focus:ring-0 text-lg placeholder-gray-400 resize-none min-h-[100px]"
                  placeholder={`Bạn đang nghĩ gì, ${currentUser.name}?`}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                />
              </div>
              
              {selectedImage && (
                <div className="relative rounded-xl overflow-hidden group">
                  <img src={selectedImage} alt="Preview" className="w-full h-64 object-cover" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    &times;
                  </button>
                </div>
              )}

              <div className="border rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                   onClick={() => fileInputRef.current?.click()}>
                <span className="text-gray-600 text-sm font-medium">Thêm ảnh vào bài viết</span>
                <ImageIcon className="text-green-500" />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="p-4 border-t">
              <button 
                onClick={handleSubmit}
                disabled={!newCaption && !selectedImage}
                className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all
                  ${(!newCaption && !selectedImage) ? 'bg-gray-300 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 shadow-md hover:shadow-lg'}`}
              >
                Đăng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memories;