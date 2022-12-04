import axios from 'axios';


import { Store } from 'react-notifications-component';

axios.defaults.headers.common['Content-Type'] = 'application/json';





export function displayError({ title, message }) {

  Store.addNotification({
    title: title,
    message: message,
    type: 'danger',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 4000,
      showIcon: true,
      onScreen: true
    }
  });
};

export function displaySuccess({ title, message }) {

  Store.addNotification({
    title: title,
    message: message,
    type: 'success',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 2000,
      showIcon: true,
      onScreen: true
    }
  });
};
/**
 * this is not secure by any means
 * in real enviroment the access token account id  should be hidden in the backend server and
 * this is for demonstration purposes only
 */
/** fill these values */
export const convertRate = 1; // this conversion rate to handle Egp to dollar , set it to 1 if u want it to be according to your add acount currency 
const access_token = ''; //add the account token
const page_access_token = ''
const app_secret = '';
const app_id = '';
const addAccount = ``;
/** end of values to be filled  */
const fbUrl = 'https://graph.facebook.com/v15.0'
export async function postToFacebook(path, body, config) {
  try {
    const response = await axios
      .create({
        baseURL: fbUrl
      })
      .post(path, body, config);
    // console.log(response)
    return response.data

  } catch (error) {
    console.log({ error })
    const err = error?.response?.data?.error
    const title = err?.error_user_title || 'Error'
    const message = err?.error_user_msg || err?.message || 'something went wrong'

    displayError({ title, message })
    return null
  }

}
export async function getFromFacebook(path, config) {
  try {
    const response = await axios
      .create({
        baseURL: fbUrl
      })
      .get(path, config);
    // console.log(response)
    return response.data

  } catch (error) {
    console.log({ error })
    const err = error?.response?.data?.error
    const title = err?.error_user_title || 'Error'
    const message = err?.error_user_msg || err?.message || 'something went wrong'

    displayError({ title, message })
    return null
  }

}
export async function deleteFromFacebook(path, config) {
  const response = await axios
    .create({
      baseURL: fbUrl
    })
    .delete(path, config);
  // console.log(response)
  return response.data
}
export async function createCampaign(campaginName, objective, type, limit) {
  try {
    const data = await postToFacebook(`/${addAccount}/campaigns`, {

    }, {
      params: {
        name: campaginName || "test",
        objective: "LINK_CLICKS" || "LINK_CLICKS",
        status: "PAUSED",
        buying_type: type,
        spend_cap: 35000 * convertRate, // in cents
        special_ad_categories: "[]",
        access_token: access_token,
      }
    })
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}


export async function deleteCampaign(campgainId) {
  try {
    const data = await deleteFromFacebook(`/${campgainId}/campaigns`)
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}

export async function getCampaigns() {
  try {



    const data = await getFromFacebook(`/${addAccount}/campaigns`, {
      params: {
        effective_status: [
          "ACTIVE",
          "PAUSED"
        ],
        fields: "name,objective",
        limit: 100,
        access_token: access_token,
      }
    })
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}
export async function getCampaignsAdSets(campgainId) {
  try {



    const data = await getFromFacebook(`/${campgainId}/adsets`, {
      params: {
        effective_status: [
          "ACTIVE",
          "PAUSED"
        ],
        fields: "name,start_time,end_time,daily_budget,lifetime_budget",
        limit: 100,
        access_token: access_token,
      }
    })
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}


export async function getAdSetsAds(adSetId) {
  try {

    // curl -G \
    // --data-urlencode 'effective_status=[ 
    //   "ACTIVE", 
    //   "PAUSED", 
    //   "PENDING_REVIEW", 
    //   "PREAPPROVED" 
    // ]' \
    // -d 'fields=name,configured_status,effective_status,creative' \
    // -d 'access_token=<ACCESS_TOKEN>' \
    // https://graph.facebook.com/v2.11/<AD_SET_ID>/ads

    const data = await getFromFacebook(`/${adSetId}/ads`, {
      params: {
        effective_status: [
          "ACTIVE",
          "PAUSED",
          "PENDING_REVIEW",
          "PREAPPROVED"
        ],
        fields: "name,configured_status,effective_status,creative",
        limit: 100,
        access_token: access_token,
      }
    })
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}

export async function createAdsets({ campgainId, name, optimizationGoal, dailyBudget, startTime, Traffic, targeting }) {
  console.log({ targeting })
  try {
    const data = await postToFacebook(`/${addAccount}/adsets`, {

    }, {
      params: {
        name: name,
        billing_event: 'IMPRESSIONS',
        campaign_id: campgainId,
        access_token: access_token,
        status: 'PAUSED',
        Traffic: Traffic || 'Website',
        bid_amount: 2,
        end_time: 0,
        start_time: startTime, // utc unix timestamp
        optimization_goal: optimizationGoal || "LINK_CLICKS",
        daily_budget: dailyBudget * 100 * convertRate || 300 * convertRate, // cents,
        targeting
      }
    })
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}


export async function getTargeting(search) {
  try {


    const data = await getFromFacebook(`/search`, {
      params: {
        q: search || '*',
        type: 'adinterest',
        access_token: access_token,
      }
    })
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}
export async function getLocations(search) {
  try {


    const data = await getFromFacebook(`/search`, {
      params: {
        q: search,
        location_types: ["country", "city"],
        type: 'adgeolocation',
        access_token: access_token,
      }
    })
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}
export async function getLanguages(search) {
  try {


    const data = await getFromFacebook(`/search`, {
      params: {
        q: search,
        type: 'adlocale',
        access_token: access_token,
      }
    })
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}

export async function getPageID(url) {
  try {


    const data = await getFromFacebook(``, {
      params: {
        id: url,
        // type:'adinterest',
        access_token: access_token,
      }
    })
    console.log({ data })
    return data;

  } catch (error) {
    console.log(error)
    return null
  }

}
export async function getInstagramID(pageId) {
  try {


    const data = await getFromFacebook(`/${pageId}/instagram_accounts`, {
      params: {
        fields: "id,name",
        // type:'adinterest',
        access_token: page_access_token,
      }
    })
    console.log({ data })
    return data;

  } catch (error) {
    console.log(error)
    return null
  }

}


export async function uploadVideo({ path, formData }) {
  try {
    const response = await axios.post(path, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error)
    return null
  }
}


export async function uploadToFB(pageId, file_url) {
  try {
    const response = await postToFacebook(`/${addAccount}/advideos`, {}, {
      params: {
        file_url,
        name: "test",
        access_token: access_token,

      }
    });
    return response;
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function createAdCreative({ pageId, videoId,adCreativeName, destination, primaryText,headLine, imageUrl }) {
  try {
    const params = {
      name: adCreativeName,
      object_story_spec: {
        video_data: {
          video_id: videoId,
          image_url: imageUrl,
          title:headLine, //this is the headline
          message:primaryText, // this is the primart text 
          // description:'description2',
          call_to_action: {
            type: "LISTEN_NOW",
            value: {
              link: destination,
              // link_caption: 'caption',
              // link_description: 'desc',
            }
          },




        },
        // link_data:{
        //   link:link,
        //   image_url:imageUrl,

        //   message:message,
        //   link_description:"headline text ad creative link data name"
        // },  
        video_id: videoId,
        page_id: pageId,
      },

      access_token: access_token,

    }

    const response = await postToFacebook(`/${addAccount}/adcreatives`, {}, {
      params: params
    });
    return response;
  } catch (error) {
    console.log(error)
    return null
  }
}
export async function createAd({ pageId, addSetId,pixelId,appEvents, creativeId, adName }) {
  try {
    const params = {
      name: adName,
      adset_id: addSetId,
      creative: {
        creative_id: creativeId
      },
      status: "PAUSED",
      page_id: pageId,
      title: "title",
      description: "desc",
      access_token: access_token,

    }
    const trackingSpecs = [];
    pixelId ? trackingSpecs.push({'action.type':'offsite_conversion','fb_pixel':pixelId}) : null;
    appEvents ? trackingSpecs.push({'action.type':'app_custom_event','application':appEvents}) : null;
    if (pixelId || appEvents){
      params['tracking_specs'] = trackingSpecs
    }
    const response = await postToFacebook(`/${addAccount}/ads`, {}, {
      params: params
    });
    return response;
  } catch (error) {
    console.log(error)
    return null
  }
}




















export default axios.create({ baseURL: fbUrl });
