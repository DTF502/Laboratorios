interface Props {
  label?: string
  className?: string
}

export default function Spinner({ label = 'Carregant', className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}
