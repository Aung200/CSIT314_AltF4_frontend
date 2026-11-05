export default function formatName(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/(^|[\s'’-])\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}
