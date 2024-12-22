import { cn } from '@/lib/utils';

const Container = ({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('mx-auto max-w-5xl px-5', className)}>
      {children}
    </div>
  );
};

export default Container;
