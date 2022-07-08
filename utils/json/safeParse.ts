const safeJSONParse = <T extends any = any>(data: string = '', defaultValue?: T): T | undefined => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return defaultValue ?? void 0;
  }
};

export default safeJSONParse;
