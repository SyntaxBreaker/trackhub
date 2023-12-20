import { Alert as MUIAlert } from "@mui/material";
import { IAlertStatus } from "../../types/alertStatus";

export default function Alert({ status, message }: IAlertStatus) {
  return <MUIAlert severity={status}>{message}</MUIAlert>;
}
