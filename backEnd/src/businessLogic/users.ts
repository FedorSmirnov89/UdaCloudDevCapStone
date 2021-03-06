
import { DbAccessUser } from '../dataLayer/DbAccessUser'
import { UserItem } from '../models/UserItem'
import {ResponseProfileInfo} from '../models/ResponseProfileInfo'

import {defaultProfile} from '../configs'

const dbAccessUser = new DbAccessUser()


/**
 * Called when a connection is established. Checks whether the user is already in the DB. 
 * Creates an entry if he is not.
 * 
 * @param princID the princId which comes with the new connection. 
 */
export async function checkUserEntry(princID: string) {
    const userExists = await dbAccessUser.userEntryExists(princID)

    if (userExists){
        console.log('User exists')
    }else{
        console.log('User does not exist. Creating entry')
        const entry : UserItem = {
            princId: princID,
            nickName: defaultProfile.nickName,
            imgUrl: defaultProfile.imgUrl
        }

        await dbAccessUser.createUserEntry(entry)
    }
}

/**
 * Called to get the info for a given id
 * 
 * @param princId the given id
 * 
 */
export async function getUserInfo(princId: string): Promise<ResponseProfileInfo> {
    return new ResponseProfileInfo(await dbAccessUser.getUserInformation(princId))
}

/**
 * Updates the user entry 
 * @param entry 
 * @returns 
 */
export async function updateUserEntry(entry: UserItem){
    return dbAccessUser.updateUserEntry(entry)    
}