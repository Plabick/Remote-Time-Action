# Remote Time
[![Node.js CI](https://github.com/Plabick/InternetTime/actions/workflows/CI.yml/badge.svg)](https://github.com/Plabick/InternetTime/actions/workflows/CI.yml)

A lightweight GitHub Action to get the current time from the WorldClock time server in a variety of formats. Get consistent times for status monitoring, timestamping, and more without worrying about inconsistencies between build agents. 

## Input
|Name|Description|Required?|Example|
|----|----|----|----|
|timezone|The [timezone code](https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations) to display the current time in. Case insensitive. Defaults to utc (+0)'|No|EST|

## Output
|Name|Description|Example|
|----|----|----|
|dateTime|The current date and time|2021-05-30T18:38-04:00|
|dayOfTheWeek|The day of the week|Saturday|
|unixTime|The Unix epoch time, the number of seconds that have elapsed since January 1, 1970, rounded to the nearest second|1622410833|
|windowsTime|The Windows FILETIME timestamp, the number of 100-nanosecond intervals since the beginning of the year 1601|132668721308032423|
|ordinalDate|The current year and number of days since January 1st|2021-150|
|isDayLightSavingsTime|A boolean describing if the requested time reflects daylight savings time|false|

## Example Usage
``` yaml
- name: Get Time
  id: time
  uses: Plabick/Remote-Time-Action@V1.0

  with:
    timezone: 'EST'
  
- name: Display Unix Epoch Time
  run: 'echo "${{steps.time.outputs.epochTime}}"'
```
