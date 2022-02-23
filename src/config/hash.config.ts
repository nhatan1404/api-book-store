export default (): Record<string, string | number> => ({
  saltRounds: process.env.BCRYPT_SALT_ROUNDS,
});
