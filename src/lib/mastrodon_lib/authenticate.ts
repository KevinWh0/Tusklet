import { MegalodonInterface, OAuth } from 'megalodon';

import {
  client,
  clientId,
  clientSecret,
  datastore,
  loadSaveId,
  setClientData,
  setToken,
  setURL,
} from './core';

const SCOPES: Array<string> = ['read', 'write', 'follow'];

type AuthData = {
  clientId: string;
  clientSecret: string;
  authURL: string | null;
};
/**
 * This should only be ran once to authenticate that this client is allowed.
 * @param client
 * @returns
 */
export async function getAuthData(client: MegalodonInterface) {
  const appData = await client.registerApp('Tusklet', {
    website: 'https://github.com/KevinWh0',
    scopes: SCOPES,
    // redirect_uris: ""
  });
  //   console.log("Authorization URL is generated.");
  return appData;
}

let auth: Promise<object | OAuth.AppData>;

export async function generateAuthURL(instanceUrl: string): Promise<string | null> {
  setURL(instanceUrl);

  const appData = await getAuthData(client);
  setClientData(appData.clientId, appData.clientSecret);

  return appData.url;
}


// export function generateAuthURL(
//   authCodePromise: (url: string | null) => void,
//   newURL: string
// ) {
//   setURL(newURL);

//   auth = getAuthData(client).then(async (appData) => {
//     setClientData(appData.clientId, appData.clientSecret);
//     authCodePromise(appData.url);
//     return appData;
//   });
// }

export function finishLogin(authKey: string) {
  if (auth)
    auth
      .then(async (appData) => {
        return authKey;
      })
      .then((code: string) => {
        return client.fetchAccessToken(clientId, clientSecret, code);
      })
      .then((tokenData: OAuth.TokenData) => {
        setToken(tokenData.accessToken);

        datastore.set(
          'currentProfile',
          datastore.get('currentSaveId', 0).value
        );
        datastore.set('totalProfiles', datastore.get('currentSaveId', 0).value);
      })
      .catch((err) => {
        console.error('fetching token failed', err);
      });
}

const NULL = -1;
export async function login() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    if (datastore.get('currentProfile', NULL).value != NULL) {
      loadSaveId();
      resolve();
    } else {
      reject('Profile has not been made yet');
    }
  });
}

// export {};
