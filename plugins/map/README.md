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

By clicking on an industry, you can open up the industry info (see Freight Information above). Additionally this window allows you to remotely control the cranes at this industry. It is also possible to control cranes by clicking on them on the map.

## Cheats

### Teleporting

It is possible to teleport to any engine, caboose, waycar, industry, firewood depot, coaling tower, water tower or sandhouse by clicking on it and clicking on `Teleport Here`. It is also possible to right-click anywhere on the map and choosing `Teleport Here`.

### Setting Money & XP

By clicking on a player, and clicking on the `Cheats`-button it is possible to increase the player's money or XP. (By setting negative values, it is also possible to decrease money or XP).

### Flying & Fast Sprint

Flying and fast sprint can be enabled from the same `Cheats`-menu.

![](https://raw.githubusercontent.com/tom-90/RROx/master/plugins/map/docs/cheats.png)

## Information Lists

Helpful information read from your game world.

### Rolling Stock

Details, locate functionality, and controls for the various rolling stock in the game world.

### Player List

Names, locate functionality, and cheat menu for all the connected players

### Industry List

Details and storage amounts for the primary industries and the fueling buildings within the game world.
-This also includes a Reference Chart for all the Industy Inputs and Outputs on each Difficulty Setting.
Also provided are accurate Cargo Prices and Capacities for all items and Rolling Stock.

## Helpful Extras Items

### Player Camera/Model Reset
Added button to RROx Player List. This addresses/fixes RRO game issue/bug noted after RRO update #230324; where player model/camera turns/rotates after leaving locomotives

### Rolling Stock (Framecar) Reset Location Functionality (Game/Session Hosts  List
Added Button to RROx Rolling Stock popup on RROx Map to allow Game/Session Host (will not display/work for RROx Clients) to reset rolling stock locations.
-This allows the Host to return stuck rolling stock to origin point in the world (may need re-railing after reset, but this can/will retrive your stuck rolling stock).
-Please be aware of the following:
	-Momement is kept during/after location reset due to Game Logic/Implementation.
	-May also have unexpected issues on larger saves with many phyiscs calculations (try only doing one car at a time on a fresh load in this case).
	-Please allow framecar/rolling stock to come to a rest/stop before repeating/resetting another item (including the same item).

# Settings

## Map Background

The Map background can be customized. Two high resolution backgrounds are available that are highly detailled when zooming all the way in. It is also possible to choose one of the community created backgrounds, or to choose the default in-game map image.

## Colors

Every color that is used on the map can be customized under the colors settings menu. This includes the color scheme for all locomotives and freight cars, as well as all other map elements like tracks, grade, bridges, and switches.

It is not possible to customize the images used for the industries, water towers, firewood depots and sandhouses.

## Minimap

It is possible to enable the minimap under the minimap settings. **The minimap will only show if the game overlay is enabled under the `Overlay` settings**.

## Changelog

### v1.1.21 19-12-2023
- ``Fixed`` Issues after recent game updates.
- ``Fixed`` Turntable size incorrect.
- ``Enhancement`` Added new icons for the new rolling stock. (Thanks to [illudedPerception](https://github.com/illudedPerception))

Note: this update does not include graphics for the new freight types and industries yet. These will come in the future.

### v1.1.20 27-11-2023
- ``Fixed`` RROx Speed Readout issue after Game Build #0.6.0.0.3. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added RROx Map Image for "Wheat Farm" Industry; which now appears correctly on the RROx Map. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added RROx Icon for "Seed Pallet" Product/Freight/Cargo. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added RROx Icon for "Straw Bale" Product/Freight/Cargo. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added RROx Icon for "Grain" Product/Freight/Cargo. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Improved icons for the freight rolling stock to include the new cargo types ("Seed Pallet", "Straw Bale", "Grain"). (Thanks to [illudedPerception](https://github.com/illudedPerception))
- ``Enhancement`` Updated RROx "Economy Information" for new "Wheat Farm" Industry. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Updated RROx "Cargo Prices & Car Capacties" for new the freight/cargo types ("Seed Pallet", "Straw Bale", "Grain"). (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.18 & v1.1.19 19-11-2023
- ``Fixed`` Issues where unknown rolling stock could crash the RROx map.
- ``Fixed`` Issues where some industries might not have showed up correctly.

### v1.1.17 14-11-2023
- ``Fixed`` Issues after new game update

Note: this update does not include graphics for the new freight types and industry yet. This will come in the future. This update is purely meant to get RROx working again for the new update.

### v1.1.16 14-10-2023
- ``Enhancement`` Added support for Lima 280 Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "DSPRR Coach" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for new D&RG Water Tower. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added new background selection option for new "Lake Valley" Map. Please note that the RROx Background is manually selected. (Having this auto select the correct Map Background would need additional support from the Game Developers). (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added new images for the Lima 280 Locomotive, DSPRR Coach, and the "Lake Valley" Map (same as in-game). (Thanks to [Mordred](https://github.com/mordred-random) & [illudedPerception](https://github.com/illudedPerception))
- ``Enhancement`` Added new two other new images for the "Lake Valley" Map, provided by the RRO community. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added high-resolution contour-based maps for Lake Valley.
- ``Enhancement`` Added ability to teleport to the new "DSPRR Coach" within RROx. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.15 09-09-2023
- ``Enhancement`` Added Support for "Wood Rick" as a new Industry/fueling building/facility. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` New and improved icons for the Gregg/{lantation freight rolling stock. (Thanks to [illudedPerception](https://github.com/illudedPerception))

### v1.1.14 06-07-2023
- ``Fixed`` Added missing Rolling Stock Cargo Capacities to the "Industry list" functionality, for the "Greg"/"Plantation" and "Waialua" cars that were missing. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Split the "Economy Information Tab" on the "Industry list" functionality to only contain the Industry Inputs/Outputs for clarity. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Created Dynamic "Cargo Prices & Capacities" to accurately and easily display all Cargo Capacities by Item/Rolling Stock Car for clarity. These can be expanded to only view the full details for the cargo/item the user wishes to view. This will allow for quick updates should the Game Economy/Capacities change at a later date. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.13 27-06-2023
- ``Enhancement`` Added Support for "Gregg Sugar Cane Cane Flat" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Logging Flat" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Stake Flat" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Bulkhead Flat" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Lowside Gondola" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Medium Gondola" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Gregg Sugar Cane Highside Gondola" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "EWA Plantation Box Car" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for "Waualua Agricultural Tank Car" as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.12 27-05-2023
- ``Fixed`` Corrected text colours on the Industry Information List Tables. These will now correctly be readable in both RROx Light and Dark Themes. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Fixed`` Corrected text colours on the Economy Information Tab Tables. These will now correctly be readable in both RROx Light and Dark Themes. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Fixed`` Corrected text colours on the Rolling Stock List. These will now correctly be readable in both RROx Light and Dark Themes. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Improved Rolling Stock Map Color Settings/Options to allow for the option to display/differentiate between "Partially Loaded" and "Fully Loaded" cars. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Support for new Steel Truss Bridges. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.11 17-04-2023
- ``Fixed`` Corrected Cargo Icons/Images showing incorrect prices. These have been adjusted to only show the cargo/item being transported. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Fixed`` Map Plugin Backgrounds #1 and #5, to remove incorrect prices. These have been adjusted to remove the cargo/price details & fully support any map (including moved industries). (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Economy Information Tab to the Industry list functionality. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added "Industry Inputs and Outputs Reference Chart" to the Economy Information Tab on the Industry list menu. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added "Item/Cargo Prices Reference Chart" to the Economy Information Tab on the Industry list menu. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Fixed`` Fixed Freight Info Image in Map Plugin Description/Documentation to align with current RROx Functionality. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Seperated Rolling Stock lists for Tenders and Cabooses/Miscellaneous Rolling Stock for ease of finding non-tenders on larger sessions. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added Button to Rolling Stock popup on RROx Map to allow Game/Session Host (will not display/work for RROx Clients) to reset rolling stock locations. This allows the Host to return stuck rolling stock to origin point in the world (may need re-railing after reset, but this can/will retrive your stuck rolling stock). Note: Momement is kept during/after location reset due to Game Logic/Implementation. May also have unexpected issues on larger saves with many phyiscs calculations (try only doing one car at a time on a fresh load in this case). Please allow framecar/rolling stock to come to a rest/stop before repeating/resetting another item (including the same item). (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Teleporting to a non-industries/buildings/rolling stock will close the Teleport Pop-up on the map after the teleport is called. (See RROx logs in the RROx settings should a Teleport be unsuccessful). (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.10 04-04-2023
- ``Enhancement`` Added Reset Player Camera/Model button to RROx Player list functionality. This addresses/fixes RRO game issue/bug noted after RRO update #230324; where player model/camera turns/rotates after leaving locomotives. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.9 - 22-03-2023
- ``Added`` Industry list functionality. (Thanks to [Mordred](https://github.com/mordred-random))

### v1.1.8 - 13-03-2023
- ``Fixed`` Corrected missing lead on both 3-way (left) switches. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Work on correctly displaying large turn table with correct size.
- ``Enhancement`` Show coal tower storage amounts.

### v1.1.7 - 11-03-2023

- ``Enhancement`` Added support for Cooke 2-6-0 (Coal Version) Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for ET&WNC 280 Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Mason Bogie Tenmile Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Ruby Basin 2-8-0T Locomotive as new locomotive type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Skeleton car as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for EBT Hopper as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Coffin Tanker as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for Stock car as new rolling stock type. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Added`` New and improved icons for the new locomotives. (Thanks to [illudedPerception](https://github.com/illudedPerception))
- ``Added`` New and improved icons for the new freight rolling stock. (Thanks to [illudedPerception](https://github.com/illudedPerception))
- ``Fixed`` Adjusted Tender Controls Pop-up to list "Fuel Amount" instead of "Firewood Amount" (in support of new Coal powered locomotives and consistency with Locomotive Controls). (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added support for 3-way switch.
- ``Enhancement`` Added support for new coaling towers, water towers and engine sheds.
 
### v1.1.6 - 26-02-2023

- ``Enhancement`` Added a collapsible cheat menu to the player list. (Thanks to [bigyihsuan](https://github.com/bigyihsuan))
- ``Added`` New and improved icons for the newer locomotives. (Thanks to [illudedPerception](https://github.com/illudedPerception))

### v1.1.5 - 04-02-2023

- ``Added`` Support for remotely controlling cranes. (Thanks to [Mordred](https://github.com/mordred-random)).
- ``Added`` Cranes now show up on the map and can be activated by clicking on them, or by using the information popup of the industry.
- ``Added`` Player list functionality. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added player image to existing RROx Map Search popup. (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Support for teleporting directly to waycars (Similar to Engines & Cabooses). (Thanks to [Mordred](https://github.com/mordred-random))
- ``Enhancement`` Added locate button on the Rolling Stock Controls popup, when using the RROx normal/desktop view. (Note: This is not supported using the RROx Overlay Map). (Thanks to [Mordred](https://github.com/mordred-random))

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