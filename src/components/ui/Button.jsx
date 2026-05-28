import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3',
  icon: 'p-2.5',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    icon: Icon,
    iconRight: IconRight,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        inline-flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={16} />}
    </button>
  )
})

export default Button
