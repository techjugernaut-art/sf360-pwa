import { CurrencyEnums } from 'src/app/utils/enums.util';
import * as moment from 'moment';

export const datePickerRanges = {
  'Today': [moment(), moment()],
  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  '1 Year': [moment().subtract(1, 'year'), moment()]
};

export const datePickerLocales = {
  format: 'MM/DD/YYYY',
  direction: 'ltr', // could be rtl
  weekLabel: 'W',
  separator: ' - ',
  cancelLabel: 'Cancel',
  applyLabel: 'Filter',
  clearLabel: 'Clear',
  customRangeLabel: 'Custom range',
  daysOfWeek: moment.weekdaysMin(),
  monthNames: moment.monthsShort(),
  firstDay: 1
};
export const decimalOnlyRegex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
export const pinRegex: RegExp = new RegExp(/^(?!(\d)\1+$|(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)|9(?=0)){5}\d$|(?:0(?=9)|1(?=0)|2(?=1)|3(?=2)|4(?=3)|5(?=4)|6(?=5)|7(?=6)|8(?=7)|9(?=8)){5}\d$)\d{6}$/g)

export function toFormData<T>( formValue: T ) {
  const formData = new FormData();

  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key];
    formData.append(key, value);
  }

  return formData;
}

export const CurrenciesMap = {
  GHS: 'cedis',
  NGN: 'naira',
  KES: 'shillings',
  ZAR: 'rand',
  EUR: 'euros',
  CHF: 'francs',
  USD: 'dollars'
}
