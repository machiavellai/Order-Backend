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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const redis_1 = require("redis");
// Redis client setup
const redisClient = (0, redis_1.createClient)({
    url: config_1.REDIS_URL || 'redis://localhost:6379' // Redis URL (use default or from config)
});
exports.redisClient = redisClient;
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.MONGO_URI);
        console.log('connected to DB');
        //redis connection
        redisClient.on('error', (err) => console.log('Redis Client Error', err));
        yield redisClient.connect();
        console.log('Connected to Redis');
    }
    catch (err) {
        console.log('error' + err);
    }
});
//# sourceMappingURL=Database.js.map