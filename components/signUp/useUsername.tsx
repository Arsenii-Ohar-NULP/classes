import {useRouter, useSearchParams} from 'next/navigation';
import { useEffect, useState } from 'react';
export default function useUsername() {
    const searchParams = useSearchParams();
    const [username, setUsername] = useState(null);
    useEffect(() => {
      if (!username) {
        setUsername(searchParams['username']);
      }
    });
  
    return username;
  }