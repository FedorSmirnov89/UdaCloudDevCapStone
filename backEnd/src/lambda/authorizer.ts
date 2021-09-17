
import { verify, decode } from 'jsonwebtoken'
import Axios from 'axios'


const jwksUrl = 'https://dev-jx-i6s40.eu.auth0.com/.well-known/jwks.json'

/**
 * The function used as authorization handler for the connection to the web socket
 *  
 */
export const handler = async(event) =>{

    // get the token from the socket open query and verify it
    const token = event.queryStringParameters.Auth
    console.log(`Access token ${token}`)

    try{
        const jwtToken = await verifyToken(token)
        console.log('User authorized')
        return makeResponse(true, jwtToken.sub)
    }catch(e){
        console.log('User not authorized')
        return makeResponse(false, 'unauthorized')
    }
}


function makeResponse(accept: Boolean, principalId: string){

    var decision = accept ? 'granted' : 'denied'
    console.log(`Access ${decision}`)

    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: accept ? 'Allow' : 'Deny',
                    Resource: '*'
                }
            ]
        }
    }
}

async function verifyToken (token: string){
    const jwt = decode(token, { complete: true })

    const getSigningKey = async (jwkurl, kid) => {
        let res = await Axios.get(jwkurl, {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Credentials': true,
            }
        });
        let keys = res.data.keys;
        // since the keys is an array its possible to have many keys in case of cycling.
        const signingKeys = keys.filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
            && key.kty === 'RSA' // We are only supporting RSA
            && key.kid           // The `kid` must be present to be useful for later
            && key.x5c && key.x5c.length // Has useful public keys (we aren't using n or e)
        ).map(key => {
            return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
        });
        const signingKey = signingKeys.find(key => key.kid === kid);
        if (!signingKey) {
            throw new Error('Invalid signing keys')            
        }        
        return signingKey
    }

    let key = await getSigningKey(jwksUrl, jwt.header.kid)
    return verify(token, key.publicKey, {algorithms: ['RS256']})
}

function certToPEM (cert){
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
}



