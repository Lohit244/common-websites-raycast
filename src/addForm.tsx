import { ActionPanel, Action, Icon, List, LocalStorage, Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { View, Website } from "./types";
import { getWebsitesFromLocalStorage, copyWebsitesJSON, importWebsitesFromClipboard } from "./helpers";

export default function AddForm({ switchView, search }: { switchView: () => void, search: string }) {
  const [url, setUrl] = useState(search.trim().startsWith("http") ? search.trim() : "");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const handleAddWebsite = async () => {
    if (!url || !title) {
      return;
    }
    const website: Website = { url, title, category };
    await LocalStorage.setItem(url, JSON.stringify(website));
    switchView();
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Add Website"
            icon={Icon.Plus}
            onSubmit={handleAddWebsite}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="url"
        title="URL"
        placeholder="https://example.com"
        info="Enter the full URL to the website"
        value={url}
        onChange={setUrl} />
      <Form.TextField
        id="title"
        title="Title"
        placeholder="Example Website"
        info="Enter the title of the website, this will be displayed in the list"
        value={title}
        onChange={setTitle}
      />
      <Form.TextField
        id="category"
        title="Category"
        placeholder="Category"
        value={category}
        onChange={setCategory}
        info="Optional"
      />
    </Form>
  );
}
