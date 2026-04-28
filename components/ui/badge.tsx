import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'up' | 'down' | 'neutral';
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        {
          'bg-slate-700 text-slate-300': variant === 'default',
          'bg-emerald-500/15 text-emerald-400': variant === 'up',
          'bg-red-500/15 text-red-400': variant === 'down',
          'bg-slate-700/60 text-slate-400': variant === 'neutral',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
