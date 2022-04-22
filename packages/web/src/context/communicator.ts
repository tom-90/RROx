import React from "react";
import { SocketCommunicator } from "../communicator";

export const SocketCommunicatorContext = React.createContext<SocketCommunicator | undefined>( undefined );