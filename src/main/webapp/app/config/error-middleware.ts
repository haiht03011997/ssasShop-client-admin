const getErrorMessage = errorData => {
  let message = errorData.message;
  if (errorData.fieldErrors) {
    errorData.fieldErrors.forEach(fErr => {
      message += `\nfield: ${fErr.field},  Object: ${fErr.objectName}, message: ${fErr.message}\n`;
    });
  }
  return message;
};

export default () => next => action => {
  /**
   *
   * The error middleware serves to log error messages from dispatch
   * It need not run in production
   */
  // if (DEVELOPMENT) {
  //   const { error, payload } = action;
  //   if (error || payload) {
  //     console.error(`${action.type} caught at middleware with reason: ${JSON.stringify(payload?.message || error?.message)}.`);
  //     if ((error?.response && error?.response?.data) || (payload?.response && payload?.response.data)) {
  //       const message = getErrorMessage(error?.response?.data || payload?.response?.data);
  //       console.error(`Actual cause: ${message}`);
  //     }
  //   }
  // }
  // Dispatch initial action
  return next(action);
};
