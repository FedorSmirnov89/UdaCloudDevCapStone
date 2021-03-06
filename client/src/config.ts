// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
export const apiEndpoint = `wss://4684g4ekgg.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-jx-i6s40.eu.auth0.com',            // Auth0 domain
  clientId: 'pdrDez3MkLPR5Vxa9CYvM0MVwtNS3yDc',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

export const socketMessages = {

  toServer: {
    getProfile: 'getProfileInfo',
    updateProfile: 'updateProfileInfo',
    getUploadUrl: 'getUploadUrl',
    sendMessage: 'sendMessage',
    getMessages: 'getMessages'
  },
  fromServer: {
    updateProfile: 'updateProfile',
    uploadUrl: 'uploadUrl',
    updateMessages: 'updateMessages'
  }
}

export const getImageUrlForId = (princId: string) => {
  return `https://fedor-uda-icon-bucket.s3.amazonaws.com/${princId.replace('|', '%7C')}`
}
