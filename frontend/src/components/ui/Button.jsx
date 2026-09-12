/**
 * Button Component
 * 
 * Fully reusable button component following the design system.
 * 
 * Design System Specifications:
 * - Font size: 18px (button)
 * - Padding: horizontal = 32px, vertical = 12px
 * - Border radius: Fully rounded (pill)
 * - Variants: primary, secondary, outline
 * - States: default, hover, disabled
 * - RTL support with icon alignment
 * 
 * @param {string} variant - Button variant: 'primary', 'secondary', 'outline'
 * @param {React.ReactNode} children - Button content
 * @param {React.ReactNode} icon - Optional icon (RTL aligned)
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props to pass to button element
 */
function Button({ 
  variant = 'primary', 
  children, 
  icon,
  disabled = false,
  className = '',
  ...props 
}) {
  // Base styles: font size 18px SemiBold (per typography guide), fully rounded (pill), transition
  const baseStyles = 'text-button font-semibold rounded-full transition-all duration-200 focus:outline-none disabled:cursor-not-allowed inline-flex items-center justify-center gap-2'
  
  // Padding: horizontal = 32px, vertical = 12px
  const paddingStyles = 'px-[32px] py-[12px]'
  
  // Variant styles using design system colors
  const variants = {
    primary: disabled
      ? 'bg-text-disabled text-white'
      : 'bg-primary text-white hover:opacity-90 active:opacity-80',
    secondary: disabled
      ? 'bg-text-disabled text-white'
      : 'bg-secondary text-white hover:opacity-90 active:opacity-80',
    outline: disabled
      ? 'border-2 border-text-disabled text-text-disabled bg-transparent'
      : 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white active:opacity-80',
  }
  
  return (
    <button
      className={`${baseStyles} ${paddingStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {/* Icon with RTL support - appears before text in RTL */}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}

export default Button
