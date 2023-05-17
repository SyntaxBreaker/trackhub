import dayjs from "dayjs";

export default function () {
    const currentDate = new Date();

    return dayjs(currentDate);
}

function calculateRemainingDays(date: string) {
    const currentDate = new Date();

    return dayjs(date).diff(currentDate, 'days');
}

export {
    calculateRemainingDays
}