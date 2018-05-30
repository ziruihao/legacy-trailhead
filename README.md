# doc-planner (client)

This project is creating a web app that allows for members of the Dartmouth community 
to more easily browse, create, and sign up for Dartmouth Outing Club (DOC) trips. We 
aim to revamp and simplify the process for both trip leaders and students.

Browse trips across all DOC clubs or by specific clubs:
![Browse](gifs/browse.gif)

Signing up for a trip is as easy as clicking a button:
![Signup](gifs/signup.gif)

Users can easily edit their critical info, such as emails and dash numbers, and have it sent to all of their trips:
![Update](gifs/update.gif)

Trip leaders can easily see all of the trip members' info and email everyone with important updates:
![Email](gifs/email.gif)

## Architecture

This repo constitutes the app's front-end.

The app's back-end is in this [repo](https://github.com/dartmouth-cs52-18S/project-api-doc-planner).

The client is built using a combination of React/Redux, with Bootstrap for styling. The 
server is built using Node.js and Express.js, with a MongoDB database.

## Setup

To test locally, install npm and yarn. Clone the repo and then run the following commands:

```
yarn
```

```
yarn start
```

## Deployment

Deployed on surge at http://doc-planner.surge.sh/. Continuous deployment is being done by Travis CI on pull requests. To deploy manually, run the following command in the project directory's root:

```
yarn deploy
```

## Authors

Samuel Schiff, Katie Bernardez, Ben Hannam, Brian Keare, Shashwat Chaturvedi, Isabel Hurley

## Acknowledgments

Thanks to Tim Tregubov and the rest of the CS52 staff for all of their help this term.