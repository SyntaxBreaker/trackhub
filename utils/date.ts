import dayjs from "dayjs";

function getCurrentDate() {
  const currentDate = new Date();

  return dayjs(currentDate);
}

function calculateRemainingDays(date: string) {
  const currentDate = new Date();

  return dayjs(date).diff(currentDate, "days");
}

export { getCurrentDate, calculateRemainingDays };
