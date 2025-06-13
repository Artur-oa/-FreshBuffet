import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(prev => !prev)}
      className='
      bg-white text-black dark:bg-black dark:text-white
        border border-gray-300 shadow-md rounded-full 
        w-10 h-10 flex items-center justify-center z-50 
        transition-all duration-300 
        hover:scale-103 active:scale-95
        hover:shadow-lg
        hover:animate-pulse cursor-pointer'
    >
      {isDark ? (
        <span className='text-xl translate-x-[1px] translate-y-[1px]'>
          <i className='bx bx-moon'></i>
        </span>
      ) : (
        <span className='text-xl translate-x-[1px] translate-y-[1px]'>
          <i className='bx bxs-moon'></i>
        </span>
      )}
    </button>
  );
}
