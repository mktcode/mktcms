import { type Theme } from "~/types";

export async function useTheme() {
  return await $fetch<Theme>('/api/theme');
}