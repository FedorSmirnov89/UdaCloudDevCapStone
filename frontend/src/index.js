import React from 'react'
import ReactDom from 'react-dom'
import './index.css'

import {UserInfo} from './auth/UserInfo'
import { Auth0Provider } from "@auth0/auth0-react";


const element = (
  <p>Hello</p>
)


ReactDom.render(
  <Auth0Provider
      domain="dev-jx-i6s40.eu.auth0.com"
      clientId="pdrDez3MkLPR5Vxa9CYvM0MVwtNS3yDc"
      redirectUri={window.location.origin}
  >
      {element}
  </Auth0Provider>,
  document.getElementById('root')
)