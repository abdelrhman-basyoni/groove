
// 'use strict';
import * as bizSdk from 'facebook-nodejs-business-sdk'
// const bizSdk = require('facebook-nodejs-business-sdk');
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;

const access_token = 'EAASOreMwe2wBAIStwTCvsJr7h0qGXXRA2EXtHkh6QBIMZBKeWK5Rxwxjk4GjKZC9wxxNGfm5Hrp04kAViciJPhlYJvqPkgda5KcDz8OFE78D9r3yooNqTHzAZCCoCHleOSlZBdNaseSgsxVduZAKSjeNvbB890WaOh1xMrQZCTA57HZByBAlS50sPGES1pYLQM6ngjWemS9XdROnX1zwphEYt1LT4z0JTG4xsQFYmlbCdn7ZBcvp6ZAoC';
const app_secret = 'b6886e70a4a828673f2249d1973a7f4f';
const app_id = '1282777398934380';
const id = '362100131';
const api = bizSdk.FacebookAdsApi.init(access_token);
const showDebugingInfo = true; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

export const logApiCallResult = (apiCallName, data) => {
  console.log(apiCallName);
  if (showDebugingInfo) {
    console.log('Data:' + JSON.stringify(data));
  }
};

let fields, params;
fields = [
];
params = {
  'name' : 'My campaign',
  'objective' : 'LINK_CLICKS',
  'status' : 'PAUSED',
  'special_ad_categories' : [],
};
const campaigns = (new AdAccount(id)).createCampaign(
  fields,
  params
);
// logApiCallResult('campaigns api call complete.', campaigns);

