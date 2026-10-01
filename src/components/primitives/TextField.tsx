import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { iconProps, Info, type IconComponent } from './Icon';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hideLabel?: boolean;
  icon?: IconComponent;
  trailing?: ReactNode;
  hint?: string;
  error?: string;
  demoState?: 'focused';
}

/** Base for search fields, quantity fields and ingredient fields. */
export function TextField({ label, hideLabel, icon: Icon, trailing, hint, error, demoState, disabled, className = '', ...input }: TextFieldProps) {
  const id = useId();
  const msgId = `${id}-msg`;
  const message = error ?? hint;
  return (
    <div className={`dl-field ${disabled ? 'dl-field--disabled' : ''} ${className}`} data-invalid={error ? 'true' : undefined}>
      {label ? <label htmlFor={id} className={hideLabel ? 'dl-visually-hidden' : 'dl-field__label'}>{label}</label> : null}
      <div className="dl-field__control" data-state={demoState}>
        {Icon ? <Icon {...iconProps(20)} /> : null}
        <input id={id} className="dl-field__input" disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={message ? msgId : undefined} {...input} />
        {trailing}
      </div>
      {message ? (
        <div id={msgId} className="dl-field__message" role={error ? 'alert' : undefined}>
          {error ? <Info {...iconProps(16)} /> : null}
          <span>{message}</span>
        </div>
      ) : null}
    </div>
  );
}
