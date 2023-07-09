import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export default function useUsername() {
    const router = useRouter();
    const [username, setUsername] = useState(null);
    useEffect(() => {
      if (!username) {
        setUsername(router.query['username']);
      }
    });
  
    return username;
  }