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