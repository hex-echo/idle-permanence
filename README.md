# Info

Idle Permanence is a 48-hour "game jam"<sup>1</sup> project that runs a simple idle game on the Ethereum blockchain<sup>2</sup>. 
The game is built in Unity, and must be built to WebGL.

Notes: 
1. This was not part of a formal game jam event. 
2. No part of the game is on the Ethereuem mainnet, so far it has only been tested locally using ![ganache]([https://github.com/trufflesuite/ganache).

# Directory
The project is split into two main directories:

`/scaffolding` contains the contracts, deployment information, and webpage dependencies for the game. 

`/unity_project` contains all of the unity files for the WebGL frontend. 

# Installation
## 0. Test environment setup
During development, a local ![ganache]([https://github.com/trufflesuite/ganache) server was used for testing. The project should generalize, but only the local chain is confirmed to work.

When testing the server, you'll need ![MetaMask](https://metamask.io/) or equivalent tied to your test server to interact with the webpage. 
## 1. Contract deployment
![Truffle]([https://github.com/trufflesuite/truffle) was used for contract compilation and deployment. 
The Truffle Suite team provide a useful guide for navigating these steps ![here](https://trufflesuite.com/tutorial/index.html). 
`scaffolding/` is a modified version of that pages pet shop example, and as such the directories should be nearly identical. 
## 2. Building the Unity project
We used Unity v2020.3.24f1 for this project. WebGL will also need to be installed. 
You should be able to add the `/unity_project` folder in the Unity Hub, which will add it as a project. 

Once opened, the project should work out of the box, **however**, not all features will work in the editor's game window, as the Ethereum features are only operational when the game is built to WebGL. 

To build, follow the usual steps (File->Build Settings...). Make the platform is set to WebGL and the development build box _is_ checked. 
When clicking build, select the folder  `unity_project/build_webgl` for the build location and start the build. 
## 3. Running the web server
The WebGL build will need to be copied to web server directory. 
This can be done with one of the root level scripts. 

For windows: 

```transfer_build_files.bat```

For unix systems:

```./transfer_build_files.sh```

With the files copied, navigate to the `scaffolding` directory. 
Now, if you installed the npm packages mentioned in the ![Truffle tutorial](https://trufflesuite.com/tutorial/index.html) above, you can start the web server with 

```
npm run dev
```
This should spin up the web server and open a browser window to the index page. That's it! 
