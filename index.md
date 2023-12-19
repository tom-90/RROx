# RailroadsOnline Extended

RailroadsOnline Extended provides an in-game minimap, with the ability to remotely control switches and locomotives. In addition, RROx allows you to teleport to various locations and trigger autosaves.

## Antivirus warning

RROx needs to inject code into the game to function. However, this is not something regular programs do, and as such, it might get detected by your antivirus.

If necessary, you can add an exception to your antivirus for the following folder: `C:\Program Files\RROx` (This is the default installation directory. It can be changed during the installation).

All of the code is [open-source](https://github.com/tom-90/RROx), such that it can be verified by others to make sure it does not contain any malicious code. RROx attaches to the game using [DLL injection](https://wikipedia.org/wiki/DLL_injection). This means that no game files are modified on disk. By closing RROx and restarting the game, the game will run completely unaffected. To start using RROx, click the attach button below.

## How to use

Watch the [demo video](https://www.youtube.com/watch?v=Vvz0CANFxD0) that shows the basic usage of RROx *(This video is outdated as it shows version 1. A new video for version 2 will be available soon)*. In addition, the Info tab gives more a more detailed explanation of how to use it.

## Frequently Asked Questions

- **Minimap not visible**: Please make sure that the game is not running in `Native Fullscreen`-mode. Please switch to any other mode to get the minimap to work.
- **Attaching works, but the map stays empty**: Please make sure that you are **not** running RROx as administrator.
- **The game screen is black**: Disable hardware acceleration in the overlay settings and restart RROx.

## Support

To keep all information about RROx in one place, I have set-up a Discord server where you can contact me about any questions or issues you have:
[RROx Discord Server](https://discord.gg/vPxGPCDFBp)

Troubleshooting information for RROx error codes can be found [here](./error-codes.md).

## Changelog

### v2.3.0 - 19-12-2023

- ``Added`` Support for loading from Railroads Online running on Unreal Engine v5.3
- ``Added`` Support for the memory reader to dynamically switch between Unreal Engine versions (this means RROx is still backwards compatible with older versions)
- ``Enhancement`` Rewrote a major portion of the memory reader to make future Unreal Engine updates much easier to handle.
- ``Enhancement`` Various stability and performance improvements.

### v2.2.2 - 19-11-2023

- ``Fixed`` Stability issues with RROx connecting to RRO.
- ``Fixed`` Issues finding objects in game memory (case-sensitivity issues).
- ``Fixed`` Issue where reading certain types of text (rolling stock name/number) did not work or gave weird characters.

### v2.2.1 - 21-04-2023

- ``Added`` Support for Unreal Engine 5 (for RailroadsOnline Weather & Sky update)
- ``Fixed`` Typo in plugin update message

### v2.2.0 - 13-11-2022

- ``Added`` Additional API's necessary for the world and map plugins to load the new spline system.
  
### v2.1.0 - 05-05-2022

- ``Added`` Ability to manually inject the DLL into the game in case automatic injection by RROx fails.
- ``Fixed`` Issue where overlay settings and player name would not be saved.
- ``Fixed`` Issue where overlay state (large map/minimap) could be synced in shared sessions.

### v2.0.0 - 30-04-2022

**Important!** The version 2 update changes the way that RROx is installed. Therefore, to use it, you should uninstall the current version of RROx and reinstall the new version. Older versions will try to automatically update to this new version, but this will fail.

- ``Changed`` RROx no longer uses Cheat Engine to read memory from the game. It now only uses it's own DLL that is injected into the game.
- ``Changed`` RROx now uses a proper MSI-installer, with configurable options.
- ``Changed`` RROx now installs into `C:\Program Files\RROx` by default, but this can be changed during the setup.
- ``Improved`` Overall performance improvements, including a much faster attach time.
- ``Improved`` The chances of RROx causing a game crash are now much lower.
- ``Improved`` RROx no longer requires you to attach when you are in game and detach when you leave.
- ``Added`` New User Interface
- ``Added`` Plugin system with plugins that contain the RROx functionality. This can be used by 3rd party developers to create new functionality. Documentation on how to use the plugin system will follow.
- ``Added`` New settings page that is more user-friendly.
- ``Added`` (Autosave Plugin) Ability to save to 3 special backup slots, that are seperate from the 10 game save slots.
- ``Added`` (World Plugin) Added configuration options for world refresh intervals and spline intervals.
- ``Added`` (Devtools Plugin) Added struct list to show game objects, that can be used by plugin developers.
- ``Removed`` (Map Plugin) Build mode has not been added to v2 yet. It will be added back in after the new spline update.

### v1.13.0 - 29-01-2022

- ``Added`` Teleport here button when right-clicking on the map to teleport anywhere.
- ``Added`` Search box on the map (Thanks to [Faab007NL](https://github.com/faab007)).
- ``Added`` Collapsible sections on the settings page.
- ``Fixed`` Teleport bug where multiplayer clients could teleport with the locomotive.
- ``Fixed`` For people having issues where the game window is black: disable hardware acceleration in the minimap settings.
- ``Fixed`` Minimap now positions itself correctly on first load.
- ``Fixed`` The popup title now correctly shows the name of the freight car (Thanks to [Faab007NL](https://github.com/faab007)).

### v1.12.0 - 29-01-2022

- ``Added`` Movable and closable map popup.
- ``Fixed`` Button to open controls in new window now works properly.
- ``Fixed`` Players connecting via a shared URL can now also set money and xp.
- ``Fixed`` When opening the overlay, the in-game camera will stop moving.

### v1.11.1 - 27-01-2022

- ``Fixed`` Fixed issue where map stays empty after attaching.

### v1.11.0 - 27-01-2022

- ``Added`` Dark high-res map (Thanks to [Faab007NL](https://github.com/faab007)).
- ``Added`` Configurable keybinds for opening the map and autosaving (more will come in the next updates).
- ``Added`` Feature toggles for cheating, building, teleporting, changing switches and controlling engines.
- ``Fixed`` Changing Money and XP now works correctly.
- ``Fixed`` Dark mode color issues.

### v1.10.0 - 25-01-2022

- ``Added`` Functions to heightgraph for modifying multiple points at once.
- ``Added`` Dark mode (Thanks to [Faab007NL](https://github.com/faab007)).
- ``Added`` Cheat mode: flying, fast sprint and modify XP and money

### v1.9.1 - 25-01-2022

- ``Fixed`` Icon bar in control window now correctly scrolls.
- ``Fixed`` Logging camp graphics platform positions.

### v1.9.0 - 24-01-2022

- ``Added`` Icon bar to control window representing the entire train.
- ``Added`` Synchronization of regulator, reverser and brake between coupled locomotives.
- ``Added`` Tender water and firewood levels
- ``Added`` Maximum boiler pressure, fuel amount and water level statistics.
- ``Added`` Map refresh setting, to improve performance on slower PCs.
- ``Added`` Post-install message with information about the [discord Server](https://discord.gg/vPxGPCDFBp).

### v1.8.0 - 20-01-2022

- ``Added`` Experimental build mode.
- ``Added`` Rolling stock list (Thanks to [Faab007NL](https://github.com/faab007)).

### v1.7.1 - 06-01-2022

- ``Fixed`` Popups would reopen every time when pressing F1.
- ``Fixed`` The map would not follow the player correctly.
- ``Fixed`` Blocked panning, even when not following anything.
- ``Fixed`` Percentages would not be shown on the control sliders.
- ``Fixed`` Remote connections could silenty fail, not allowing the player to interact with anything.

### v1.7.0 - 05-01-2022

- ``Added`` Map sharing ability for viewing on other devices and multiplayer.
- ``Added`` Ability to attach to remote sessions in the desktop RROx app.
- ``Added`` Web-viewer of map, accessible via [rrox.tom90.nl](https://rrox.tom90.nl) (Thanks to [Faab007NL](https://github.com/faab007))
- ``Added`` Reworked map drawing for better performance. (Thanks to [Faab007NL](https://github.com/faab007))
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