export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    message: (message: IMessage) => void;
}

export interface ClientToServerEvents {
    joinRoom: (roomId: string) => void;
    sendMessage: (message: IMessage) => void;
}