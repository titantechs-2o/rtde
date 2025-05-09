// app/document-selector/DocumentSelector.tsx
"use client";

import { useState, useEffect } from "react";
import DocumentTile from "./DocumentTile";

// 1) pull in the core
import { Amplify } from "@aws-amplify/core";
import awsExports from "../aws-exports";    // ← path to your generated aws-exports.js

// 2) pull in the GraphQL client plugin
import { GraphQLAPI } from "@aws-amplify/api-graphql";

// 3) your generated artifacts
import { listDocuments } from "../graphql/queries";
import { createDocument as createDocMutation } from "../graphql/mutations";

// 4) your UI Auth wrapper
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// configure Amplify once:
Amplify.configure(awsExports);
// **no** Amplify.register(...) needed

interface Document {
  id: string;
  title?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentSelector({ signOut }: { signOut?: () => void }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const resp = (await GraphQLAPI.graphql(
        // ← 1st arg is your Amplify instance
        Amplify,
        {
          query: listDocuments,
          // you can also pass “authMode”, etc. here
        }
      )) as { data: { listDocuments: { items: Document[] } } };
      setDocuments(resp.data.listDocuments.items);
    } catch (err) {
      console.error("fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createDocument() {
    const title = window.prompt("Title?");
    if (!title) return;
    await GraphQLAPI.graphql(
      Amplify,
      {
        query: createDocMutation,
        variables: { input: { title } },
      }
    );
    // re-load
    fetchDocuments();
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <Authenticator>
      {({ signOut }) => (
        <div className="container">
          <h1>Select a Document</h1>
          <button onClick={fetchDocuments}>Refresh</button>
          <button onClick={createDocument}>New Document</button>
          <button onClick={() => signOut?.()}>Sign Out</button>
          {loading ? (
            <p>Loading…</p>
          ) : (
            documents.map((d) => (
              <DocumentTile
                key={d.id}
                id={d.id}
                title={d.title || "Untitled"}
                createdAt={d.createdAt}
              />
            ))
          )}
        </div>
      )}
    </Authenticator>
  );
}
