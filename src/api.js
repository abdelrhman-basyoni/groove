import axios from 'axios';


import { Store } from 'react-notifications-component';

axios.defaults.headers.common['Content-Type'] = 'application/json';





export function displayError({title, message}) {

  Store.addNotification({
    title: title,
    message:  message,
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

export function displaySuccess({title,message}) {

  Store.addNotification({
    title: title,
    message: message ,
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
// export displayError;
export const convertRate = 25;
const access_token = 'EAASOreMwe2wBAMehK9lHsOqiraZC3Sq4CkTNl8IdJZCHbLaWZBu8HpXWhrbo5vtTfWBonVEtkMYxOiTqZBiqEPJPIAx3nI4Qd8RTG7HrfOu9btVxaq5TIQdNfdAJG5RDzZCSMTETTzIZCzvhfR7sBiZAhM5UZA50TiaZCyI6fUrdbLPamcenR1Du1HegOntPs4tp9JXmgRLnv2FNly1VSZAGXqAaFrUGoGypvYLfZB4XZC7aMfhKeYfAtZClb';
const app_secret = 'b6886e70a4a828673f2249d1973a7f4f';
const app_id = '1282777398934380';
const addAccount = `act_362100131`; 
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
    console.log({error})
    const err = error?.response?.data?.error
    const title = err?.error_user_title || 'Error'
    const message = err?.error_user_msg || err?.message || 'something went wrong'

    displayError({title, message})
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
    console.log({error})
    const err = error?.response?.data?.error
    const title = err?.error_user_title || 'Error'
    const message = err?.error_user_msg || err?.message || 'something went wrong'

    displayError({title, message})
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
export async function createCampaign(campaginName, objective,type,limit) {
  try {
    const data = await postToFacebook(`/${addAccount}/campaigns`, {

    }, {
      params: {
        name: campaginName || "test",
        objective: "LINK_CLICKS" || "LINK_CLICKS",
        status: "PAUSED",
        buying_type:type,
        spend_cap:35000 *convertRate, // in cents
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
        limit:100,
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
        limit:100,
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
        limit:100,
        access_token: access_token,
      }
    })
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}

export async function createAdsets({campgainId,name,optimizationGoal,dailyBudget,startTime,Traffic,targeting}) {
  console.log({targeting})
  try {
    const data = await postToFacebook(`/${addAccount}/adsets`, {

    }, {
      params: {
        name: name ,
        billing_event:'LINK_CLICKS',
        campaign_id:campgainId,
        access_token: access_token,
        status:'PAUSED',
        Traffic:Traffic || 'Website',
        bid_amount:2,
        end_time:0,
        start_time:startTime, // utc unix timestamp
        optimization_goal:optimizationGoal || "LINK_CLICKS",
        daily_budget:dailyBudget* 100 * convertRate || 300 * convertRate, // cents,
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
        q: search,
        type:search ?'adinterest' :'adTargetingCategory',
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
        location_types:["country","city"],
        type: 'adgeolocation' ,
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
        type: 'adlocale' ,
        access_token: access_token,
      }
    })
    return data;
  } catch (error) {
    console.log(error)
    return null
  }

}




















export default axios.create({ baseURL: fbUrl });
