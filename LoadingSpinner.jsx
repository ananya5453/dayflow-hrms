export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-2 text-slate-500 text-sm py-6 justify-center">
      <span className="h-4 w-4 rounded-full border-2 border-flow border-t-transparent animate-spin" />
      {label}
    </div>
  )
}
