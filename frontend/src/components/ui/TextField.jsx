import { useState } from 'react'

/**
 * TextField Component
 * 
 * Fully reusable text input component following the design system.
 * 
 * Design System Specifications:
 * - Font size: 16px (body-md)
 * - Padding: horizontal = 1.5x font size (24px), vertical = 1x font size (16px)
 * - Border radius: Fully rounded (pill)
 * - States: default, focus, success, error, disabled
 * - Password type with visibility toggle
 * - RTL support
 * 
 * @param {string} label - Optional label text
 * @param {string} placeholder - Placeholder text
 * @param {string} helperText - Optional helper/error text
 * @param {string} state - Field state: 'default', 'focus', 'success', 'error', 'disabled'
 * @param {string} type - Input type: 'text', 'password', 'email', etc.
 * @param {string} value - Controlled input value
 * @param {function} onChange - Change handler
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props to pass to input element
 */
function TextField({
  label,
  placeholder,
  helperText,
  state = 'default',
  type = 'text',
  value,
  onChange,
  disabled = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  // Determine if password type
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type
  
  // Determine effective state (focus takes precedence if input is focused)
  const effectiveState = isFocused && state === 'default' ? 'focus' : state
  
  // Base styles: font size 16px, fully rounded (pill)
  const baseStyles = 'text-body-md font-normal rounded-full transition-all duration-200 w-full focus:outline-none'
  
  // Padding: horizontal = 1.5x font size (24px), vertical = 1x font size (16px)
  const paddingStyles = 'px-[24px] py-[16px]'
  
  // State styles using design system colors
  const stateStyles = {
    default: disabled
      ? 'border-2 border-text-disabled bg-transparent text-text-disabled cursor-not-allowed'
      : 'border-2 border-text-secondary bg-transparent text-text-primary placeholder:text-text-secondary',
    focus: 'border-2 border-primary bg-transparent text-text-primary placeholder:text-text-secondary',
    success: 'border-2 border-success bg-transparent text-text-primary placeholder:text-text-secondary',
    error: 'border-2 border-error bg-transparent text-text-primary placeholder:text-text-secondary',
    disabled: 'border-2 border-text-disabled bg-transparent text-text-disabled cursor-not-allowed',
  }
  
  // Helper text styles
  const helperTextStyles = {
    default: 'text-text-secondary',
    focus: 'text-text-secondary',
    success: 'text-success',
    error: 'text-error',
    disabled: 'text-text-disabled',
  }
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label - 18px SemiBold per typography guide */}
      {label && (
        <label className="block text-body-lg font-semibold text-text-primary mb-2">
          {label}
        </label>
      )}
      
      {/* Input wrapper with password toggle */}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled || effectiveState === 'disabled'}
          className={`${baseStyles} ${paddingStyles} ${stateStyles[effectiveState]} ${isPassword ? 'pr-[60px]' : ''}`}
          {...props}
        />
        
        {/* Password visibility toggle */}
        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-[24px] top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m13.42 13.42l-3.29-3.29m0 0a3 3 0 01-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      {/* Helper text */}
      {helperText && (
        <p className={`text-body-md font-normal mt-2 ${helperTextStyles[effectiveState]}`}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export default TextField
