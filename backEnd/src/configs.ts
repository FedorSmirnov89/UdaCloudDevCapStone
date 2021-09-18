// File for the configuration constants

export const defaultProfile = {
    nickName: 'anonymous',
    imgUrl: 'not provided'
}

export const socketInfo = {
    address: '4684g4ekgg.execute-api.us-east-1.amazonaws.com/dev',
    responseSuccess: {
        statusCode: 200
    },
    responseWrongRoute: {
        statusCode: 400,
        message: 'Unknown request method'
    }
}

export const protocol = {
    toClient: {
        updateProfile: 'updateProfile',
        uploadUrl: 'uploadUrl'
    }
}

