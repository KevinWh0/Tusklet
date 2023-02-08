import * as React from 'react';


type NextInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>


export default function Input({
  ...rest
}: NextInputProps) {


  return (

    <input  {...rest}>
    </input>
  );
}
