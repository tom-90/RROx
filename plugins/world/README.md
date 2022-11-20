The **RROx World Loader plugin** loads all world data from game memory. This data can then be used by other plugins like the **RROx map plugin** to show to the user.

# Settings

The plugin provides a number of settings that allow you to customize how RROx interacts with the game world.

## Refresh intervals

It is possible to customize the intervals at which the world is loaded. A faster refresh time means the data will update faster, but this will be less performant.

It is possible to set a custom refresh interval for the spline data, as this is a big factor for the performance of the world loader.

## Features

The world loader provides a number of features that can be turned on or off depending on your preference:

- **Control Engines**: Enable/disable the ability to remotely control the engines.
- **Control Switches**: Enable/disable the ability to remotely control switches.
- **Teleport**: Enable/disable the ability for a player teleport anywhere on the map.
- **Cheats**: Enable/disable the ability for a player to change their money and use fast sprint and flying modes.

## Changelog

### v1.1.2 - 20-11-2022

- ``Added`` Support for Mosca
- ``Fixed`` Crashes when RROx encounters unknown locomotives. It will now display them as unkown on the map.

### v1.1.1 - 19-11-2022

**Important: This version of the plugin requires the RROx desktop app version 2.2.0 or higher.**

- ``Enhancement`` Improved refresh interval for switches. They now follow the world refresh interval, instead of the spline refresh interval.
- ``Fixed`` Bug where RROx would freeze after building new splines.

Note: The new spline system is implemented very differently than the old one. Some artifacts may appear on the map when building new splines or deleting old ones.

### v1.1.0 - 13-11-2022

**Important: This version of the plugin requires the RROx desktop app version 2.2.0 or higher.**

- ``Added`` Support for new spline system.

Note: The new spline system is implemented very differently than the old one. Some artifacts may appear on the map when building new splines or deleting old ones.

### v1.0.6 - 01-10-2022

- ``Enhancement`` Added support for Baldwin 6-22-D Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Shay Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Glenbrook Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.0.5 - 26-09-2022

- ``Enhancement`` Added support for Waycar as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Montezuma Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.0.4 - 05-05-2022

- ``Fixed`` Issue where splines would not immediately load after attaching
- ``Fixed`` Issue where Ironworks would show raw iron instead of steel pipes.
- ``Fixed`` Issue where shared clients could not set shared controls

### v1.0.3 - 01-05-2022

- ``Fixed`` Glitch where coupling bar would not show entire train.
- ``Fixed`` Bug where whistle would not go to 100%.

### v1.0.2 - 30-04-2022

- ``Fixed`` Issue where switches and other objects did not show up on worlds with handcars in them.
- ``Fixed`` Issue where the player would teleport along with the engine.

### v1.0.1 - 30-04-2022

- ``Fixed`` Issue where controls cannot be changed using the shared links.

### v1.0.0 - 30-04-2022

- *Initial release for v2 of RROx.*