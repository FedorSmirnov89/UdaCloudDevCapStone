# Repository for the Capstone Project of the Udacity Cloud Developer Nanodegree


## Application Description

The implemented project is a chat application implemented using a combination of Lambda functions, Dynamo DB databases, and S3 file storage. It is relatively similar to the ToDo application implemented as the final project of the Nanodegree lecture on serverless services. In contrast to the ToDo application, the chat app implemented in this project uses **websockets** for the communication between the client and the ApiGateWay.

## Application Features

As the user interface, the application uses a React web app. The user, therefore, uses the application via an Internet browser and can make use of the following features:

- Login and authorization via Auth0
- Adjusting the nickname and uploading the profile picture used in the chat 
- Seeing messages that were posted to the chat by all users on the current day
- Posting messages to the chat

## Usage

(1) Navigate to the client folder after checking out the repository:
    
    cd ./client

(2) Start the React app (has to be installed) to open up a browser window with the application client:

    npm start

## Limitations:
A short summary of things which could be better:

- Sorry for the unattractive interface. I did not have any previous experience with React and it already took me forever to get the functionality right
- Usage of **Scan** for the Connections date base: I am aware that I was not supposed to use the scan operation. However, I do hope that it is justifiably in this context since it is used to get all the entries of the connection database, which contains only the currently active connections (a number which is likely to be rather small). One of the next steps for the chat could be, e.g., the implementation of chat channels. In that case, the channel to which a connection is established could be used as the Hash of the connections data base and the connections would be retrieved using the query operation.
- In the implemented application, the authorization happens during the connection to the Api Gateway web socket. I am aware that sending the token as a query parameter is not the best practice. However, I was not able to get the AWS Websocket to work with anything but the native websocket implementation in JS, which, unfortunately, does not offer the option to specify the headers.
