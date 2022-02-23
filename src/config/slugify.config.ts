interface SlugigyConfig {
  replacement: string;
  remove: RegExp;
  lower: boolean;
  strict: boolean;
  locale: string;
  trim: boolean;
}

export default (): SlugigyConfig => ({
  replacement: '-',
  remove: undefined,
  lower: true,
  strict: true,
  locale: 'vi',
  trim: true,
});
