import { io } from "../server";
import { LiveClient } from "@deepgram/sdk";
import { setupDeepgram } from "./deepgram.config";

io.on("connection", (socket) => {
    console.log("socket: client connected");
    let deepgram: LiveClient | null = setupDeepgram(socket);

    socket.on("packet-sent", (data) => {
        console.log("socket: client data received");

        if (deepgram?.getReadyState() === 1 /* OPEN */) {
            console.log("socket: data sent to deepgram");
            deepgram?.send(data);
        } else if (deepgram && deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
            console.log("socket: data couldn't be sent to deepgram");
            console.log("socket: retrying connection to deepgram");
            /* Attempt to reopen the Deepgram connection */
            deepgram.finish();
            deepgram.removeAllListeners();
            deepgram = setupDeepgram(socket);
        } else {
            console.log("socket: data couldn't be sent to deepgram");
        }
    });

    socket.on("disconnect", () => {
        console.log("socket: client disconnected");
        if (deepgram) {
            deepgram.finish();
            deepgram.removeAllListeners();
            deepgram = null;
        }
    });
});
