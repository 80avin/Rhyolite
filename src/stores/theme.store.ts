import { type Writable, writable, get } from "svelte/store";
import type { Theme } from "../types/theme";

export interface IThemesStates {
  themes: Theme[];
  currentTheme: Theme;
}

const DEFAULT_THEMES: Theme[] = [
  {
    name: "Default",
    colorscheme: "dark",
    colors: {
      text: "#ffffff",
      subtext2: "#f1f2f3",
      subtext1: "#d8dbde",
      subtext0: "#c2c6cb",
      overlay2: "#acb2b8",
      overlay1: "#969da5",
      overlay0: "#808992",
      surface2: "#6c757d",
      surface1: "#596167",
      surface0: "#464c51",
      base: "#33373b",
      crust: "#202325",
      mantle: "#0d0e0f",
    },
  },
  {
    name: "Green Screen",
    colorscheme: "dark",
    colors: {
      text: "#ffffff",
      subtext2: "#f1f2f3",
      subtext1: "#d8dbde",
      subtext0: "#c2c6cb",
      overlay2: "#acb2b8",
      overlay1: "#969da5",
      overlay0: "#808992",
      surface2: "#609060",
      surface1: "#508010",
      surface0: "#40a040",
      base: "#335f3b",
      crust: "#203325",
      mantle: "#081d08",
    },
  },
  {
    name: "Coffee",
    colorscheme: "light",
    colors: {
      text: "#FFDBB5",
      subtext2: "#FFEAC5",
      subtext1: "#d8dbde",
      subtext0: "#c2c6cb",
      overlay2: "#acb2b8",
      overlay1: "#969da5",
      overlay0: "#808992",
      surface2: "#a07349",
      surface1: "#845f3c",
      surface0: "#684b2f",
      base: "#4c3622",
      crust: "#2f2215",
      mantle: "#130e09",
    },
  },
];

const states: Writable<IThemesStates> = writable<IThemesStates>({
  themes: DEFAULT_THEMES,
  currentTheme: DEFAULT_THEMES[0],
});

const initThemesStore = async () => {
  // TODO: pick from some store
  const themes = DEFAULT_THEMES;
  // TODO: use last used theme or from browser colorscheme
  const currentTheme = themes[0];
  applyTheme(currentTheme);
  states.update(() => ({ themes, currentTheme }));
};

const resetCurrentTheme = () => {
  const themes: Theme[] = getThemesState();
  const currentTheme: Theme = themes[0];
  updateCurrentThemeState(currentTheme);
};

const updateThemesState = (themes: Theme[]): Theme[] => {
  states.update((data) => ({
    themes: themes,
    currentTheme: data.currentTheme,
  }));
  return themes;
};

const colorToRgb = (color: string) => {
  let match = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(color);
  if (match) {
    return match.slice(1).map((hex) => parseInt(hex, 16));
  }
  match = /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(color);
  if (match) {
    return match.slice(1).map((hex) => parseInt(hex + hex, 16));
  }
  match =
    /^rgb\(\s*(\d+)(?:\s*,\s*|\s+)(\d+)(?:\s*,\s*|\s+)(\d+)\s*\)\s*$/i.exec(
      color,
    );
  if (match) {
    return match.slice(1).map((num) => parseInt(num));
  }
  throw new Error(`Unsupported color: "${color}"`);
};

const applyTheme = (theme: Theme) => {
  const root: HTMLHtmlElement = document.querySelector(":root")!;
  Object.entries(theme.colors).forEach(([name, value]) => {
    root.style.setProperty(`--color-${name}`, colorToRgb(value).join(" "));
  });
  root.style.setProperty(`--theme-name`, theme.name);
  root.style.setProperty(`--theme-colorscheme`, theme.colorscheme);
};

const updateCurrentThemeState = (currentTheme: Theme): Theme => {
  states.update((data) => ({
    themes: data.themes,
    currentTheme: currentTheme,
  }));
  applyTheme(currentTheme);
  return currentTheme;
};

const getThemeById = (themeName: string): Theme | undefined => {
  const { themes }: { themes: Theme[] } = get(states); // Access the current state of states
  return themes.find((theme) => theme.name === themeName); // Replace 'id' with the actual property name if it's different
};

const getCurrentThemeState = (): Theme => {
  const { currentTheme }: { currentTheme: Theme } = get(states);
  return currentTheme;
};

const getThemesState = (): Theme[] => {
  const { themes }: { themes: Theme[] } = get(states);
  return themes;
};

export default {
  states,
  initThemesStore,
  resetCurrentTheme,
  updateThemesState,
  updateCurrentThemeState,
  getThemeById,
  getCurrentThemeState,
  getThemesState,
};
