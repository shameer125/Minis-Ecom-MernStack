export function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div className={`${s} border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Spinner size="lg" />
    </div>
  );
}

export function StarRating({ rating, count, size = 'sm' }) {
  const s = size === 'sm' ? 'text-xs' : 'text-base';
  return (
    <div className={`flex items-center gap-1 ${s}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
      ))}
      {count !== undefined && <span className="text-gray-400 ml-1">({count})</span>}
    </div>
  );
}
