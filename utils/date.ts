import dayjs from "dayjs";

export default function () {
    const currentDate = new Date();

    return dayjs(currentDate);
}