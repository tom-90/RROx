The **RROx Map plugin** loads the world data using the **world loader** plugin and displays it using a map.

![](https://raw.githubusercontent.com/tom-90/RROx/master/plugins/map/docs/map.png)

# Features

The map provides a number of ways to interact with the game world.

## Control Switches

By clicking on a switch, you can change the way that it is pointing.

![](https://raw.githubusercontent.com/tom-90/RROx/master/plugins/map/docs/flip-switch.png)

## Control Engines

By clicking on an engine, you can open up the engine controls window. Here you can see information about the engine, as well as change all the controls. This window is also available for all cars, where you can control the brakes.

![](https://raw.githubusercontent.com/tom-90/RROx/master/plugins/map/docs/control-engine.png)

## Freight Information

For industries, freight cars, firewood depots, water towers and sandhouses, it is possible to look at the amount of items that they store.

![](https://raw.githubusercontent.com/tom-90/RROx/master/plugins/map/docs/freight-info.png)

## Control Cranes

By clicking on an industry, you can open up the industry info (see Freight Information above). Additionally this window allows you to remotely control the cranes at this industry.

## Cheats

### Teleporting

It is possible to teleport to any engine, caboose industry, firewood depot, water tower or sandhouse by clicking on it and clicking on `Teleport Here`. It is also possible to right-click anywhere on the map and choosing `Teleport Here`.

### Setting Money & XP

By clicking on a player, and clicking on the `Cheats`-button it is possible to increase the player's money or XP. (By setting negative values, it is also possible to decrease money or XP).

### Flying & Fast Sprint

Flying and fast sprint can be enabled from the same `Cheats`-menu.

![](https://raw.githubusercontent.com/tom-90/RROx/master/plugins/map/docs/cheats.png)

# Settings

## Map Background

The Map background can be customized. Two high resolution backgrounds are available that are highly detailled when zooming all the way in. It is also possible to choose one of the community created backgrounds, or to choose the default in-game map image.

## Colors

Every color that is used on the map can be customized under the colors settings menu. This includes the color scheme for all locomotives and freight cars, as well as all other map elements like tracks, grade, bridges, and switches.

It is not possible to customize the images used for the industries, water towers, firewood depots and sandhouses.

## Minimap

It is possible to enable the minimap under the minimap settings. **The minimap will only show if the game overlay is enabled under the `Overlay` settings**.

## Changelog

### v1.1.5 - 29-01-2023

- ``Enhancement`` Added support for Remotely Controlling Cranes. (Thanks to [Mordred](https://github.com/mordred-random)). With Additional big thanks to _Tom() for the UI Assistance and refinement around this feature.
- ``Enhancement`` Added Player List functionality to RROx. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Player Image to existing RROx Map Search popup. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Teleporting directly to Waycars (Similar to Engines & Cabooses). (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added locate button on the Rolling Stock Controls Popup, when using the RROx normal/desktop view. (Note: This is not supported using the RROx Overlay Map). (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.4 - 22-12-2022

- ``Enhancement`` Added support for Cooke Consolidation as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Plow as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.3 - 15-12-2022

- ``Fixed`` Support for Mosca RROx Engine Controls Sync. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Fixed`` Mosca Icon using full/named Mosca RROx Image instead of the RROx Icon Image version (without the name). (Thanks to [Mordred](https://github.com/mordred-random))
- ``Added`` 45 degree cross and bumper splines.
- ``Added`` Telegraph office.
- ``Fixed`` Issue where RROx would crash when new industries/buildings are added. They will now be displayed as 'Unknown' on the map.

### v1.1.2 - 20-11-2022

- ``Added`` Support for Mosca
- ``Fixed`` Crashes when RROx encounters unknown locomotives. It will now display them as unkown on the map.

### v1.1.1 - 13-11-2022

**Important: This version of the plugin requires the RROx desktop app version 2.2.0 or higher.**

- `Fixed` Bug where track would not be displayed on top of rail + ballast type III and only the groundwork was rendered.

### v1.1.0 - 13-11-2022

**Important: This version of the plugin requires the RROx desktop app version 2.2.0 or higher.**

- `Added` Support for new spline system.

Note: The new spline system is implemented very differently than the old one. Some artifacts may appear on the map when building new splines or deleting old ones.

### v1.0.6 - 01-10-2022

- ``Enhancement`` Added support for Baldwin 6-22-D Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Shay Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Glenbrook Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))

Note: Beta splines, switches, etc. remain unsupported with this version (and as such will not display on the map).

### v1.0.5 - 26-09-2022

- ``Enhancement`` Added support for Waycar as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Montezuma Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))

Note: Beta splines, switches, etc. remain unsupported with this version (and as such will not display on the map).

### v1.0.4 - 05-05-2022

- ``Fixed`` Scrolling issue for coupling bar in the frame controls popup
- ``Fixed`` Issue where spline colors would not be saved

### v1.0.3 - 01-05-2022

- ``Fixed`` Bug where water amount would not show correctly.

### v1.0.2 - 30-04-2022

- ``Fixed`` Overlay positioning issue when first opening it.
- ``Fixed`` Bug where disabling the minimap would disable the overlay entirely. 

### v1.0.1 - 30-04-2022

- ``Fixed`` Issue where minimap would not start following player after attaching.
- ``Fixed`` Issue where hiding the minimap would cause an unexpected error.

### v1.0.0 - 30-04-2022

- *Initial release for v2 of RROx.*