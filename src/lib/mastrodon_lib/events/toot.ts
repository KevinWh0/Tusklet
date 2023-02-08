import * as fs from 'fs';
import { Response } from 'megalodon';

import { client } from '../core';
// import { type } from "os";

export type TootOptions = {
  media_ids?: Array<string>;
  poll?: {
    options: Array<string>;
    expires_in: number;
    multiple?: boolean;
    hide_totals?: boolean;
  };
  in_reply_to_id?: string;
  sensitive?: boolean;
  spoiler_text?: string;
  visibility?: 'public' | 'unlisted' | 'private' | 'direct';
  scheduled_at?: string;
  language?: string;
  quote_id?: string;
};

export type Media = {
  media: fs.ReadStream | File;
  description?: string;
  focus?: string; // comma seperated -1.0,1.0 for cropping
};

export async function toot(
  status: string,
  medias?: Media[],
  options?: TootOptions
): Promise<Entity.Status> {
  options = options || {};
  const mediaIds: Array<string> = [];
  if (medias)
    for (const media of medias) {
      const resp: Response<Entity.Attachment | Entity.Attachment> =
        await client.uploadMedia(media.media, {
          description: media.description,
          focus: media.focus,
        });

      mediaIds.push(resp.data.id);
    }
  if (mediaIds) options.media_ids = mediaIds;

  return new Promise((resolve) => {
    client
      .postStatus(status, options)
      .then((res: Response<Entity.Status>) => {
        // console.log(res);
        resolve(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
