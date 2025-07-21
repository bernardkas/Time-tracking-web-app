import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import BackButton from '../ui-reusable/back-button';

const ErrorCard = () => {
  return (
    <div className='flex justify-center my-10'>
      <Card className='w-[400px] shadow-md'>
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
        </CardHeader>

        <CardFooter>
          <BackButton label='Back to home' href='/' />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorCard;
