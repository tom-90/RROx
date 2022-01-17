#include <Windows.h>
#include <fstream>
#include "engine.h"
#include "pipe.h"
#include "injector.h"
#include <thread>
#include <string>

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
    else if (command == 5) { //Teleport
        uint64_t addrPlayer = communicator->ReadUInt64(stoken);
        float x = communicator->ReadFloat(stoken);
        float y = communicator->ReadFloat(stoken);
        float z = communicator->ReadFloat(stoken);

        if (stoken.stop_requested())
            return;

        logger->WriteString("Teleporting...");
        teleport(addrPlayer, x, y, z);
        logger->WriteString("Teleported.");
    }
    else if (command == 6) { //Set money and xp
        uint64_t addrPlayer = communicator->ReadUInt64(stoken);
        float money = communicator->ReadFloat(stoken);
        int xp = communicator->ReadInt(stoken);

        if (stoken.stop_requested())
            return;

        logger->WriteString("Setting Money and XP...");
        setMoneyAndXP(addrPlayer, money, xp);
        logger->WriteString("Set Money and XP.");
    }
    else if (command == 7) {
        uint64_t addrPlayer = communicator->ReadUInt64(stoken);

        char type = communicator->ReadInt(stoken);

        int pointCount = communicator->ReadInt(stoken);

        FVector* controlPoints = new FVector[pointCount];
        for (int i = 0; i < pointCount; i++) {
            float x = communicator->ReadFloat(stoken);
            float y = communicator->ReadFloat(stoken);
            float z = communicator->ReadFloat(stoken);
            controlPoints[i] = FVector(x, y, z);
        }

        logger->WriteString(std::to_string((uint64_t)controlPoints));

        if (stoken.stop_requested())
            return;

        // We read in all data, but if there are too few points, we ignore the command
        if (pointCount < 2) {
            delete[] controlPoints;
            continue;
        }

        logger->WriteString("Spawning spline...");
        spawnSpline(addrPlayer, type, controlPoints, pointCount);
        logger->WriteString("Spawned spline.");

        delete[] controlPoints;
    }
    else if (command == 8) { //Read height
        uint64_t addrKismet = communicator->ReadUInt64(stoken);
        uint64_t addrWorldObj = communicator->ReadUInt64(stoken);

        int ignoredLength = communicator->ReadInt(stoken);

        AActor** ignoredActors = new AActor*[ignoredLength];
        for (int i = 0; i < ignoredLength; i++) {
            AActor* actor = (AActor*)communicator->ReadUInt64(stoken);
            ignoredActors[i] = actor;
        }

        float x = communicator->ReadFloat(stoken);
        float y = communicator->ReadFloat(stoken);

        if (stoken.stop_requested())
            return;

        float height = readHeight(addrKismet, addrWorldObj, ignoredActors, ignoredLength, x, y);
        communicator->WriteFloat(height);
    }
    else if (command == 9) { // Remove (hide) point from spline
        uint64_t addrSpline = communicator->ReadUInt64(stoken);
        int index = communicator->ReadInt(stoken);

        if (stoken.stop_requested())
            return;

        logger->WriteString("Removing point from spline...");
        hideLastSplinePoint(addrSpline, index);
        logger->WriteString("Removed point from spline.");
    }
    else if (command == 10) { // Toggle pause
        uint64_t addrPlayerController = communicator->ReadUInt64(stoken);

        if (stoken.stop_requested())
            return;

        logger->WriteString("Toggling pause...");
        toggleGamePause(addrPlayerController);
        logger->WriteString("Toggled paused.");
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

