import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
declare const Lobibox;
declare const $;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private _snackBar: MatSnackBar
  ) { }
  /**
  *Show an info notification
  *@param title message title
  *@param message message to display
   */
  info(title, message) {
    Lobibox.notify('info', {
      position: 'top right',
      sound: false,
      delayIndicator: false,
      title: title,
      msg: message
    });
  }
  /**
  *Show an info notification
  *@param title message title
  *@param message message to display
  @param url url
   */
  infoWithURL(title, message, url) {
    Lobibox.notify('info', {
      position: 'bottom right',
      sound: false,
      delayIndicator: false,
      title: title,
      msg: message,
      onClickUrl: url
    });
  }
  /**
  *Show an info notification
  *@param title message title
  *@param message message to display
   */
  infoBottomRight(title, message) {
    Lobibox.notify('info', {
      position: 'bottom right',
      sound: false,
      delayIndicator: false,
      title: title,
      msg: message
    });
  }
  /**
  *Show an error notification
  *@param title message title
  *@param message message to display
   */
  error(title, message) {
    Lobibox.notify('error', {
      position: 'top right',
      sound: false,
      delayIndicator: false,
      title: title,
      msg: message
    });
  }

  /**
  *Show a success notification
  *@param title message title
  *@param message message to display
   */
  success(title, message) {
    Lobibox.notify('success', {
      position: 'top right',
      sound: false,
      delayIndicator: false,
      title: title,
      msg: message
    });
  }
   /**
  *Show a default notification
  *@param title message title
  *@param message message to display
   */
  default(title, message) {
    Lobibox.notify('default', {
      position: 'top right',
      sound: false,
      delayIndicator: false,
      title: title,
      msg: message
    });
  }
  /**
  *Show a warning notification
  *@param title message title
  *@param message message to display
   */
  warning(title, message) {
    Lobibox.notify('warning', {
      position: 'top right',
      delayIndicator: false,
      sound: false,
      title: title,
      msg: message
    });
  }
   /**
  *Show a progress notification
  *@param title message title
  *@param message label to display
   */
  progress(title, message) {
    Lobibox.progress('progress', {
      position: 'top right',
      sound: false,
      title: title,
      label: message
    });
  }
   /**
  *Shows an info alert that blocks the whole page
  *@param message message to display
   */
  infoAlert(message) {
    Lobibox.alert('info', {msg: message});
  }
   /**
  *Shows a success alert that blocks the whole page
  *@param message message to display
   */
  successAlert(message) {
    Lobibox.alert('success', {msg: message});
  }
   /**
  *Shows an error alert that blocks the whole page
  *@param message message to display
   */
  errorAlert(message) {
    Lobibox.alert('error', {msg: message});
  }
  /**
  *Shows a warning alert that blocks the whole page
  *@param message message to display
   */
  warningAlert(message) {
    Lobibox.alert('warning', {msg: message});
  }
  /**
   * Warning message position to center top
   * @param message message
   */
  warningCenterTop(message) {
    Lobibox.notify('warning', {
      size: 'mini',
      delayIndicator: false,
      rounded: true,
      position: 'center top',
      msg: message
      });
  }
  /**
   * Warning message position to center top
   * @param message message
   */
  warningInstance(message) {
    return Lobibox.notify('warning', {
      size: 'mini',
      delay: false,
      rounded: true,
      position: 'top right',
      msg: message
      });
  }
  /**
   * info message position to center top
   * @param message message
   */
  infoMessage(message) {
    Lobibox.notify('info', {
      size: 'mini',
      rounded: true,
      position: 'top right',
      delayIndicator: false,
      msg: message
      });
  }
  snackBarMessage(message) {
    this._snackBar.open(message, null, {
      duration: 5000
    });
  }
  /**
   * Snack bar error message
   * @param message message to show
   */
  snackBarErrorMessage(message) {
    this._snackBar.open(message, null, {
      duration: 5000
    });
  }
}
