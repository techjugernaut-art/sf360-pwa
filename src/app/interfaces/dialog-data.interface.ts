export interface IDialogData {
  title: string;
  actions: DialogActions[];
  data?: any;
}
export enum DialogActions {
  Download = 1,
  Save,
  Apply,
  Cancel,
  Ok,
  Filter,
}
