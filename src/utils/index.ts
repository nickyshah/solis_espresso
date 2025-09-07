export function createPageUrl(name: string) {
  const map: Record<string, string> = {
    Home: "/",
    Menu: "/menu",
    About: "/about",
    Contact: "/contact",
  };
  return map[name] || "/";
}
