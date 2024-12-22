import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className='mx-auto flex h-full max-w-5xl flex-col justify-center gap-6 text-center'>
      <h1 className='text-5xl font-bold'>Invoicipedia</h1>
      <p>
        <Button asChild>
          <Link href='/dashboard'>Sign In</Link>
        </Button>
      </p>
    </main>
  );
}
