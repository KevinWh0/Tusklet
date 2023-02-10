import * as React from 'react';

type NextInputProps = {
  children?: React.ReactNode;
} & React.ComponentPropsWithRef<'div'>;

export default function Card({ children, ...rest }: NextInputProps) {
  const className = rest.className;
  rest.className = undefined;
  return (
    <>
      <div
        {...rest}
        className={`flex flex-col items-center justify-center place-self-center rounded-xl bg-slate-200 shadow dark:bg-slate-800 ${className}`}
      >
        {children}
      </div>
    </>
  );
}
