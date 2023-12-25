"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const deepgram_config_1 = require("./deepgram.config");
const connect = (io) => {
    io.on("connection", (socket) => {
        console.log("socket: client connected");
        let deepgram = (0, deepgram_config_1.setupDeepgram)(socket);
        socket.on("packet-sent", (data) => {
            console.log("socket: client data received");
            if ((deepgram === null || deepgram === void 0 ? void 0 : deepgram.getReadyState()) === 1 /* OPEN */) {
                console.log("socket: data sent to deepgram");
                deepgram === null || deepgram === void 0 ? void 0 : deepgram.send(data);
            }
            else if (deepgram && deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
                console.log("socket: data couldn't be sent to deepgram");
                console.log("socket: retrying connection to deepgram");
                /* Attempt to reopen the Deepgram connection */
                deepgram.finish();
                deepgram.removeAllListeners();
                deepgram = (0, deepgram_config_1.setupDeepgram)(socket);
            }
            else {
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
};
exports.connect = connect;
