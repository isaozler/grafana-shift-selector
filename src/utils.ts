export const getBreweryUUID = (name: string): string | null => {
  const matched = new RegExp(/\((\w+)\)/g).exec(name);
  if (!!matched) {
    const [, breweryUUID] = matched;
    return breweryUUID;
  }
  return null;
};

export const buttonTypes = (label: string) => {
  const mapping: any = {
    'sunset-down': ['afternoon', 'middag'],
    sunny: ['morning', 'morgen', 'day'],
    night: ['night', 'nacht'],
  };
  label = label.trim().toLowerCase();

  return Object.keys(mapping).find((icon: any) =>
    mapping[icon].filter(
      (tag: string) => label.split(' ').filter((labelPart: string) => tag.indexOf(labelPart) >= 0).length
    ).length
      ? icon
      : null
  );
};
