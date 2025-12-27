import React, { useState, useRef, useMemo, useEffect } from 'react';
import { User, AlbumPhoto, PairingSession } from '../types';
import { fileToBase64, saveData } from '../services/storage';
import { Plus, X, Folder, Image as ImageIcon, ArrowLeft, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface AlbumProps {
  currentUser: User;
  session: PairingSession;
  album: AlbumPhoto[];
  setAlbum: React.Dispatch<React.SetStateAction<AlbumPhoto[]>>;
}

const Album: React.FC<AlbumProps> = ({ currentUser, session, album, setAlbum }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null); // Null means root (viewing folders)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group photos by albumName
  const folders = useMemo(() => {
    const groups: Record<string, AlbumPhoto[]> = {};
    // Default folder
    groups['Chung'] = [];
    
    album.forEach(photo => {
      const name = photo.albumName || 'Chung';
      if (!groups[name]) groups[name] = [];
      groups[name].push(photo);
    });
    return groups;
  }, [album]);

  const currentPhotos = useMemo(() => {
      return folders[currentFolder || 'Chung'] || [];
  }, [folders, currentFolder]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos: AlbumPhoto[] = [];
      const targetFolder = currentFolder || 'Chung';

      // Process all selected files
      for (let i = 0; i < e.target.files.length; i++) {
        try {
          const base64 = await fileToBase64(e.target.files[i]);
          newPhotos.push({
            id: Date.now().toString() + i,
            userId: currentUser.id,
            url: base64,
            timestamp: Date.now(),
            albumName: targetFolder
          });
        } catch (err) {
          console.error(err);
        }
      }

      const updatedAlbum = [...newPhotos, ...album];
      setAlbum(updatedAlbum);
      saveData(session.code, 'album', updatedAlbum);
    }
  };

  const createFolder = () => {
      if(newFolderName.trim()) {
          setCurrentFolder(newFolderName.trim());
          setNewFolderName('');
          setIsCreatingFolder(false);
      }
  }

  const deletePhoto = (id: string) => {
      if(window.confirm("Bạn có chắc muốn xóa ảnh này không?")) {
          const updatedAlbum = album.filter(p => p.id !== id);
          setAlbum(updatedAlbum);
          saveData(session.code, 'album', updatedAlbum);
          setLightboxIndex(null);
      }
  }

  const navigateLightbox = (direction: 'next' | 'prev') => {
      if (lightboxIndex === null) return;
      
      if (direction === 'next') {
          setLightboxIndex((prev) => (prev! + 1) % currentPhotos.length);
      } else {
          setLightboxIndex((prev) => (prev! - 1 + currentPhotos.length) % currentPhotos.length);
      }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'ArrowRight') navigateLightbox('next');
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
    if (e.key === 'Escape') setLightboxIndex(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);


  // View: List of Folders
  if (currentFolder === null) {
      return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Thư viện ảnh</h2>
                    <p className="text-gray-500 text-sm mt-1">{Object.keys(folders).length} sự kiện</p>
                </div>
                <button 
                    onClick={() => setIsCreatingFolder(true)}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-600 px-4 py-2 rounded-lg transition-colors flex items-center font-medium"
                >
                    <Plus className="w-5 h-5 mr-1" />
                    Album mới
                </button>
            </div>

            {/* Create Folder Input */}
            {isCreatingFolder && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100 mb-4 animate-fade-in">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Tên sự kiện / Album mới</h3>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            autoFocus
                            placeholder="Ví dụ: Sinh nhật 2024..."
                            className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                        />
                        <button onClick={createFolder} className="bg-rose-500 text-white px-4 py-2 rounded-lg">Tạo</button>
                        <button onClick={() => setIsCreatingFolder(false)} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">Hủy</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(folders).map(folderName => {
                    const photos = folders[folderName];
                    const preview = photos.length > 0 ? photos[0].url : null;
                    
                    return (
                        <div 
                            key={folderName} 
                            onClick={() => setCurrentFolder(folderName)}
                            className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 group"
                        >
                            <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
                                {preview ? (
                                    <img src={preview} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="cover"/>
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-300">
                                        <ImageIcon size={40} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-800 truncate max-w-[120px]">{folderName}</h3>
                                    <p className="text-xs text-gray-500">{photos.length} ảnh</p>
                                </div>
                                <Folder className="text-rose-300" size={20}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      );
  }

  // View: Photos inside Folder
  
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <button onClick={() => setCurrentFolder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={24} className="text-gray-600"/>
            </button>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentFolder}</h2>
                <p className="text-gray-500 text-sm mt-1">{currentPhotos.length} ảnh</p>
            </div>
        </div>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center font-medium shadow-md shadow-rose-200"
        >
          <Plus className="w-5 h-5 mr-1" />
          Thêm ảnh
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple 
          onChange={handleUpload}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 animate-fade-in-up">
        {currentPhotos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl shadow-sm bg-gray-100"
            onClick={() => setLightboxIndex(index)}
          >
            <img 
              src={photo.url} 
              alt="Memory" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
          </div>
        ))}
        {currentPhotos.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                <p>Album này chưa có ảnh nào.</p>
                <p className="text-sm">Hãy thêm những bức ảnh đầu tiên!</p>
            </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
        >
          <div className="absolute inset-0" onClick={() => setLightboxIndex(null)}></div>
          
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50 bg-black/50 rounded-full"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={24} />
          </button>

          <button
             className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-50 hover:bg-white/10 rounded-full transition-colors"
             onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
          >
             <ChevronLeft size={32} />
          </button>

          <button
             className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-50 hover:bg-white/10 rounded-full transition-colors"
             onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
          >
             <ChevronRight size={32} />
          </button>

          <div className="relative z-10 max-w-5xl w-full flex flex-col items-center">
             <img 
                src={currentPhotos[lightboxIndex].url} 
                alt="Full view" 
                className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
             />
             <div className="mt-4 flex gap-4">
                 <button 
                    onClick={() => deletePhoto(currentPhotos[lightboxIndex].id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-colors"
                 >
                     <Trash2 size={18} />
                     <span className="text-sm font-medium">Xóa ảnh</span>
                 </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Album;