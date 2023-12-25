"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDeepgram = void 0;
const sdk_1 = require("@deepgram/sdk");
const server_1 = require("../server");
let keepAlive = null;
const setupDeepgram = (socket) => {
    let deepgram = null;
    const handleDeepgramClose = () => {
        console.log("deepgram: disconnected");
        if (keepAlive)
            clearInterval(keepAlive);
        if (deepgram)
            deepgram.finish();
    };
    const handleDeepgramError = (error) => {
        console.log("deepgram: error received");
        console.error(error);
    };
    const handleDeepgramWarning = (warning) => {
        console.log("deepgram: warning received");
        console.warn(warning);
    };
    const handleDeepgramTranscript = (data) => {
        var _a;
        console.log("deepgram: transcript received");
        const transcript = ((_a = data.channel.alternatives[0]) === null || _a === void 0 ? void 0 : _a.transcript) || "";
        console.log("socket: transcript sent to client");
        socket.emit("transcript", transcript);
        console.log("socket: transcript data sent to client");
        socket.emit("data", data);
    };
    const handleDeepgramMetadata = (data) => {
        console.log("deepgram: metadata received");
        console.log("socket: metadata sent to client");
        socket.emit("metadata", data);
    };
    const handleDeepgramOpen = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("deepgram: connected");
        deepgram === null || deepgram === void 0 ? void 0 : deepgram.addListener(sdk_1.LiveTranscriptionEvents.Close, handleDeepgramClose);
        deepgram === null || deepgram === void 0 ? void 0 : deepgram.addListener(sdk_1.LiveTranscriptionEvents.Error, handleDeepgramError);
        deepgram === null || deepgram === void 0 ? void 0 : deepgram.addListener(sdk_1.LiveTranscriptionEvents.Warning, handleDeepgramWarning);
        deepgram === null || deepgram === void 0 ? void 0 : deepgram.addListener(sdk_1.LiveTranscriptionEvents.Transcript, handleDeepgramTranscript);
        deepgram === null || deepgram === void 0 ? void 0 : deepgram.addListener(sdk_1.LiveTranscriptionEvents.Metadata, handleDeepgramMetadata);
        if (keepAlive)
            clearInterval(keepAlive);
        keepAlive = setInterval(() => {
            console.log("deepgram: keepalive");
            deepgram === null || deepgram === void 0 ? void 0 : deepgram.keepAlive();
        }, 10 * 1000);
    });
    deepgram = server_1.deepgramClient.listen.live({
        language: "en",
        punctuate: true,
        smart_format: true,
        model: "nova",
    });
    deepgram.addListener(sdk_1.LiveTranscriptionEvents.Open, handleDeepgramOpen);
    return deepgram;
};
exports.setupDeepgram = setupDeepgram;
