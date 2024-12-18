import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const Dashboard = () => {
  return (
    <main className='mx-auto my-12 flex h-full max-w-5xl flex-col justify-center gap-6'>
      <div className='flex justify-between'>
        <h1 className='text-left text-3xl font-bold'>Create Invoice</h1>
      </div>

      <form className='grid max-w-xs gap-4'>
        <div>
          <Label htmlFor='name' className='mb-2 block text-sm font-semibold'>
            Billing Name
          </Label>
          <Input id='name' name='name' type='text' />
        </div>

        <div>
          <Label htmlFor='email' className='mb-2 block text-sm font-semibold'>
            Billing Email
          </Label>
          <Input id='email' name='email' type='email' />
        </div>

        <div>
          <Label htmlFor='value' className='mb-2 block text-sm font-semibold'>
            Value
          </Label>
          <Input id='value' name='value' type='text' />
        </div>

        <div>
          <Label
            htmlFor='description'
            className='mb-2 block text-sm font-semibold'
          >
            Description
          </Label>
          <Textarea id='description' name='description' />
        </div>
        <Button className='font-semibold'>Submit</Button>
      </form>
    </main>
  );
};

export default Dashboard;
