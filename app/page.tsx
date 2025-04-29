"use client";

import DocumentSelector from "./document-selector/page";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function Home() {
  return <DocumentSelector />;
}
