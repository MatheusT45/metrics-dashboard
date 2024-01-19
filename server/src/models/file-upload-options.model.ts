export type Options = {
  month?: number;
  year?: number;
  separator?: string;
  startDateField?: string;
  statusDateField?: string;
  cancellationDateField?: string;
  activeField?: string;
  activeFieldValue?: string;
  chargeAmountField?: string;
  chargeFrequencyInDaysField?: string;
  nextCycleField?: string;
  idField?: string;
};

export type BodyOptions = {
  options: string;
};
