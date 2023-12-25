"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.deepgramClient = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const sdk_1 = require("@deepgram/sdk");
const dotenv_1 = __importDefault(require("dotenv"));
const IO_config_1 = require("./config/IO.config");
dotenv_1.default.config();
exports.deepgramClient = (0, sdk_1.createClient)(process.env.AI);
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
(0, IO_config_1.connect)(exports.io);
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use((0, morgan_1.default)('dev'));
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public', 'test.html'));
});
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
