# RailroadsOnline Extended

RailroadsOnline Extended provides an in-game minimap, with the ability to remotely control switches and locomotives. In addition, RROx allows you to teleport to various locations and trigger autosaves.

## Antivirus warning

RROx needs to inject code into the game to function. However, this is not something regular programs do, and as such, it might get detected by your antivirus.

If necessary, you can add an exception to your antivirus for the following folder: `%localappdata%\RailroadsOnlineExtended`

All of the code is open-source, such that it can be verified by others to make sure it does not contain any malicious code. The executable that will most likely be detected by the antivirus is the injector. This injector is built using Cheat Engine, which is also open-source and can be found here: [https://github.com/cheat-engine/cheat-engine](https://github.com/cheat-engine/cheat-engine)

## How to use

Watch the [demo video](https://www.youtube.com/watch?v=Vvz0CANFxD0) that shows the basic usage of RROx. In addition, the Info tab gives more a more detailed explanation of how to use it.

## Frequently Asked Questions

- **Attaching fails**: If attaching fails and RROx displays an error code, please follow the troubleshooting steps for the corresponding error code [here](./error-codes.md).
- **Minimap not visible**: Please make sure that the game is not running in `Native Fullscreen`-mode. Please switch to any other mode to get the minimap to work.
- **Attaching works, but the map stays empty**: Please make sure that you are **not** running RROx as administrator.

## Support

For any other questions or issues, you can contact me on Discord:
[_tom()#0056](https://discordapp.com/users/178197960457322497)

Troubleshooting information for RROx error codes can be found [here](./error-codes.md).

## Known issues

- When running RROx on a client in a multiplayer session, controlling switches and remotely controlling locomotives is disabled while driving in F-mode. This is a limitation of the way RROx interacts with the game.
- Teleporting does not work for clients in multiplayer.

## Changelog

### v1.7.0 - 05-01-2022

- ``Added`` Map sharing ability for viewing on other devices and multiplayer
- ``Added`` Ability to attach to remote sessions in the desktop RROx app.
- ``Added`` Web-viewer of map, accessible via [rrox.tom90.nl](https://rrox.tom90.nl)
- ``Added`` Reworked map drawing for better performance.
- ``Added`` High-resolution map image.
- ``Added`` Full customizability of all colors used on the map.
- ``Added`` Teleport to sandhouses and watertowers.

### v1.6.2 - 28-12-2021

- ``Added`` Debugging options.
- ``Fixed`` Fixed car positioning.
- ``Fixed`` Multiplayer clients were not attaching properly.

### v1.6.1 - 27-12-2021

- ``Fixed`` Fixed issue where RROx did not detect if you were in game properly.

### v1.6.0 - 27-12-2021

- ``Added`` Draggable popups, allowing to use the map while controlling a locomotive.
- ``Added`` Compact mode for the engine controls.
- ``Added`` RROx can now show error codes for the most common problems when attaching.
- ``Added`` Troubleshooting information for attaching error codes.
- ``Added`` RROx now automatically detaches whenever you leave the game.
- ``Fixed`` Fixed minizwerg upload.
- ``Fixed`` Wrong names for flatcars.
- ``Fixed`` RROx left a background process running when closed.
- ``Fixed`` Detaching could sometimes hang.
- ``Fixed`` Improved overall performance by reducing the refresh rate of splines (tracks, groundwork and bridges)
- ``Fixed`` Player is now smaller, to make it easier to click on the locomotive when the player is in it.
- ``Fixed`` Cars are now properly centered.

### v1.5.0 - 23-12-2021
- ``Added`` Teleporting to industries, locomotives and cabooses.
- ``Added`` Minizwerg color scheme sharing.
- ``Added`` The sandhouse is now shown on the map.
- ``Added`` When clicking attach, a popup with important information is now shown.
- ``Fixed`` Locomotive and car sizes.
- ``Fixed`` Ironworks now shows steel pipes as output.

### v1.4.0 - 20-12-2021
- ``Added`` Engine shed is now shown on the map.
- ``Added`` Caboose is now correctly shown.
- ``Added`` Remote control for brakes on freight cars and the caboose.

### v1.3.0 - 17-12-2021
- ``Added`` More detailed drawings of all industries.
- ``Added`` Industry input and output information.
- ``Added`` Information about the freight of cars.
- ``Added`` Border colors to indicate if brakes are applied on locomotives and cars.
- ``Added`` Dark map (Thanks to [Nimrey](https://github.com/nimreydx))

### v1.2.1 - 15-12-2021
- ``Fixed`` Autosave timer reverted to 1 minute after every restart of RROx.
- ``Fixed`` Game crashes for clients while driving in F-mode. (Locomotive and switch controls are now disabled for this situation)

### v1.2.0 - 14-12-2021
- ``Added`` Automatic upload to minizwerg.
- ``Added`` Controls for whistle, generator and compressor.
- ``Added`` Locomotive information like boiler pressure and fuel amount.

### v1.1.1 - 13-12-2021
- ``Fixed`` Auto-updater triggering error popups.

### v1.1.0 - 13-12-2021
- ``Fixed`` Controlling swithes and locomotives while driving in third-person mode (F-key)
- ``Added`` Customizable map background (Thanks to [Nimrey](https://github.com/nimreydx))
- ``Added`` RROx checks that it is not running twice (Thanks to [Nimrey](https://github.com/nimreydx))

### v1.0.1 - 11-12-2021
- ``Fixed`` RROx was not always correctly attaching
- ``Fixed`` RROx did not start with a special character in the path

### v1.0.0 - 11-12-2021
- ``Added`` Configurable autosave
- ``Added`` Remotely controlling switches (with multiplayer support)
- ``Added`` Remotely controlling locomotives (with multiplayer support)
- ``Added`` In-game map and minimap