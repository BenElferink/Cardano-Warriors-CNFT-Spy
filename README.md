# Cardano Warriors CNFT Spy

This application is a free-to-use community tool for Cardano Warriors.<br />
It is capable of following features:

1. See recently listed and recently sold Warriors on CNFT.io, can be useful for "sniping".
2. Track "floor" prices for each Warrior type through visualized data charts. Toggle between 7 days, and 30 days charts.
3. <strike>Create a portfolio where you can track gain/loss on your Warrior, compared to floor prices.</strike>

## Folder structure

This repository is designed different than familiar practices.<br />
Just like any other React app, the `public` and `src` folders contain the code required to build the Frontend of the application.<br />
But there is a `data` folder which is detached from the application. It contains the logic for creating and maintaining data about floor prices. The bot runs on a seperate VM hosted by AWS, and keeps the data within a designated `.json` file.

## Access AWS virtual machine

1. You need to obtain a private key (`.pem` file)
2. Access the VM via SSH: `ssh -i "${FILE_NAME}.pem" ubuntu@ec2-18-218-36-170.us-east-2.compute.amazonaws.com`
3. If you need to clone the repo again for some reason, make sure to apply your GitHub token so the bot can read and write data: `git clone https://${GITHUB_TOKEN}@github.com/belferink1996/cardano-warriors-cnft-spy.git`
4. Run `cd ./cardano-warriors-cnft-spy/data`
5. Run `npm start`