import { ActionPanel, Action, Icon, List, LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";
import { Website } from "./types";
import { getWebsitesFromLocalStorage, copyWebsitesJSON, importWebsitesFromClipboard } from "./helpers";


export default function Default({ switchView, search, setSearch }: { switchView: () => void, search: string, setSearch: (search: string) => void }) {
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);

  function onLoad() {
    getWebsitesFromLocalStorage().then((websites) => {
      setFilteredWebsites(websites);
      setWebsites(websites);
    });
  }

  useEffect(() => {
    onLoad();
  }, []);

  const handleSearch = (newSearch: string) => {
    if (newSearch.at(-1) == "\\") {
      setSearch(filteredWebsites[0]?.url || "");
    } else {
      setSearch(newSearch);
      setFilteredWebsites(
        websites.filter(
          (website) =>
            website.title.toLocaleLowerCase().includes(newSearch) ||
            website.category?.toLocaleLowerCase().includes(newSearch)
        )
      );
    }
  };

  const handleWebsite = (website: string) => {
    var temp = website;
    if (temp.startsWith("https://")) {
      return temp;
    } else if (temp.startsWith("http://")) {
      return temp;
    }
    return "https://" + temp;
  };

  return (
    <List onSearchTextChange={handleSearch} searchText={search}>
      {filteredWebsites.map((item) => (
        <List.Item
          key={item.url}
          icon="list-icon.png"
          title={item.title}
          subtitle={item.url}
          accessories={[{ icon: Icon.Globe, text: item.category }]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={item.url} />
              <Action
                title="Remove Website"
                key={"remove" + item.url}
                icon={Icon.Trash}
                shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                onAction={async () => {
                  await LocalStorage.removeItem(item.url);
                  onLoad();
                }}

              />
            </ActionPanel>
          }
        />
      ))}
      {search.includes(".") && (
        <List.Item
          key={"website" + search}
          icon={Icon.AppWindow}
          title={search}
          accessories={[{ icon: Icon.Globe, text: "Visit Website" }]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={handleWebsite(search)} />
            </ActionPanel>
          }
        />
      )}
      <List.Item
        key={"ddg" + search}
        icon="ddg.png"
        title={search}
        accessories={[{ icon: Icon.Globe, text: "Search w/ DDG" }]}
        actions={
          <ActionPanel>
            <Action.OpenInBrowser url={`https://duckduckgo.com/?q=${encodeURIComponent(search)}`} />
          </ActionPanel>
        }
      />
      <List.Item
        key={"google" + search}
        icon="google.png"
        title={search}
        accessories={[{ icon: Icon.Globe, text: "Search w/ Google" }]}
        actions={
          <ActionPanel>
            <Action.OpenInBrowser url={`https://google.com/search?q=${encodeURIComponent(search)}`} />
          </ActionPanel>
        }
      />
      <List.Item
        key="Add Item"
        icon={Icon.Plus}
        title="Add Website"
        actions={
          <ActionPanel>
            <Action title="Add Website" onAction={switchView} />
          </ActionPanel>
        }
      />
      {
        "Export Websites To JSON".toLowerCase().includes(search.trim().toLowerCase()) && (
          <List.Item
            key="Export Websites"
            icon={Icon.Clipboard}
            title="Export Websites to JSON"
            actions={
              <ActionPanel>
                <Action title="Copy to Clipboard" onAction={copyWebsitesJSON} />
              </ActionPanel>
            }
          />
        )
      }
      {"Import Websites From JSON".toLowerCase().includes(search.trim().toLowerCase()) && (
        <List.Item
          key="Import Websites"
          icon={Icon.Folder}
          title="Import Websites from JSON"
          actions={
            <ActionPanel>
              <Action
                title="Read from Clipboard"
                onAction={() => {
                  importWebsitesFromClipboard().then(() => {
                    onLoad();
                  });
                }
                }
              />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}
