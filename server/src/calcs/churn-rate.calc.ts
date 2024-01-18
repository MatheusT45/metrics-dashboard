import { Subscription } from 'rxjs';
import { Month } from 'src/models/subscription.model';

export const getChurnRate = (
  subscriptions: Subscription[],
  month: Month = 'jan',
): any => {
  console.log(subscriptions, month);
};
