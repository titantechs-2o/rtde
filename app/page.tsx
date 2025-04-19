"use client";

import { useState, useEffect, FC } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const Editor: FC = () => {
  const [content, setContent] = useState<string>("");
  const [bold, setBold] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);
  const [underline, setUnderline] = useState<boolean>(false);

  const handleEdit = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const updatedContent: string = event.target.value;
    setContent(updatedContent);
  };

  const toggleStyle = (
    style: boolean,
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    eventName: string
  ): void => {
    setter((prev) => {
      const newState: boolean = !prev;
      return newState;
    });
  };

  return (
    <Authenticator>
      {({ signOut }) => (
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
              <button
                className="download-button"
                onClick={() => alert("Download logic coming soon!")}
              >
                Download
              </button>
              <button className="signout-button" onClick={signOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default Editor;
