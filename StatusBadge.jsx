// Maps a status string to a consistent color everywhere it appears in the app.
export default function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase()
  const className =
    normalized === 'approved'
      ? 'badge badge-approved'
      : normalized === 'rejected'
      ? 'badge badge-rejected'
      : 'badge badge-pending'

  return <span className={className}>{status}</span>
}
