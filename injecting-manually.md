---
layout: info
title: Injecting Manually
---

# Injecting manually

If, for some reason, RROx fails to inject the DLL into the game automatically, you might get one of the following error messages:
 - **Could not access the DLL file. It might have been removed or blocked by your antivirus.**
 - **Failed to inject the DLL. The game is not running.**
 - **DLL injection failed with error code: XXX**

If any of the above errors occur, you can try doing it manually using one of the many DLL injectors available on the internet. For this guide, the Xenos DLL injector is used.

## Downloading Xenos

You can download the Xenos DLL injector on their [GitHub page](https://github.com/DarthTon/Xenos/releases/latest). Under the list of available assets, you should see a file called `Xenos_X.X.X.7z`. Download this file (your antivirus or browser might warn you that this file is unsafe, as you can use this tool for hacking/malicious purposes).

To open the `.7z` file, you will need [7-Zip](https://www.7-zip.org/). When you hve opened the zip file, you should see a file within it called `Xenos64.exe`. Extract this file from the zip file and place it somewhere convenient.

## Injecting the DLL

Open the `Xenos64.exe` file and make sure that under `Process selection`, the type is `Existing`. You should now be able to find the game process in the process dropdown (if you have it running). It should have a name like `arr-Win64-Shipping.exe`. (Do not choose `arr.exe`)

Now go back to RROx and click the attach button. You should get a prompt indicating that ataching has failed, after which you can click `Attach Manually`. You will now see a window with some text explaining how to inject the DLL, including a link to the folder containing the DLL. Click this link to open the folder containing the RROx DLL.

<img src="/RROx/images/dll-injector.JPG">

Now that you have the RROx DLL folder open, drag this DLL into the Xenos injector (or add it manually by clicking the `Add` button in the Xenos injector and going to the correct folder). Now click the `Inject` button in the injector. If everything went well, the popup in RROx should now disappear and everything should be working correctly. You can close the injector after injecting. You will only need it when you restart the game.