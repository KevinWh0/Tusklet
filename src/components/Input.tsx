import * as React from 'react';

type NextInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  inputRef?: React.Ref<HTMLInputElement>;
};

export default function Input({ inputRef, ...rest }: NextInputProps) {
  const className = rest.className;
  rest.className = undefined;
  return (
    <input
      ref={inputRef}
      {...rest}
      className={`rounded-xl border-slate-400 px-3 py-5 ${className}`}
    ></input>
  );
}

