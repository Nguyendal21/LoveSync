import { AppState, User, PairingSession, Post, AlbumPhoto, Goal } from '../types';

const STORAGE_KEY_PREFIX = 'lovesync_';

export const getSession = (code: string): PairingSession | null => {
  const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${code}`);
  return data ? JSON.parse(data) : null;
};

export const saveSession = (session: PairingSession) => {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${session.code}`, JSON.stringify(session));
};

export const getData = <T>(code: string, key: string, defaultValue: T): T => {
  const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${code}_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

export const saveData = <T>(code: string, key: string, data: T) => {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${code}_${key}`, JSON.stringify(data));
};

// Utilities for image handling (simulated)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Quotes
const LOVE_QUOTES = [
  "Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng.",
  "Được yêu là một điều may mắn, nhưng yêu người khác mới chính là hạnh phúc.",
  "Hạnh phúc lớn nhất trên đời là niềm tin vững chắc rằng chúng ta được yêu.",
  "Yêu một người là muốn chia sẻ mọi khoảnh khắc, dù buồn hay vui.",
  "Khoảng cách không thể ngăn cản hai trái tim cùng nhịp đập.",
  "Tình yêu biến những điều vô nghĩa của cuộc đời thành những gì có ý nghĩa.",
  "Chỉ cần có em, thế giới này trở nên hoàn hảo.",
  "Mỗi ngày bên em là một món quà vô giá.",
  "Tình yêu đích thực là khi bạn tìm thấy mảnh ghép hoàn hảo của đời mình.",
  "Cảm ơn đời mỗi sớm mai thức dậy, ta có thêm ngày nữa để yêu thương."
];

export const getDailyQuote = (startDateStr: string): string => {
  // Simple hash based on date and start date to ensure consistency for the day
  const today = new Date();
  const start = new Date(startDateStr);
  const dayOfYear = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const index = Math.abs(dayOfYear) % LOVE_QUOTES.length;
  return LOVE_QUOTES[index];
};