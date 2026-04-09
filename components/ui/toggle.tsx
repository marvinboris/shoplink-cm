'use client';

import { forwardRef, InputHTMLAttributes, useCallback } from 'react';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  description?: string;
  onChange?: (checked: boolean) => void;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, id, checked, onChange, disabled, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        onChange?.(e.target.checked);
      },
      [onChange, disabled]
    );

    return (
      <label className={`flex items-center gap-3 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="relative">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            id={id}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />
          <div className="h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-primary" />
          <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-text-1 font-body">{label}</span>
            )}
            {description && (
              <span className="text-xs text-text-3">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
