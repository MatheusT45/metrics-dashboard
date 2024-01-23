import {
  ChurnRate,
  LifetimeValue,
  RecurringRevenue,
} from "@/models/metrics.model";

const API = import.meta.env.VITE_METRICS_API_URL;

export interface MetricOptions {
  year?: number;
  month?: number;
  filterSubscriptionPlan?: "All" | "Monthly" | "Yearly";
}

export const getChurnRate = async (
  options: MetricOptions,
  file?: File
): Promise<ChurnRate[]> => {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  formData.append("options", JSON.stringify(options));

  const response = await (<Promise<{ data: ChurnRate[] }>>fetch(
    `${API}/churn-rate`,
    {
      method: "POST",
      body: formData,
    }
  ).then((response) => response.json()));

  return response.data;
};

export const getRecurringRevenue = async (
  options: MetricOptions,
  file?: File
): Promise<RecurringRevenue[]> => {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  formData.append("options", JSON.stringify(options));

  const response = await (<Promise<{ data: RecurringRevenue[] }>>fetch(
    `${API}/recurring-revenue`,
    {
      method: "POST",
      body: formData,
    }
  ).then((response) => response.json()));

  return response.data;
};

export const getLifetimeValue = async (
  options: MetricOptions,
  file?: File
): Promise<LifetimeValue[]> => {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  formData.append("options", JSON.stringify(options));

  const response = await (<Promise<{ data: LifetimeValue[] }>>fetch(
    `${API}/lifetime-value`,
    {
      method: "POST",
      body: formData,
    }
  ).then((response) => response.json()));

  return response.data;
};
