# Error Code Troubleshooting

This page provides an overview of the troubleshooting steps to take for various error codes that RROx can give.

### `MSVCR120_MISSING`

This error code can be shown when RROx fails to attach, because a necessary program is not installed on your computer.

To fix this error code, download [Microsoft Visual C++ 2013 Redistributable x86](https://aka.ms/highdpimfc2013x86enu).

### `MISSING_ELEVATE_EXE`, `MISSING_INJECTOR_EXE`, `MISSING_DLL`

When RROx shows one of these error codes, it means that one of the essential files that RROx needs to attach to the game is missing. This most likely means that your antivirus has detected this file as a virus and removed it.

To fix this error, first make sure that the following folder is added to the exceptions of your antivirus software: ``%localappdata%\RailroadsOnlineExtended``. This will make sure the files are not deleted again.

After adding the exception, you can download and run the RROx setup file again, which will recreate the missing files.