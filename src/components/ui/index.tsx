import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
  const base =
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[15px] font-medium tracking-tight transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-ink text-white shadow-sm hover:bg-black hover:shadow-md',
    secondary: 'bg-white text-ink border border-black/10 shadow-sm hover:bg-black/[0.03]',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    ghost: 'text-ink-soft hover:bg-black/5',
  }
  return <button className={cx(base, variants[variant], className)} {...props} />
}

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="mb-1.5 block text-[13px] font-medium text-ink-soft" {...props} />
}

const fieldBase =
  'w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-shadow placeholder:text-black/30 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(fieldBase, className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(fieldBase, className)} {...props} />
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx(fieldBase, className)} {...props} />
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx('rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]', className)}
      {...props}
    />
  )
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null
  return <p className="mt-2 text-[13px] text-red-600">{children}</p>
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[19px] font-semibold tracking-tight text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft transition hover:bg-black/5"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
