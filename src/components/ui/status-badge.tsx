import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 
    | 'Success' | 'Failed' | 'Processing' 
    | 'Active' | 'Inactive' | 'Upcoming' | 'Ongoing' | 'Completed'
    | 'paid' | 'not paid' | 'processing'; // Add payment statuses
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Success':
      case 'Active':
      case 'Completed':
      case 'paid': // Add paid to success styles
        return 'bg-success/10 text-success border-success/20';
      case 'Failed':
      case 'Inactive':
      case 'not paid': // Add not paid to destructive styles
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Processing':
      case 'Ongoing':
      case 'processing': // Add processing to processing styles
        return 'bg-processing/10 text-processing border-processing/20';
      case 'Upcoming':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </span>
  );
}