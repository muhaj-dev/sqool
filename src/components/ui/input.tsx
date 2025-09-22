import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  togglePassword?: boolean; // Add this to conditionally show the toggle feature
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, togglePassword = false, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const handlePasswordToggle = () => {
      setIsPasswordVisible((prevState) => !prevState);
    };

    return (
      <div className="relative flex items-center">
        {icon && <span className="absolute left-3">{icon}</span>}
        <input
          type={togglePassword && isPasswordVisible ? 'text' : type}
          className={cn(
            'flex h-10 w-full outline-none rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            icon ? 'pl-10' : '',
            className
          )}
          ref={ref}
          {...props}
        />
        {togglePassword && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="absolute right-3 text-muted-foreground"
          >
            {isPasswordVisible ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeOffIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Icons for showing/hiding password
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 12C10.5304 12 11.0391 11.7893 11.4142 11.4142C11.7893 11.0391 12 10.5304 12 10C12 9.46957 11.7893 8.96086 11.4142 8.58579C11.0391 8.21071 10.5304 8 10 8C9.46957 8 8.96086 8.21071 8.58579 8.58579C8.21071 8.96086 8 9.46957 8 10C8 10.5304 8.21071 11.0391 8.58579 11.4142C8.96086 11.7893 9.46957 12 10 12Z" fill="#25324B"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.458008 10C1.73201 5.943 5.52201 3 10 3C14.478 3 18.268 5.943 19.542 10C18.268 14.057 14.478 17 10 17C5.52201 17 1.73201 14.057 0.458008 10ZM14 10C14 11.0609 13.5786 12.0783 12.8284 12.8284C12.0783 13.5786 11.0609 14 10 14C8.93914 14 7.92172 13.5786 7.17158 12.8284C6.42143 12.0783 6.00001 11.0609 6.00001 10C6.00001 8.93913 6.42143 7.92172 7.17158 7.17157C7.92172 6.42143 8.93914 6 10 6C11.0609 6 12.0783 6.42143 12.8284 7.17157C13.5786 7.92172 14 8.93913 14 10Z" fill="#25324B"/>
  </svg>
  
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223a10.477 10.477 0 00-.733 3.777c0 4.142 5.373 7.5 9 7.5 1.502 0 2.925-.308 4.197-.862M19.07 15.818C20.556 14.489 21.5 12.8 21.5 12c0-4.142-5.373-7.5-9-7.5-1.297 0-2.535.253-3.657.717M10.846 10.846A3 3 0 1015 12M6.194 6.194L17.808 17.808"
    />
  </svg>
);

export { Input };
