import Link from 'next/link';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import Container from '@/components/Container';

const Header = () => {
  return (
    <header className='mb-12 mt-8'>
      <Container>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <p className='font-bold'>
              <Link href='/dashboard'>Invoicipedia</Link>
            </p>
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
