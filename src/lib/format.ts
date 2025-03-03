import moment from "moment";

export const formatPrice = (price: number) => {
  if (price == null) price = 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

export const formatSeconds = (seconds: number) => {
  const duration = moment.duration(seconds, "seconds");
  const minutes = Math.floor(duration.asMinutes());
  const secs = duration.seconds();

  return `${minutes} minutes ${secs} seconds`;
};

export const formatSecondsToMinutes = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else {
    const minutes = seconds / 60;
    return `${minutes} minutes`;
  }
};