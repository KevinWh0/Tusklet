import React from 'react';

export interface FileWithPath extends File {
  readonly path?: string;
}

export type MastoFile = {
  file: FileWithPath;
  alt: string;
};

export function ImageHolder(props: {
  file: MastoFile;
  id: number;
  setFile?: (file: MastoFile) => void;
  onDelete?: (id: number) => void;
}) {
  const [visible, setVisible] = React.useState(false);
  const [altText, setAltText] = React.useState('');

  const closeHandler = () => {
    setVisible(false);
  };

  const saveAndClose = () => {
    if (props.setFile) props.setFile({ file: props.file?.file, alt: altText });
    closeHandler();
  };

  //   let file: FileWithPath | null = null;
  // let altText = "";
  const imgLocalURL = URL.createObjectURL(props.file?.file as File);
  return (
    <>
      {/* <Card css={{ padding: '10px' }}>
        <Card
          css={{
            width: '100%',
            height: '180px',
            borderRadius: 'var(--nextui-radii-lg)',
            backgroundImage: `url("${imgLocalURL}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <Card
            css={{
              width: '100%',
              height: '34px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '0px',
              padding: '3px',
              paddingLeft: '15px',
            }}
          >
            <Text
              color='white'
              css={{
                textGradient: '45deg, white -20%, transparent 90%',
              }}
            >
              {props.file?.file.name}
            </Text>
            <Text
              color='red'
              style={{
                position: 'absolute',
                right: '0px',
                paddingRight: '6px',
              }}
              onClick={() => {
                if (props.onDelete) props.onDelete(props.id);
              }}
            >
              X
            </Text>

          </Card>
          <Text
            color='red'
            style={{
              position: 'absolute',
              right: '0px',
              bottom: '0px',
              paddingRight: '16px',
              paddingBottom: '6px',
            }}
            onClick={() => {
              setVisible(true);
            }}
          >
            E
          </Text>
        </Card>
      </Card>


      <Modal
        closeButton
        aria-labelledby='modal-title'
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id='modal-title' size={18}>
            Describe the image
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Card
            css={{
              width: '100%',
              height: '180px',
              borderRadius: 'var(--nextui-radii-lg)',
              backgroundImage: `url("${imgLocalURL}")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
            }}
            children={null}
          ></Card>
          <Textarea
            width='100%'
            aria-label='Text Box'
            value={altText}
            onChange={(e: BaseSyntheticEvent) => {
              setAltText(e.target.value);
            }}
          ></Textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color='error' onPress={closeHandler}>
            Close
          </Button>
          <Button auto onPress={saveAndClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
}
