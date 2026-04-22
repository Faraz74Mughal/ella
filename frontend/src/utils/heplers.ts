import adminSidebarData from "@/data/admin-sidenav-data";

export const imageFallback = (name?: string): string => {
  if (!name) return "";
  const split = name.split(" ");
  const concat = split ? split[0][0] + (split[1] ? split[1][0] : "") : name[0];
  return concat;
};

export const pageHeadingManagement = (linkName: string): string => {
  const find = adminSidebarData.find((d) => d.to === linkName)?.label;
  return find?find:"";
};
