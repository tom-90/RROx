#include <Windows.h>
#include <fstream>
#include "engine.h"
#include "pipe.h"
#include "injector.h"
#include <thread>

void run(std::stop_token stoken, HMODULE dll) {
  while (!stoken.stop_requested()) {
    int command = communicator->ReadIntOrRecover(stoken);

    if (command == 1) { //Save Game
      uint64_t addr = communicator->ReadUInt64(stoken);
      int slotIndex = communicator->ReadInt(stoken);

      if (stoken.stop_requested())
        return;

      logger->WriteString("Saving...");
      save(addr, slotIndex);
      logger->WriteString("Saved.");
    } else if (command == 2) { //Change Switch
        uint64_t addrSwitch = communicator->ReadUInt64(stoken);
        uint64_t addrPlayer = communicator->ReadUInt64(stoken);

        if (stoken.stop_requested())
            return;

        logger->WriteString("Changing Switch...");
        changeSwitch(addrSwitch, addrPlayer);
        logger->WriteString("Switch Changed.");
    } else if (command == 3) { //Set Engine Controlers
        int type = communicator->ReadInt(stoken);
        uint64_t addrPlayer = communicator->ReadUInt64(stoken);
        uint64_t addrControl = communicator->ReadUInt64(stoken);
        uint64_t addrFramecar = communicator->ReadUInt64(stoken);
        float value = communicator->ReadFloat(stoken);

        if (stoken.stop_requested())
            return;

        logger->WriteString("Setting Engine Controls...");
        setEngineControls(type, addrPlayer, addrControl, addrFramecar, value);
        logger->WriteString("Engine Controls Set.");
    }
    else if (command == 4) { //Check if Is Server
        uint64_t addrKismet = communicator->ReadUInt64(stoken);
        uint64_t addrWorld = communicator->ReadUInt64(stoken);

        if (stoken.stop_requested())
            return;

        bool checked = isServerHost(addrKismet, addrWorld);
        communicator->WriteInt(checked);
    }
  }
}

std::jthread injectorThread;

BOOL WINAPI DllMain( HINSTANCE dll, DWORD reason, LPVOID lpReserved )
{
    switch (reason)
    {
    case DLL_PROCESS_ATTACH:
    {
      DisableThreadLibraryCalls(dll);

      logger = new NamedPipe("DIL"); //DLL Injector Logger
      communicator = new NamedPipe("DID"); //DLL Injector Data
      logger->WriteString("Initializing Engine...");

      if (!EngineInit()) {
        logger->WriteString("Failed Initializing Engine");
        logger->Close();
        communicator->Close();
        return false;
      }


      logger->WriteString("Initialized Engine");

      injectorThread = std::jthread(run, dll);
      break;
    }
    case DLL_PROCESS_DETACH:
      logger->WriteString("Detaching DLL");
      injectorThread.request_stop();
      logger->Close();
      communicator->Close();
      break;
    }
    return TRUE;
}

