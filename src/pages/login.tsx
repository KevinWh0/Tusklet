import * as React from 'react';

import { finishLogin, generateAuthURL } from '@/lib/mastrodon_lib/authenticate';
import { setURL } from '@/lib/mastrodon_lib/core';

import Button from '../components/buttons/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Layout from '../components/layout/Layout';
import UnderlineLink from '../components/links/UnderlineLink';
import Seo from '../components/Seo';

export default function LoginPage() {
  const [state, setState] = React.useState<{
    name: string;
    generatedURL: string;
    token: string;
  }>({
    name: '',
    generatedURL: '',
    token: '',
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  const input = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (state.generatedURL) {
      setState({ ...state, token: event.target.value });
    } else {
      setURL(event.target.value);
      setState({ ...state, name: event.target.value });
    }
  };

  const auth = () => {
    if (state.generatedURL) {
      // if (inputRef.current) {
      // console.log(inputRef.current.value)
      setState({ ...state, token: state.token });
      finishLogin(state.token);
      // }
    } else {
      generateAuthURL(async (url: string | null) => {
        if (url) setState({ ...state, generatedURL: url });
      }, state.name);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Layout>
      <Seo templateTitle='Login' />

      <main className='grid min-h-screen bg-slate-200 shadow dark:bg-slate-900'>
        <Card
          // variant="bordered"
          className='h-2/4 w-1/3 p-4'
          // css={{ mw: "400px", padding: "34px", paddingBottom: "0px" }}
        >
          {/* <Card.Body> */}
          {state.generatedURL ? (
            <div>
              <UnderlineLink
                href={state.generatedURL}
                target='_blank'
                color='secondary'
                className='text-black dark:text-white'
              >
                Please authenticate this client here and copy the code
              </UnderlineLink>
            </div>
          ) : null}
          <Input
            placeholder={
              state.generatedURL ? 'Enter The Code' : 'Enter a domain'
            }
            onChange={input}
            ref={inputRef}
            className='m-8 min-h-0 min-w-0'
            // labelPlaceholder="Secondary"
            // css={{ width: "100%", marginTop: "12px" }}
            color='secondary'
          />
          {/* </Card.Body> */}
          {/* <Card.Divider /> */}

          {/* <Card.Footer */}
          {/* style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          > */}
          <Button onClick={auth} className='m-4 min-h-0 min-w-0'>
            Next
          </Button>
          {/* </Card.Footer> */}
        </Card>
      </main>
    </Layout>
  );
}
