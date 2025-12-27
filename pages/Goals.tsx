import React, { useState } from 'react';
import { User, Goal, PairingSession } from '../types';
import { saveData } from '../services/storage';
import { Plus, Check, Trash2, Target } from 'lucide-react';
import Fireworks from '../components/Fireworks';

interface GoalsProps {
  currentUser: User;
  session: PairingSession;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const Goals: React.FC<GoalsProps> = ({ session, goals, setGoals }) => {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [showFireworks, setShowFireworks] = useState(false);

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      progress: 0,
      isCompleted: false,
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    saveData(session.code, 'goals', updated);
    setNewGoalTitle('');
  };

  const updateProgress = (id: string, newProgress: number) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const wasCompleted = g.isCompleted;
        const isCompleted = newProgress === 100;
        
        // Trigger fireworks if just completed
        if (!wasCompleted && isCompleted) {
          setShowFireworks(true);
          setTimeout(() => setShowFireworks(false), 3000);
        }
        
        return { ...g, progress: newProgress, isCompleted };
      }
      return g;
    });
    setGoals(updated);
    saveData(session.code, 'goals', updated);
  };

  const deleteGoal = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa mục tiêu này?')) {
        const updated = goals.filter(g => g.id !== id);
        setGoals(updated);
        saveData(session.code, 'goals', updated);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Fireworks active={showFireworks} />
      
      <div className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-rose-100 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mục tiêu chung</h2>
        <p className="text-gray-500">Cùng nhau cố gắng hoàn thành những dự định nhé!</p>
      </div>

      {/* Add Goal Input */}
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="Thêm mục tiêu mới (ví dụ: Đi Đà Lạt...)"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none shadow-sm bg-white/90"
            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
            />
        </div>
        <button 
          onClick={addGoal}
          disabled={!newGoalTitle.trim()}
          className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white px-5 rounded-xl transition-colors shadow-md"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div 
            key={goal.id} 
            className={`bg-white/90 backdrop-blur-sm p-5 rounded-2xl border transition-all duration-300
                ${goal.isCompleted ? 'border-green-200 bg-green-50/80 shadow-sm' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className={`font-semibold text-lg ${goal.isCompleted ? 'text-green-800 line-through decoration-green-500/50' : 'text-gray-800'}`}>
                {goal.title}
              </h3>
              <button 
                onClick={() => deleteGoal(goal.id)} 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                title="Xóa mục tiêu"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={goal.progress} 
                onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <span className={`text-sm font-bold min-w-[3rem] text-right ${goal.isCompleted ? 'text-green-600' : 'text-rose-500'}`}>
                {goal.progress}%
              </span>
            </div>
            
            {goal.isCompleted && (
                <div className="mt-2 text-xs font-bold text-green-600 flex items-center">
                    <Check size={14} className="mr-1" /> Đã hoàn thành
                </div>
            )}
          </div>
        ))}
        
        {goals.length === 0 && (
            <div className="text-center py-8 opacity-50 bg-white/50 rounded-xl">
                <p>Hãy thêm mục tiêu đầu tiên của hai bạn.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Goals;