//utils
import formatName from "./formatName";

export default function formatDesignerLabel(designer) {
  const name = formatName([designer.first_name, designer.last_name].filter(Boolean).join(" ") || designer.name);
  return [name, designer.email].filter(Boolean).join(", ") || designer.id;
}
