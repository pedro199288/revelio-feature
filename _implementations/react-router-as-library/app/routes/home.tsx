import { ExampleClient } from '~/components/example.client';
import type { Route } from './+types/home';
import { useEffect } from 'react';
import { useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="text-3xl font-bold">
      the home page
      {isClient && <ExampleClient />}
    </div>
  );
}
