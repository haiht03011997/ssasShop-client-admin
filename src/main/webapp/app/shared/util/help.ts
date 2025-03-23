export const formatCurrencyVND = value => {
  // Format the value as VND
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parseCurrencyVND = value => {
  // Remove non-numeric characters and parse the value
  const parsedValue = value.replace(/₫\s?|(,*)/g, '');

  return parsedValue;
};

export const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
