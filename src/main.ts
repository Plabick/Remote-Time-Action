import * as core from "@actions/core";
import * as requests from "@actions/http-client";
import { IHttpClientResponse } from "@actions/http-client/interfaces";

export function windowsTimeToUnixTime(fileTime: number): number {
  // The windows epoch starts 11644473600 seconds before
  // the UNIX epoch and ticks in 100 nanosecond increments
  const EPOCH_DIVISOR = 10000000;
  const OFFSET = 11644473600;
  return fileTime / EPOCH_DIVISOR - OFFSET;
}

async function run(): Promise<void> {
  const timezone: string = core.getInput("timezone").toLowerCase();
  const client: requests.HttpClient = new requests.HttpClient();
  const url = "http://worldclockapi.com/api/json/" + timezone + "/now";
  const responce: IHttpClientResponse = await client.get(url);
  const responce_body: string = await responce.readBody();
  const status_code: number | undefined = responce.message.statusCode;

  if (status_code == undefined || status_code < 200 || status_code >= 400) {
    throw new Error("FAILED TO GET TIME FROM WORLDCLOCK");
  }

  const time_object = JSON.parse(responce_body);
  const currentDateTime: string = time_object.currentDateTime;
  const windowsTime: string = time_object.currentFileTime;
  const unixTime: string = Math.round(
    windowsTimeToUnixTime(parseInt(windowsTime))
  ).toString(10);
  const dayOfTheWeek: string = time_object.dayOfTheWeek;
  const ordinalDate: string = time_object.ordinalDate;
  const isDayLightSavingsTime: string = time_object.isDayLightSavingsTime;

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
}

run();
