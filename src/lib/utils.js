export const extractNumbers = (text = "") => {
  return text?.replace(/\D/g, "");
};
