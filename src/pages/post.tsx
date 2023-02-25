import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import * as React from 'react';
import {
  BsClipboardData,
  BsEmojiSmileUpsideDown,
  BsExclamationTriangle,
  BsUpload,
} from 'react-icons/bs';
import { FaGlobeAmericas } from 'react-icons/fa';
import { HiLanguage } from 'react-icons/hi2';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { login } from '@/lib/mastrodon_lib/authenticate';
import { events } from '@/lib/mastrodon_lib/core';
import {
  EmojiType,
  getCustomEmojis,
  getEmojiCache,
  setEmojiCache,
} from '@/lib/mastrodon_lib/customEmojis';
import { Media, toot, TootOptions } from '@/lib/mastrodon_lib/events/toot';

import Button from '@/components/buttons/Button';
import Card from '@/components/Card';
import { ImageHolder } from '@/components/ImageHolder';
import Input from '@/components/Input';

import Layout from '../components/layout/Layout';
import Seo from '../components/Seo';

export interface FileWithPath extends File {
  readonly path?: string;
}

export type MastoFile = {
  file: FileWithPath;
  alt: string;
};

export default function LoginPage() {
  const [loginSuccess, setloginSuccess] = React.useState(false);
  React.useEffect(() => {
    if (!loginSuccess) {
      login()
        .then(() => setloginSuccess(true))
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch((e) => {
          console.log(e.url);
        });
    }
  }, [loginSuccess]);

  const [state, setState] = React.useState<{
    showEmojiPicker: boolean;
    selectStart: number;
    customEmojis: EmojiType[];
  }>({
    showEmojiPicker: false,
    selectStart: 0,
    customEmojis: [],
  });

  const [images, setImages] = React.useState<{
    files: MastoFile[];
  }>({
    files: [],
  });

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const contentWarningRef = React.useRef<HTMLInputElement>(null);

  function post() {
    const status = inputRef.current?.value;
    const contentWarning = contentWarningRef.current?.value;

    const options: TootOptions = {};
    if (contentWarning) options.spoiler_text = contentWarning;

    const medias: Media[] = [];

    for (const m of images.files) {
      medias.push({ media: m.file, description: m.alt });
    }

    if (status) {
      const post = toot(status, medias, options);

      toast.promise(post, {
        pending: 'Posting...',
        success: 'Posted Toot!',
        error: 'Count not post toot ):',
      });
    }
    //Clear
    if (inputRef.current) inputRef.current.value = '';
    if (contentWarningRef.current) contentWarningRef.current.value = '';
  }

  //Used for knowing where to insert emojis
  function saveSelectedArea() {
    setState({ ...state, selectStart: inputRef.current?.selectionStart || 0 });
  }

  function addEmojiToTextbox(emojiData: {
    shortcodes: string;
    native: string;
  }) {
    if (typeof inputRef.current?.value == 'string') {
      const v = inputRef.current.value;
      inputRef.current.value =
        v.substring(0, state.selectStart) +
        `${emojiData.native || emojiData.shortcodes} ` +
        v.substring(state.selectStart, v.length + 1);
    }
  }

  events.on('ready', async () => {
    const emojis = await getCustomEmojis();
    setEmojiCache(emojis);
    setState({ ...state, customEmojis: emojis });
  });

  function toggleEmojiPicker() {
    setState({ ...state, showEmojiPicker: !state.showEmojiPicker });
  }

  function fileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const files = e.target.files;
    e.target.files = null;

    for (let i = 0; i < files.length; i++) {
      //FileWithPaths can be uploaded directly
      const file = files[i];
      //No more than 4 images.
      if (images.files.length < 5)
        setImages({
          ...images,
          files: [...images.files, { file: file, alt: '' }],
        });
      else alert('No more than 4 images are allowed');
    }
  }

  function deleteImage(id: number) {
    setImages((prevState) => ({
      ...images,
      files: prevState.files.filter((image, index) => index !== id),
    }));
  }

  return (
    <Layout>
      <Seo templateTitle='Post' />

      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
      <main>
        <Card className='w-80 px-2 py-6'>
          <Input
            // labelPlaceholder="Content Warning"
            // status="error"
            // css={{ marginBottom: "10px", marginTop: "10px" }}
            placeholder='Content Warning'
            className='mb-2 w-11/12 px-2 py-3'
            ref={contentWarningRef}
          />
          <div className='flex h-36 w-11/12 flex-col rounded-xl border-none border-slate-400 outline-none dark:bg-gray-700 dark:text-white'>
            <textarea
              ref={inputRef}
              onSelect={saveSelectedArea}
              placeholder='Whats on your mind?'
              className='h-full w-full resize-none rounded-t-xl border-none bg-transparent px-3 py-2 outline-none dark:text-white'
            ></textarea>
            <div className='flex h-8 w-full items-center rounded-b-xl bg-slate-100 dark:bg-slate-600'>
              <button
                onClick={toggleEmojiPicker}
                className='mx-2 rounded-xl p-1 hover:bg-slate-400'
              >
                <BsEmojiSmileUpsideDown></BsEmojiSmileUpsideDown>
              </button>
              {/* <button className='py-3 px-2'>
                <BsUpload></BsUpload>
              </button> */}
              <label
                htmlFor='file-upload'
                className='mx-2 cursor-pointer rounded-xl p-1 hover:bg-slate-400'
              >
                <BsUpload></BsUpload>
              </label>
              <button className='mx-2 rounded-xl p-1 hover:bg-slate-400'>
                <BsExclamationTriangle></BsExclamationTriangle>
              </button>
              <button className='mx-2 rounded-xl p-1 hover:bg-slate-400'>
                <BsClipboardData></BsClipboardData>
              </button>
              <button className='mx-2 rounded-xl p-1 hover:bg-slate-400'>
                <FaGlobeAmericas></FaGlobeAmericas>
              </button>
              <button className='mx-2 rounded-xl p-1 hover:bg-slate-400'>
                <HiLanguage></HiLanguage>
              </button>
              <div className='flex h-full flex-1 items-center justify-end'>
                <p className='p-3'>{inputRef.current?.value.length || 0}</p>
              </div>
            </div>
          </div>

          {state.showEmojiPicker ? (
            <Picker
              data={data}
              onEmojiSelect={addEmojiToTextbox}
              custom={[
                { id: 'custom', name: 'Custom', emojis: getEmojiCache() },
              ]}
            />
          ) : null}

          <input
            id='file-upload'
            type='file'
            onChange={fileUpload}
            value=''
            style={{ display: 'none' }}
          />
          {/* <Button onClick={toggleEmojiPicker}>😀</Button> */}
          <div>
            {images.files.map(function (file, i) {
              return (
                <ImageHolder
                  file={file}
                  id={i}
                  key={i}
                  // onDelete={deleteImage}
                  // setFile={(file: MastoFile) => {
                  //   setImages((prevState) => {
                  //     const newImages = [...prevState.files];
                  //     newImages[i] = file;
                  //     return { files: newImages };
                  //   });
                  // }}
                ></ImageHolder>
              );
            })}
          </div>

          <div className='flex w-11/12 justify-end pt-2'>
            <Button onClick={post} className='relative right-0'>
              Post
            </Button>
          </div>
        </Card>
      </main>
    </Layout>
  );
}
