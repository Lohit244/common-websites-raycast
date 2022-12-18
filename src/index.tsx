import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { useState } from "react";
import websites from "./Websites";

export default function Command() {
  const [search, setSearch] = useState("");
  const [filteredWebsites, setFilteredWebsites] = useState(websites);
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
    </List>
  );
}
