export const options = (values: any, label: string, value: string) => {
  if (!(Array.isArray(values) && values.length <= 0)) return [];

  return values.map((val) => ({ label: val?.[label], value: val?.[value] }));
};

export const optionsOfObject = (values: object) => {
  if (!values) return [];

  return Object.entries(values).map(([key, value]) => ({
    label: key
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()), 
    value,
  }));
};
