"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const lastPage = localStorage.getItem('lastPage');

    if (lastPage && lastPage !== '/') {
      router.push(lastPage);
    } else {
      router.push('/about');
    }
  }, [router]);
}