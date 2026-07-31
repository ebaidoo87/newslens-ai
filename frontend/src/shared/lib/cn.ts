import clsx from "clsx";

export function cn(...classes: Parameters<typeof clsx>) {
  return clsx(...classes);
}