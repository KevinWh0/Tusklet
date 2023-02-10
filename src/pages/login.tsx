import * as React from 'react';

import { finishLogin, generateAuthURL } from '@/lib/mastrodon_lib/authenticate';
import { isURLMastodon, setURL } from '@/lib/mastrodon_lib/core';

import Button from '../components/buttons/Button';
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
      if (!state.token) return;
      setState({ ...state, token: state.token });
      finishLogin(state.token);
      location.href = '/post';
    } else {
      (async () => {
        if (await isURLMastodon(state.name)) {
          generateAuthURL(async (url: string | null) => {
            if (url) setState({ ...state, generatedURL: url });
          }, state.name);
        }else{
          alert("Error, that is not a mastodon URL")
        }
      })();
    }

    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Layout>
      <Seo templateTitle='Login' />

      <main className='grid min-h-screen bg-slate-200 shadow dark:bg-slate-900'>
        <div
          // variant="bordered"
          className='flex h-2/4 w-1/3 flex-col items-center justify-center place-self-center p-4'
          // css={{ mw: "400px", padding: "34px", paddingBottom: "0px" }}
        >
          <h1 className='mb-20 text-6xl text-black dark:text-white'>Tusklet</h1>

          {/* <Card.Body> */}
          {state.generatedURL ? (
            <div>
              <UnderlineLink
                href={state.generatedURL}
                target='_blank'
                color='secondary'
                className='mb-10 text-black dark:text-white'
              >
                Please authenticate this client here and copy the code
              </UnderlineLink>
            </div>
          ) : null}

          <div className='flex w-full rounded-xl p-1 focus:outline-none dark:bg-gray-700'>
            <Input
              placeholder={
                state.generatedURL ? 'Enter The Code' : 'Enter a domain'
              }
              onChange={input}
              inputRef={inputRef}
              className='text-l w-full flex-1 bg-transparent dark:text-white'
              // labelPlaceholder="Secondary"
              // css={{ width: "100%", marginTop: "12px" }}
              color='secondary'
            />

            <Button onClick={auth} className='m-4 min-h-0 min-w-0'>
              Next
            </Button>
          </div>

          {/* </Card.Body> */}
          {/* <Card.Divider /> */}

          {/* <Card.Footer */}
          {/* style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          > */}

          {/* </Card.Footer> */}
        </div>
      </main>
    </Layout>
  );
}
