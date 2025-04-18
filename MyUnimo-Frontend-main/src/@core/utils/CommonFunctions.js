// Email Validation Check

import {getFileData} from "../../api/FetchData";

export const isValidEmail = (email) => {
    // Define a regular expression pattern for email validation.
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

// onchange value, full single row, full array list, name to set the data
export const handleOnChangeList = (eventValue, itemRow, arrList, nameValue) => {
  // console.log(eventValue, itemRow, arrList, nameValue)
  return arrList.map((items) => {
    if (items.id === itemRow.id) {return {...items, [nameValue]: eventValue};} else {return items}
  })
};


//Get the file Data
export const getFileDetails = async () => {
  try {
    let userToken = localStorage.getItem("access_token");
    const result = await getFileData('user/getUploadFiles', '', userToken);

    if (result && result.status === 200 && result.data && result.data.data) {
      return result.data.data.map(document => ({
        name: document.documentName,
        documentType: document.documentType,
        selectedOption: document.documentSubType || ' ',
        type: document.contentType,
        imageUrl: document.fileUrl,
        id: document.id,
      }));
    } else {
      console.error('Error fetching uploaded documents. Status:', result ? result.status : 'No result');
      return [];
    }
  } catch (error) {
    console.error('Error fetching uploaded documents:', error);
    return [];
  }
};
