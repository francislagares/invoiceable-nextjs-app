export default function Loading() {
  return (
    <div className='mx-auto flex h-full max-w-5xl flex-col justify-center gap-6 text-center'>
      <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary'></div>
    </div>
  );
}
