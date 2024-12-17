import Link from 'next/link';

import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <main className='mx-auto flex h-full min-h-screen max-w-5xl flex-col items-center justify-center gap-6 text-center'>
      <h1 className='text-5xl font-bold'>Invoicipedia</h1>
      <p>
        <Button asChild>
          <Link href='/dashboard'>Sign In</Link>
        </Button>
      </p>
    </main>
  );
};

export default Home;
