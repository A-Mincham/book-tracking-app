interface ProgressBarProps {
  percentage: number;
  color?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar = ({
  percentage,
  color = 'blue',
  showText = true,
  size = 'md'
}: ProgressBarProps) => {
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const height = heights[size];

  return (
    <div className="relative w-full">
      <div className={`w-full bg-gray-200 rounded-full ${height} dark:bg-gray-700`}>
        <div
          className={`${height} bg-${color}-600 rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <span className="absolute right-0 -top-6 text-sm text-gray-600 dark:text-gray-300">
          {percentage}%
        </span>
      )}
    </div>
  );
}; 