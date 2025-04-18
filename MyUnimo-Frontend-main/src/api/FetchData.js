import axios from "../api/axios";

export const getData = async (url, options) => {
    try {
        let request_url = '/api/v1/' + url

        const response = await axios.get(request_url, {params: options}, {
            headers: {
              'Content-Type': 'application/json'
            }})

        return response.data
    }
    catch (error) {
        // Handle the error here
        console.error('An error occurred while fetching property space:', error);

        throw error;
    }
}

export const getSingleData = async (url, options, accessToken) => {
  try {
    let request_url = '/api/v1/' + url

    const response = await axios.get(request_url, {
        params: options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    )

    return response.data.data
  }
  catch (error) {
    // Handle the error here
    console.error('An error occurred while fetching property space:', error);

    throw error;
  }
};


export const getFileData = async (url, options, accessToken) => {
  try {
    const requestUrl = '/api/v1/' + url;

    const response = await axios.get(requestUrl, {
      params: options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response;
  } catch (error) {
    // Handle the error here
    console.error('An error occurred while fetching file data:', error);

    throw error;
  }
};



export const authenticateAndPostData = async (url, options, accessToken) =>{
  try {
    let request_url = '/api/v1/' + url

    const response = await axios.post(request_url,{
        params: options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    )

    return response.data
  }
  catch (error) {
    // Handle the error here
    console.error('An error occurred while fetching property space:', error);

    throw error;
  }
}

// export const postData = async (url, options) =>{
//   try {
//     let request_url = '/api/v1/' + url

//     const response = await axios.post(request_url,{options},  {
//       headers: {'Content-Type': 'application/json'}})

//     return response.data
//   }
//   catch (error) {
//     // Handle the error here
//     console.error('An error occurred while fetching property space:', error);

//     throw error;
//   }
// }

export const postData = async (url, options) => {
  try {
    let request_url = '/api/v1/' + url;

    const accessToken = localStorage.getItem('access_token');

    const response = await axios.post(
      request_url,
      { options },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Handle the error here
    console.error('An error occurred while fetching property space:', error);

    return {status: 'error'};
  }
};

export const fileUpload = async (url, formData) => {
  try {
    let request_url = '/api/v1/' + url;

    const accessToken = localStorage.getItem('access_token');

    // Create a new FormData object
    const multipartFormData = new FormData();

    // Append the file data to the FormData
    formData.document_data && multipartFormData.append('file', formData.document_data);

    // Append other data to the FormData
    multipartFormData.append('document_name', formData.document_name);
    multipartFormData.append('document_type', formData.document_type);
    multipartFormData.append('document_sub_type', formData.document_sub_type);

    const response = await axios.post(
      request_url,
      multipartFormData,  // Use the modified FormData object here
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Handle the error here
    console.error('An error occurred:', error);

    throw error;
  }
};




export const fetchWithToken = async (url, accessToken, params = {}) => {
    try {
        let requestUrl = '/api/v1/' + url;

        const response = await axios.get(requestUrl, {
            params: params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('An error occurred while fetching data:', error);
        throw error;
    }
};



export const uploadFile = async (url, accessToken, data = {}) => {
    try {
        let requestUrl = '/api/v1/' + url;

        const response = await axios.put(requestUrl, data,{
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('An error occurred while fetching data:', error);
        throw error;
    }
};

export const deleteData = async (url, options, accessToken) => {
  try {
    let request_url = '/api/v1/' + url

    const response = await axios.delete(request_url, {
        params: options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    )

    return response
  }
  catch (error) {
    // Handle the error here
    console.error('An error occurred while fetching property space:', error);

    throw error;
  }
};
