import * as React from 'react';

type NextInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function Input({ ...rest }: NextInputProps) {
  const className = rest.className;
  rest.className = undefined;
  return (
    <input
      {...rest}
      className={`rounded-xl border-slate-400 px-3 py-5 ${className}`}
    ></input>
  );
}
