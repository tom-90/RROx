# How to download

All versions of RROx can be found on the [Releases](https://github.com/tom-90/RROx/releases) page. Download the file with the name `RailroadsOnline.Extended.Setup.exe` and run it to install RROx.

# Antivirus warning

RROx needs to inject code into the game to function. However, this is not something regular programs do, and as such, it might get detected by your antivirus.

If necessary, you can add an exception to your antivirus for the following folder: `%localappdata%\RailroadsOnlineExtended`

All of the code is open-source, such that it can be verified by others to make sure it does not contain any malicious code. The executable that will most likely be detected by the antivirus is the injector. This injector is built using Cheat Engine, which is also open-source and can be found here: https://github.com/cheat-engine/cheat-engine

# How to use

Watch the [demo video](https://www.youtube.com/watch?v=Vvz0CANFxD0) that shows the basic usage of RROx. In addition, the Info tab gives more a more detailed explanation of how to use it.

# Running RROx locally

If you want to build a version yourself, you can follow the below instructions to get each part to work.

## Run Electron App

From within the electron folder, run `yarn install` to install all dependencies.
Make sure you have NodeJS (tested with v16.13) and yarn installed.

Then to start the app run `yarn start`.

## Build DLL

The DLL source files can be found in the dll folder. The build output should be copied to `electron/assets/binaries/RailroadsOnlineExtended.dll` for it to get used by the injector.

## Run Injector

The Injector is built on top of Cheat Engine. You can find the table in the injector folder, alongside the automatically executed lua script that runs when the cheat table is launched.