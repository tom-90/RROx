# How to download

All versions of RROx can be found on the [Releases](https://github.com/tom-90/RROx/releases) page. Download the file with the name `RailroadsOnline.Extended.msi` and run it to install RROx.

# Support & Info

For questions about or issues with RROx, please use [the Discord server](https://discord.gg/vPxGPCDFBp).

# Antivirus warning

RROx needs to inject code into the game to function. However, this is not something regular programs do, and as such, it might get detected by your antivirus.

If necessary, you can add an exception to your antivirus for the following folder: `C:\Program Files\RROx` (This is the default installation directory. It can be changed during the installation).

All of the code is open-source, such that it can be verified by others to make sure it does not contain any malicious code. RROx attaches to the game using [DLL injection](https://wikipedia.org/wiki/DLL_injection). This means that no game files are modified on disk. By closing RROx and restarting the game, the game will run completely unaffected. To start using RROx, click the attach button below.

# How to use

Watch the [demo video](https://www.youtube.com/watch?v=Vvz0CANFxD0) that shows the basic usage of RROx *(This video is outdated as it shows version 1. A new video for version 2 will be available soon)*. In addition, the Info tab gives more a more detailed explanation of how to use it.

# Running RROx locally

If you want to build a version yourself, you can follow the below instructions to get each part to work.

## Run Electron App

From within the root folder, run `yarn install` to install all dependencies.
Make sure you have NodeJS (tested with v16.13) and yarn installed.
(Yarn is required because the repository uses yarn workspaces)

Then to start the electron app run `yarn start` from the `packages/electron` directory.