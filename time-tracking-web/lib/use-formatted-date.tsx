import { format } from 'date-fns';

export const useFormattedDate = (
  date: Date | null | undefined,
  dateFormat = 'MM/dd/yyyy'
): string => {
  if (!date) {
    return 'N/A';
  }
  return format(new Date(date), dateFormat);
};
