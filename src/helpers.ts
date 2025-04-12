import { LocalStorage, Clipboard } from "@raycast/api";
import { Website } from "./types";

export async function seedToLocalStorage(websites: Website[]) {
  for (const website of websites) {
    await LocalStorage.setItem(website.url, JSON.stringify(website));
  }
}

export async function getWebsitesFromLocalStorage(): Promise<Website[]> {
  const items = await LocalStorage.allItems();
  const websites: Website[] = [];
  for (const key in items) {
    const website = items[key];
    if (website) {
      websites.push(JSON.parse(website));
    }
  }
  return websites;
}

export async function copyWebsitesJSON() {
  const websites = await getWebsitesFromLocalStorage();
  const json = JSON.stringify(websites);
  await Clipboard.copy(json);
}

export async function importWebsitesFromClipboard() {
  try {
    const json = await Clipboard.readText();
    if (!json) {
      throw new Error("Clipboard is empty");
    }
    const websites = JSON.parse(json);
    if (Array.isArray(websites)) {
      await seedToLocalStorage(websites)

    } else {
      throw new Error("Invalid JSON format");
    }
  } catch (error) {
    console.error("Error importing websites:", error);
  }
}
