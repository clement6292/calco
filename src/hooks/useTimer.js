import { useEffect, useState } from 'react';

export default function useTimer(interval = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), interval);
    return () => clearInterval(id);
  }, [interval]);

  return count;
}