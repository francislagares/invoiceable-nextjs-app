'use client';

import { LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className='relative w-full font-semibold'>
      <span className={pending ? 'text-transparent' : ''}>Submit</span>
      {pending && (
        <span className='absolute flex h-full w-full items-center justify-center text-gray-400'>
          <LoaderCircle className='animate-spin' />
        </span>
      )}
    </Button>
  );
};

export default SubmitButton;
