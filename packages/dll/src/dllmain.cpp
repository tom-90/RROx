#include <Windows.h>
#include "injector.h"
#include <thread>

std::jthread injectorThread;

BOOL WINAPI DllMain(HINSTANCE dll, DWORD reason, LPVOID lpReserved);

void run(std::stop_token stoken) {
    HMODULE dll;

    GetModuleHandleEx
    (
        GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS,
        (LPCTSTR)DllMain,
        &dll
    );

    injector.stopToken = stoken;

    injector.log("Loading...");

    injector.load();

    injector.log("Stopping...");
    injector.stop();

    FreeLibraryAndExitThread(dll, 0);
}

BOOL WINAPI DllMain(HINSTANCE dll, DWORD reason, LPVOID lpReserved)
{
    switch (reason)
    {
    case DLL_PROCESS_ATTACH:
    {
        DisableThreadLibraryCalls(dll);

        injectorThread = std::jthread(run);

        break;
    }
    }
    return TRUE;
}

