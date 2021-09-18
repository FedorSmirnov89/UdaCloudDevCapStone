import { ResponseToClient } from "./ResponseToClient";
import {protocol} from '../configs'
import {UserItem} from './UserItem'

export class ResponseProfileInfo implements ResponseToClient{

    action=protocol.toClient.updateProfile
    body=null

    constructor(userInfo: UserItem){
        this.body=userInfo
    }
}