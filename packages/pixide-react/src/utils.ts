/** Merges CSS class names, removing duplicates and falsy values. */
export const mergeClasses = (...classes: (string | undefined | null)[]) =>
  classes
    .filter((c, i, arr) => Boolean(c) && (c as string).trim() !== '' && arr.indexOf(c) === i)
    .join(' ')
    .trim();

/** Returns true if the props object contains any a11y-relevant prop. */
export const hasA11yProp = (props: Record<string, unknown>) => {
  for (const prop in props) {
    if (prop.startsWith('aria-') || prop === 'role' || prop === 'title') return true;
  }
  return false;
};

const toCamelCase = (s: string) =>
  s.replace(/^([A-Z])|[\s-_]+(\w)/g, (_, p1, p2) => (p2 ? p2.toUpperCase() : p1.toLowerCase()));

/** Converts kebab-case or camelCase string to PascalCase. */
export const toPascalCase = (s: string) => {
  const c = toCamelCase(s);
  return c.charAt(0).toUpperCase() + c.slice(1);
};

/** Converts PascalCase or camelCase string to kebab-case. */
export const toKebabCase = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
