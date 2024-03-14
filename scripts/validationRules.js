export const emailRules = [
  (v) => !!v || "E-mail is required",
  (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];

export const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => (v && v.length >= 8) || "Password must be at least 8 characters long",
  (v) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
      v
    ) ||
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  (v) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(v)
      ? true
      : false,
];
