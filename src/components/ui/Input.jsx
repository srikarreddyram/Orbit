import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, className = '', icon: Icon, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-text-secondary font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? 'pl-10' : ''} ${
            error ? 'border-accent-red/50 focus:border-accent-red focus:ring-accent-red/20' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-accent-red">{error}</span>
      )}
    </div>
  )
})

export default Input

export function TextArea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-text-secondary font-medium">
          {label}
        </label>
      )}
      <textarea
        className={`input-field min-h-[100px] resize-y ${
          error ? 'border-accent-red/50 focus:border-accent-red focus:ring-accent-red/20' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-accent-red">{error}</span>
      )}
    </div>
  )
}

export function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-text-secondary font-medium">
          {label}
        </label>
      )}
      <select
        className={`input-field appearance-none bg-no-repeat bg-right pr-10 ${
          error ? 'border-accent-red/50' : ''
        } ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b6b8a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundPosition: 'right 12px center',
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-accent-red">{error}</span>}
    </div>
  )
}
