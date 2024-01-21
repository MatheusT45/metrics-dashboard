const API = import.meta.env.VITE_METRICS_API_URL;

export interface MetricOptions {
  year?: number;
  month?: number;
  filterSubscriptionPlan?: "All" | "Monthly" | "Yearly";
}

export const getChurnRate = async (options: MetricOptions, file?: File) => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  formData.append("options", JSON.stringify(options));
  return fetch(`${API}/churn-rate`, {
    method: "POST",
    body: formData,
  }).then((response) => response.json());
};

export const getRecurringRevenue = async (
  options: MetricOptions,
  file?: File
) => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  formData.append("options", JSON.stringify(options));
  return fetch(`${API}/recurring-revenue`, {
    method: "POST",
    body: formData,
  }).then((response) => response.json());
};
