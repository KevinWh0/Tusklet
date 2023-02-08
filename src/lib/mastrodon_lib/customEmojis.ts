import { client, datastore } from './core';
import { parseJSON } from './json';

export type EmojiType = {
  id: string;
  name: string;
  keywords: string[];
  skins: { src: string }[];
};

export type EmojiCategoryType = {
  id: string;
  name: string;
  emojis: EmojiType[];
};

export async function getCustomEmojis(): Promise<EmojiType[]> {
  let newEmojis: EmojiType[] = [];

  if (Date.now() - getLastUpdate() > 1000 * 60 * 60 * 12) {
    const emojis = await (await client.getInstanceCustomEmojis()).data;

    for (let i = 0; i < emojis.length; i++) {
      const emoji = emojis[i];

      newEmojis.push({
        name: emoji.shortcode,
        id: emoji.shortcode,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        keywords: [emoji.shortcode, emoji.category || ''],
        skins: [{ src: emoji.static_url }],
      });
    }
  } else {
    newEmojis = getEmojiCache() || [];
  }

  return newEmojis;
}

export function setEmojiCache(emojiCache: EmojiType[]) {
  if (emojiCache.length == 0) return;
  datastore.set(
    `emojiCache.${datastore.get('currentSaveId', 0).value}`,
    parseJSON(emojiCache, [])
  );

  datastore.set(
    `emojiCache.${datastore.get('currentSaveId', 0).value}.lastUpdate`,
    Date.now()
  );
}

export function getLastUpdate() {
  return datastore.get(
    `emojiCache.${datastore.get('currentSaveId', 0).value}.lastUpdate`,
    -1
  ).value;
}

export function getEmojiCache(): EmojiType[] | null {
  try {
    return (
      JSON.parse(
        datastore.get(
          `emojiCache.${datastore.get('currentSaveId', '0').value}`,
          ''
        ).value
      ) || null
    );
  } catch (error) {
    return null;
  }
}
