export default function formatDesignerLabel(designer) {
  return designer.email || [designer.first_name, designer.last_name].filter(Boolean).join(" ") || designer.name || designer.id;
}
