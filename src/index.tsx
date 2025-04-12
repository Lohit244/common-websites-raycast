import { ActionPanel, Action, Icon, List, LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";
import { View, Website } from "./types";
import { getWebsitesFromLocalStorage, copyWebsitesJSON, importWebsitesFromClipboard } from "./helpers";
import Default from "./default";
import AddForm from "./addForm";


export default function Main() {
  const [view, setView] = useState<View>("default");
  const [search, setSearch] = useState("");
  if (view == "default") {
    return <Default switchView={() => setView("import")} search={search} setSearch={setSearch} />;
  } else if (view == "import") {
    return <AddForm switchView={() => setView("default")} search={search} />;

  }
}
