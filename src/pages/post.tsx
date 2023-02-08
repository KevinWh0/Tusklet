import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import * as React from 'react';

import { login } from '@/lib/mastrodon_lib/authenticate';
import { events } from '@/lib/mastrodon_lib/core';
import { EmojiType, getCustomEmojis, getEmojiCache, setEmojiCache } from '@/lib/mastrodon_lib/customEmojis';
import { Media, toot, TootOptions } from '@/lib/mastrodon_lib/events/toot';

import Button from '@/components/buttons/Button';
import Card from '@/components/Card';

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
      .catch((e) => console.log(e));
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

    if (status)
      toot(status, medias, options).then((e) => {
        console.log(e);
      });
    //Clear
    if (inputRef.current) inputRef.current.value = "";
    if (contentWarningRef.current) contentWarningRef.current.value = "";
  }

  //Used for knowing where to insert emojis
  function saveSelectedArea() {
    setState({ ...state, selectStart: inputRef.current?.selectionStart || 0 });
  }

  function addEmojiToTextbox(emojiData: {
    shortcodes: string;
    native: string;
  }) {
    if (typeof inputRef.current?.value == "string") {
      const v = inputRef.current.value;
      inputRef.current.value =
        v.substring(0, state.selectStart) +
        (emojiData.native || emojiData.shortcodes) +
        v.substring(state.selectStart, v.length + 1);
    }
  }

  events.on("ready", async () => {
    const emojis = await getCustomEmojis();
    setEmojiCache(emojis);
    setState({ ...state, customEmojis: emojis });
  });

  // useEffect(() => {
  //   console.log(state.customEmojis, "Pog")
  // }, state.customEmojis);

  function toggleEmojiPicker() {
    setState({ ...state, showEmojiPicker: !state.showEmojiPicker });
    console.log(state);
  }

  // const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
  //   onDrop: ,
  // });

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
          files: [...images.files, { file: file, alt: "" }],
        });
      else alert("No more than 4 images are allowed");
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
      <Seo templateTitle='Login' />

      <main>
      <Card className='w-60'>

          <input
            // labelPlaceholder="Content Warning"
            // status="error"
            // css={{ marginBottom: "10px", marginTop: "10px" }}

            ref={contentWarningRef}
          />

          <textarea
            // width="100%"
            ref={inputRef}
            onSelect={saveSelectedArea}
            aria-label="Text Box"
          ></textarea>

          {state.showEmojiPicker ? (
            <Picker
              data={data}
              onEmojiSelect={addEmojiToTextbox}
              custom={[
                { id: "custom", name: "Custom", emojis: getEmojiCache() },
              ]}
            />
          ) : null}

          <label htmlFor="file-upload">
            Upload
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={fileUpload}
            value=""
            style={{ display: "none" }}
          />
          <Button
          
          onClick={toggleEmojiPicker}
          >
            😀
          </Button>
          {/* <Grid.Container>
            {images.files.map(function (file, i) {
              return (
                <Grid xs={6} key={i}>
                  <ImageHolder
                    file={file}
                    id={i}
                    //@ts-ignore
                    onDelete={deleteImage}
                    //@ts-ignore
                    setFile={(file: MastoFile) => {
                      setImages((prevState) => {
                        const newImages = [...prevState.files];
                        newImages[i] = file;
                        return { files: newImages };
                      });
                    }}
                  ></ImageHolder>
                </Grid>
              );
            })}
          </Grid.Container> */}

          <Button onClick={post}>
            Post
          </Button>
      </Card>
      </main>
    </Layout>
  );
}
