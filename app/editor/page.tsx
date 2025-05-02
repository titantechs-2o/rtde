"use client";

import "@/lib/amplifyClient";
import React, {
  useState,
  useEffect,
  useMemo,
  FC,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";

const Editor: FC = () => {
  const client = generateClient<Schema>();

  const [content, setContent] = useState<string>("");
  const [bold, setBold] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);
  const [underline, setUnderline] = useState<boolean>(false);

  const handleEdit = async (event: ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = event.target.value;
    setContent(updatedContent);
    const { data } = await client.models.Document.list();
    const doc = data.find((d: any) => d.title === "shared-doc");
    if (doc) {
      await client.models.Document.update({
        id: doc.id,
        content: updatedContent,
      });
    }
  };

  const handleDownload = async () => {
    try {
      const { data } = await client.models.Document.list();
      const doc = data.find((d) => d.title === "shared-doc");

      if (!doc) {
        alert("No document found.");
        return;
      }

      const blob = new Blob([doc.content ?? ""], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc.title}.txt`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download document.");
    }
  };

  const toggleStyle = (
    style: boolean,
    setter: Dispatch<SetStateAction<boolean>>,
    eventName: string
  ): void => {
    setter((prev: boolean) => {
      const newState: boolean = !prev;
      return newState;
    });
  };

  const callLambda = async () => {
    const response = await API.get("apiName", "/documents");
    console.log(response);
  };

  useEffect(() => {
    const fetchDocument = async () => {
      const { data } = await client.models.Document.list();
      const doc = data.find((d: any) => d.title === "shared-doc");
      if (doc) {
        setContent(doc.content ?? "");
      } else {
        await client.models.Document.create({
          title: "shared-doc",
          content: "",
        });
      }
    };
    fetchDocument();
  }, []);

  return (
    <Authenticator>
      {(props: { signOut: () => void }) => (
        <div className="container">
          <div className="card">
            <h2 className="editor-title">Real-time Collaborative Editor</h2>
            {/* Formatting Controls */}
            <div className="formatting-controls">
              <button
                className={`format-button ${bold ? "active" : ""}`}
                onClick={() => toggleStyle(bold, setBold, "bold")}
              >
                <b>B</b>
              </button>
              <button
                className={`format-button ${italic ? "active" : ""}`}
                onClick={() => toggleStyle(italic, setItalic, "italic")}
              >
                <i>I</i>
              </button>
              <button
                className={`format-button ${underline ? "active" : ""}`}
                onClick={() =>
                  toggleStyle(underline, setUnderline, "underline")
                }
              >
                <u>U</u>
              </button>
            </div>

            {/* Editor Text Area */}
            <div className="text-control">
              <textarea
                className="text-area"
                value={content}
                onChange={handleEdit}
                placeholder="Start typing..."
                style={{
                  fontWeight: bold ? "bold" : "normal",
                  fontStyle: italic ? "italic" : "normal",
                  textDecoration: underline ? "underline" : "none",
                }}
              />
            </div>

            {/* Sign Out */}
            <div className="action-buttons">
              <button className="download-button" onClick={handleDownload}>
                Download
              </button>
              <button className="signout-button" onClick={props.signOut}>
                Sign Out
              </button>
              <button onClick={callLambda}>Call Lambda</button>
            </div>
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default Editor;
