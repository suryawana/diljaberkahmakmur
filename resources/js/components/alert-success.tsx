import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircleIcon } from 'lucide-react';

export default function AlertSuccess({
    message,
    title,
}: {
    message: string;
    title?: string;
}) {
    return (
        <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
            <CheckCircleIcon className="text-green-600" />
            <AlertTitle>{title || 'Success!'}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
