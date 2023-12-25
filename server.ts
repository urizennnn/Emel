import express, { Request, Response } from 'express';
import cors from 'cors';
import logger from 'morgan';
import http from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path';
import { createClient} from '@deepgram/sdk';
import dotenv from 'dotenv';
import { setupDeepgram } from './config/deepgram.config';
import { connect } from './config/IO.config';

dotenv.config();

export const deepgramClient = createClient(process.env.AI as string);
const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

connect(io)


app.use(express.static(path.join(__dirname, '../public')));
app.use(logger('dev'));

const PORT = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public', 'test.html'));
});


server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
