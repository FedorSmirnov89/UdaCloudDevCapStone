

export const getConnectionInformation = (event) => {
    const connectionId = event.requestContext.connectionId
    const princId = event.requestContext.authorizer.principalId
    return {
        connectionId: connectionId,
        princId: princId
    }
}