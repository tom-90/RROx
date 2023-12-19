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
- **Control Cranes**: Enable/disable the ability to remotely cranes.
- **Rolling Stock Location Reset**: Added functionality for Rolling Stock Location Reset, which allows Game/Session Host (will not work for RROx Clients) to reset rolling stock location if required (may need re-railing after reset).
	--> Note: Momement is kept during/after location reset due to Game Logic/Implementation. May also have unexpected issues on larger saves with many phyiscs calculations (try only doing one car at a time on a fresh load in this case). Please allow framecar/rolling stock to come to a rest/stop before repeating/resetting another item (including the same item).

## Changelog

### v1.1.19 19-12-2023
- ``Fixed`` Issues after recent game updates.
- ``Fixed`` Turntable size incorrect.

Note: this update does not include graphics for the new freight types and industries yet. These will come in the future.

### v1.1.18 27-11-2023
- ``Fixed`` RROx Logs warning for unknown industry 'watertower_drgw'. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.17 19-11-2023
- ``Fixed`` Issues where unknown rolling stock could crash the RROx map.
- ``Fixed`` Issues where some industries might not have showed up correctly.

### v1.1.16 14-11-2023
- ``Fixed`` Issues after new game update

Note: this update does not include graphics for the new freight types and industry yet. This will come in the future. This update is purely meant to get RROx working again for the new update.

### v1.1.14 14-10-2023
- ``Enhancement`` Added support for Lima 280 Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "DSPRR Coach" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for new D&RG Water Tower. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Fixed`` Fixed RROx height check used for The Teleport Features. This addresses/fixes this issue with landing on the "sky box" on the Lake Valley Map. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Fixed`` RROx errors during attaching (unable to locate watertower data-objects)

### v1.1.13 09-09-2023
- ``Fixed`` Fixed RROx check for newer SplineTrack objects. This addresses/fixes RROx not displaying these track types after the RRO Beta Update 0.5.9.8. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Wood Rick" as a new Industry/fueling building/facility. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.12 27-06-2023
- ``Enhancement`` Added Support for "Gregg Sugar Cane Cane Flat" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Logging Flat" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Stake Flat" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Bulkhead Flat" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Lowside Gondola" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Medium Gondola" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Highside Gondola" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "EWA Plantation Box Car" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Waualua Agricultural Tank Car" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.11 27-05-2023
- ``Enhancement`` Added Support for new Steel Truss Bridges. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.10 21-04-2023
- ``Added`` Support for RailroadsOnline Unreal Engine 5
- ``Enhancement`` Added functionality for Rolling Stock Location Reset, which allows Game/Session Host (will not display/work for RROx Clients) to reset rolling stock location if required. This allows the Host to return stuck rolling stock to origin point in the world (may need re-railing after reset, but this can/will retrive your stuck rolling stock). Note: Momement is kept during/after location reset due to Game Logic/Implementation. May also have unexpected issues on larger saves with many phyiscs calculations (try only doing one car at a time on a fresh load in this case). Please allow framecar/rolling stock to come to a rest/stop before repeating/resetting another item (including the same item). (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.9 - 04-04-2023
- ``Enhancement`` Added functionality to Reset Player Camera/Model. This addresses/fixes RRO game issue/bug noted after RRO update #230324; where player model/camera turns/rotates after leaving locomotives. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.8 - 13-03-2023
- ``Enhancement`` Correctly show turntable size and rotation.
- ``Enhancement`` Retrieve coal tower storage amounts.

### v1.1.7 - 11-03-2023

- ``Enhancement`` Added support for Cooke 2-6-0 (Coal Version) Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for ET&WNC 280 Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Mason Bogie Tenmile Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Ruby Basin 2-8-0T Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Skeleton car as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for EBT Hopper as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Coffin Tanker as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Stock car as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for 3-way switch.
- ``Enhancement`` Added support for new coaling towers, water towers and engine sheds.

### v1.1.6 - 26-02-2023

- ``Fixed`` Sprint speed would always show as default speed when reopening the popup/list for cheats.

### v1.1.5 - 04-02-2023

- ``Added`` Support for remotely controlling cranes. (Thanks to [Mordred](https://github.com/mordred-random)).

### v1.1.4 - 22-12-2022

- ``Enhancement`` Added support for Cooke Consolidation as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Plow as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.3 - 15-12-2022

- ``Fixed`` Controls Sync Support for Mosca. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Added`` 45 degree cross and bumper splines.

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