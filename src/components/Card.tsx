import * as React from 'react';


type NextInputProps = { children?: React.ReactNode; } & React.ComponentPropsWithRef<'div'>;


export default function Card({
  children,
  ...rest
}: NextInputProps) {

  return (
    <>
    <div className={"bg-slate-200 dark:bg-slate-800 rounded-3xl " + rest.className}  {...rest}>
      {children}
    </div>
    </>
  );
}
