import {getData} from "./FetchData";

// Lookup Data Get
export const getLookUpData = async (lookupCode, levelId) => {
    const options = {lookupCode: lookupCode, levelId: levelId}

    return await getData('lookup/getLookupData', options);
}

// Lookup data get with parent id
export const getLookUpDataWithParentId = async (lookupCode, levelId, parentId) => {
  const options = {lookupCode: lookupCode, levelId: levelId, parentId: parentId}

  return await getData('lookup/getLookupDataWithParent', options);
}

export const confirmationMail = async (email) => {
  const options = {email: email}

  return await getData('mail/confirmationSend', options);
}
