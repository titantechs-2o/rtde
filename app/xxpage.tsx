// app/xxpage.tsx
"use client";

import { useState, useEffect } from "react";
import "./app.css";

import { Amplify } from "@aws-amplify/core";
import awsExports from "./aws-exports";
import { GraphQLAPI } from "@aws-amplify/api-graphql";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { listDocuments } from "./graphql/queries";
import {
  createDocument as createDocMutation,
  deleteDocument as deleteDocMutation,
} from "./graphql/mutations";

Amplify.configure(awsExports);

interface Document {
  id: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export default function App() {
  const [todos, setTodos] = useState<Document[]>([]);

  async function fetchTodos() {
    const resp = (await GraphQLAPI.graphql(
      Amplify,
      { query: listDocuments }
    )) as { data: { listDocuments: { items: Document[] } } };
    setTodos(resp.data.listDocuments.items);
  }

  async function createTodo() {
    const content = window.prompt("Todo content");
    if (!content) return;
    await GraphQLAPI.graphql(
      Amplify,
      {
        query: createDocMutation,
        variables: { input: { content } },
      }
    );
    fetchTodos();
  }

  async function deleteTodo(id: string) {
    await GraphQLAPI.graphql(
      Amplify,
      {
        query: deleteDocMutation,
        variables: { input: { id } },
      }
    );
    setTodos((t) => t.filter((x) => x.id !== id));
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Authenticator>
      {({ signOut }) => (
        <main>
          <h1>My todos</h1>
          <button onClick={createTodo}>+ New</button>
          <ul>
            {todos.map((t) => (
              <li key={t.id} onClick={() => deleteTodo(t.id)}>
                {t.content}
              </li>
            ))}
          </ul>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}
