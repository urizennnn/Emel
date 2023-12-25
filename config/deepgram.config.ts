import { createClient, LiveTranscriptionEvents, LiveClient } from '@deepgram/sdk';
import { Server, Socket } from 'socket.io';
import { deepgramClient } from '../server';

let keepAlive: NodeJS.Timeout | null = null; 

export const setupDeepgram = (socket: Socket) => {
    let deepgram: LiveClient | null = null;

    const handleDeepgramClose = () => {
        console.log("deepgram: disconnected");
        if (keepAlive) clearInterval(keepAlive);
        if (deepgram) deepgram.finish();
    };

    const handleDeepgramError = (error: Error) => {
        console.log("deepgram: error received");
        console.error(error);
    };

    const handleDeepgramWarning = (warning: Error) => {
        console.log("deepgram: warning received");
        console.warn(warning);
    };

    const handleDeepgramTranscript = (data: any) => {
        console.log("deepgram: transcript received");
        const transcript = data.channel.alternatives[0]?.transcript || "";
        console.log("socket: transcript sent to client");
        socket.emit("transcript", transcript);
        console.log("socket: transcript data sent to client");
        socket.emit("data", data);
    };

    const handleDeepgramMetadata = (data: any) => {
        console.log("deepgram: metadata received");
        console.log("socket: metadata sent to client");
        socket.emit("metadata", data);
    };

    const handleDeepgramOpen = async () => {
        console.log("deepgram: connected");
        deepgram?.addListener(LiveTranscriptionEvents.Close, handleDeepgramClose);
        deepgram?.addListener(LiveTranscriptionEvents.Error, handleDeepgramError);
        deepgram?.addListener(LiveTranscriptionEvents.Warning, handleDeepgramWarning);
        deepgram?.addListener(LiveTranscriptionEvents.Transcript, handleDeepgramTranscript);
        deepgram?.addListener(LiveTranscriptionEvents.Metadata, handleDeepgramMetadata);

        if (keepAlive) clearInterval(keepAlive);
        keepAlive = setInterval(() => {
            console.log("deepgram: keepalive");
            deepgram?.keepAlive();
        }, 10 * 1000);
    };

    deepgram = deepgramClient.listen.live({
        language: "en",
        punctuate: true,
        smart_format: true,
        model: "nova",
    });

    deepgram.addListener(LiveTranscriptionEvents.Open, handleDeepgramOpen);

    return deepgram;
};