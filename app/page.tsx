"use client";

import "@/lib/amplifyClient";
import DocumentSelector from "./document-selector/page";
import "@aws-amplify/ui-react/styles.css";

export default function Home() {
  return <DocumentSelector />;
}
