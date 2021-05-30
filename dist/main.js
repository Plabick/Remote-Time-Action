"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.windowsTimeToUnixTime = void 0;
const core = __importStar(require("@actions/core"));
const requests = __importStar(require("@actions/http-client"));
function windowsTimeToUnixTime(fileTime) {
    // The windows epoch starts 11644473600 seconds before
    // the UNIX epoch and ticks in 100 nanosecond increments
    const EPOCH_DIVISOR = 10000000;
    const OFFSET = 11644473600;
    return fileTime / EPOCH_DIVISOR - OFFSET;
}
exports.windowsTimeToUnixTime = windowsTimeToUnixTime;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const timezone = core.getInput("timezone").toLowerCase();
        const client = new requests.HttpClient();
        const url = "http://worldclockapi.com/api/json/" + timezone + "/now";
        const responce = yield client.get(url);
        const responce_body = yield responce.readBody();
        const status_code = responce.message.statusCode;
        if (status_code == undefined || status_code < 200 || status_code >= 400) {
            throw new Error("FAILED TO GET TIME FROM WORLDCLOCK");
        }
        const time_object = JSON.parse(responce_body);
        const currentDateTime = time_object.currentDateTime;
        const windowsTime = time_object.currentFileTime;
        const unixTime = Math.round(windowsTimeToUnixTime(parseInt(windowsTime))).toString(10);
        const dayOfTheWeek = time_object.dayOfTheWeek;
        const ordinalDate = time_object.ordinalDate;
        const isDayLightSavingsTime = time_object.isDayLightSavingsTime;
        if (currentDateTime == null) {
            throw new Error('INVALID TIMEZONE "' + timezone + '"');
        }
        console.log("DateTime: " + currentDateTime);
        console.log("Day of the week: " + dayOfTheWeek);
        console.log("Unix Time: " + unixTime);
        console.log("Windows Time: " + windowsTime);
        console.log("Ordinal Date: " + ordinalDate);
        console.log("Is Daylight Savings Time: " + isDayLightSavingsTime);
        core.setOutput("dateTime", currentDateTime);
        core.setOutput("dayOfTheWeek", dayOfTheWeek);
        core.setOutput("unixTime", unixTime);
        core.setOutput("windowsTime", windowsTime);
        core.setOutput("ordinalDate", ordinalDate);
        core.setOutput("isDayLightSavingsTime", isDayLightSavingsTime);
    });
}
run();
