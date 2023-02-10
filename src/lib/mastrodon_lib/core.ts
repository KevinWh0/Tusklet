// import localStorageDriver from "unstorage/drivers/localstorage";
import axios from 'axios';
import EventEmitter from 'events';
import generator, { MegalodonInterface } from 'megalodon';
// import { LocalStorageDriver } from "../localStore_lib/drivers/LocalStorage";
import * as Storage from 'ts-storage';

export const events = new EventEmitter();

let url: string;

export function setURL(newUrl: string) {
  url = newUrl;
  client = generator('mastodon', `https://${url}`);
  const currentSaveId = datastore.get('currentSaveId', 0).value;
  datastore.set(`profiles.${currentSaveId}.url`, url);
}

export let clientId: string;
export let clientSecret: string;

type Profile = {
  clientId: string;
  clientSecret: string;
  url: string;
  token: string;
};

export const datastore = Storage;

// datastore.set("currentProfile", currentSaveId);
// (async () => {
//   const defaultVal: any = (await datastore.hasItem("profiles"))
//     ? ((await datastore.getItem("profiles")) as Array<any>).length
//     : 0;
//   currentSaveId = (await datastore.hasItem("currentProfile"))
//     ? await datastore.getItem("currentProfile")
//     : defaultVal;
// })();

export function setClientData(newClientId: string, newClientSecret: string) {
  const currentSaveId = datastore.get('currentSaveId', 0).value;

  clientId = newClientId;
  clientSecret = newClientSecret;

  datastore.set(`profiles.${currentSaveId}.clientId`, newClientId);
  datastore.set(`profiles.${currentSaveId}.clientSecret`, newClientSecret);
}
//Add events to the client type

export let client: MegalodonInterface;

export function setToken(token: string | null) {
  client = generator('mastodon', `https://${url}`, token);
  const currentSaveId = datastore.get('currentSaveId', 0).value;

  if (token) datastore.set(`profiles.${currentSaveId}.token`, token);
  datastore.set(`profiles.${currentSaveId}.url`, url);

  events.emit('ready');
}

export async function loadSaveId(
  saveId: string | null = datastore.get('currentSaveId', '0').value
) {
  if (saveId) datastore.set('currentSaveId', saveId);
  else console.error(`saveId is undefined`);

  setURL(datastore.get(`profiles.${saveId}.url`, '').value);

  setClientData(
    datastore.get(`profiles.${saveId}.clientId`, '').value,
    datastore.get(`profiles.${saveId}.clientSecret`, '').value
  );

  setToken(datastore.get(`profiles.${saveId}.token`, '').value);
}

export async function isURLMastodon(url: string) {
  try {
    const response = await axios.get(`https://${url}/api/v1/instance`);
    return response.data.uri === url;
  } catch (error) {
    return false;
  }
}
