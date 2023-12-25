"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// @ts-ignore
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use((0, morgan_1.default)('dev'));
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public', 'test.html'));
});
io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('test', () => {
        console.log('clicked');
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
