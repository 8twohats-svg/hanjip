type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const percent = (current / total) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted mb-2">
        <span>
          {current} / {total}
        </span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
