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

### v1.0.2 - 30-04-2022

- ``Fixed`` Issue where switches and other objects did not show up on worlds with handcars in them.
- ``Fixed`` Issue where the player would teleport along with the engine.

### v1.0.1 - 30-04-2022

- ``Fixed`` Issue where controls cannot be changed using the shared links.

### v1.0.0 - 30-04-2022

- *Initial release for v2 of RROx.*