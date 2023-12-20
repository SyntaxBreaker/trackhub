interface IAlertStatus {
  status: "error" | "info" | "success" | "warning";
  message: string;
}

export type { IAlertStatus };
