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
        <div className="container mt-5">
          <div className="card shadow p-4">
            <h2 className="text-center">Real-time Collaborative Editor</h2>

            {/* Formatting Controls */}
            <div className="d-flex justify-content-center gap-2 mt-3 mb-3">
              <button
                className={`btn ${bold ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => toggleStyle(bold, setBold, "bold")}
              >
                <b>B</b>
              </button>
              <button
                className={`btn ${italic ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => toggleStyle(italic, setItalic, "italic")}
              >
                <i>I</i>
              </button>
              <button
                className={`btn ${underline ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() =>
                  toggleStyle(underline, setUnderline, "underline")
                }
              >
                <u>U</u>
              </button>
            </div>

            {/* Editor Text Area */}
            <textarea
              className="form-control"
              value={content}
              onChange={handleEdit}
              rows={10}
              placeholder="Start typing..."
              style={{
                fontWeight: bold ? "bold" : "normal",
                fontStyle: italic ? "italic" : "normal",
                textDecoration: underline ? "underline" : "none",
              }}
            ></textarea>
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default Editor;
