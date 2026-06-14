"use client";

import type { ReactNode } from "react";
import { AlertCircle, Calendar, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

var baseInput =
  "w-full rounded-xl border bg-white/50 dark:bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 dark:text-rose-pale transition-all duration-200";

function inputCls(hasError?: boolean) {
  return `${baseInput} ${
    hasError
      ? "border-red-500/60 focus:ring-red-400/40 focus:border-red-500"
      : "border-or/20 dark:border-or/30 focus:ring-or/40 focus:border-or"
  }`;
}

function Asterisk() {
  return <span className="text-red-500" aria-hidden="true"> *</span>;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </p>
  );
}

export function Field({
  label, name, type, required, value, onChange, onBlur, error,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-display italic text-rose-sombre text-sm mb-1 block">
        {label}
        {required && <Asterisk />}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputCls(!!error)}
      />
      <div id={`${name}-error`}>
        <FieldError message={error} />
      </div>
    </div>
  );
}

export function SelectField({
  label, name, required, value, onChange, onBlur, error, children, icon: Icon,
}: {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-display italic text-rose-sombre text-sm mb-1 block">
        {label}
        {required && <Asterisk />}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-or" />
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error}
          className={`${inputCls(!!error)} appearance-none ${Icon ? "pl-10" : ""} pr-10 cursor-pointer bg-white/70 dark:bg-[#2a1a1d]/80`}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-or" />
      </div>
      <FieldError message={error} />
    </div>
  );
}

export function DateField({
  label, name, value, onChange, onBlur, error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
}) {
  var today = new Date().toISOString().split("T")[0];
  return (
    <div>
      <label htmlFor={name} className="font-display italic text-rose-sombre text-sm mb-1 block">
        {label}
      </label>
      <div className="relative">
        <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-or" />
        <input
          id={name}
          name={name}
          type="date"
          min={today}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error}
          className={`${inputCls(!!error)} pl-10 [color-scheme:light] dark:[color-scheme:dark]`}
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

export function TextAreaField({
  label, name, value, onChange, onBlur, error, rows = 4,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-display italic text-rose-sombre text-sm mb-1 block">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        className={inputCls(!!error)}
      />
      <FieldError message={error} />
    </div>
  );
}
