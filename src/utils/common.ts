export const getValueByPath = <T extends object, R = any>(obj: T, path: string): R | undefined => {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key as keyof typeof acc];
    }
    return undefined;
  }, obj as any) as R | undefined;
};

export const setValueByPath = <T extends object>(obj: T, path: string, value: any): void => {
  const keys = path.split('.');
  let target: any = obj;

  keys.slice(0, -1).forEach((key, index) => {
    if (!(key in target)) {
      target[key] = {};
    }
    target = target[key];
  });

  target[keys[keys.length - 1]] = value;
};
