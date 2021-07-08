export const formatToDateString = (time: number) => {
  const date = new Date(time);
  return [
    date.getFullYear().toString().padStart(4, "0"),
    "-",
    (date.getMonth() + 1).toString().padStart(2, "0"),
    "-",
    date.getDate().toString().padStart(2, "0"),
  ].join("");
};

export const formatToTimeString = (time: number) => {
  const date = new Date(time);
  return [
    date.getHours().toString().padStart(2, "0"),
    ":",
    date.getMinutes().toString().padStart(2, "0"),
    ":",
    date.getSeconds().toString().padStart(2, "0"),
  ].join("");
};

export const formatToDateTimeString = (time: number) => {
  const date = new Date(time);
  return [
    date.getFullYear().toString().padStart(4, "0"),
    "-",
    (date.getMonth() + 1).toString().padStart(2, "0"),
    "-",
    date.getDate().toString().padStart(2, "0"),
    "T",
    date.getHours().toString().padStart(2, "0"),
    ":",
    date.getMinutes().toString().padStart(2, "0"),
    ":",
    date.getSeconds().toString().padStart(2, "0"),
  ].join("");
};

export const dateStringToLocalMidnightTime = (dateString: string) => {
  const date = new Date(Date.parse(dateString));
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0,
    0
  ).getTime();
};

export const dateStringToUTCMidnightTime = (dateString: string) =>
  toUTCUnixTime(dateStringToLocalMidnightTime(dateString));

export const dateTimeStringToLocalTime = (dateTimeString: string) =>
  new Date(Date.parse(dateTimeString)).getTime();

export const toUTCUnixTime = (time: number) =>
  time - new Date().getTimezoneOffset() * 60000;

export const moveDay = (time: number, moveDays: number): number => {
  const date = new Date(time);
  return new Date(new Date(date).setDate(date.getDate() + moveDays)).getTime();
};

export const setTimeOfDay = (time: number, timeString: string) => {
  const times = timeString.split(":").map((t) => parseInt(t, 10));
  return new Date(time).setHours(times[0], times[1], times[2], 0);
};
