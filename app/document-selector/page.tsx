"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import DocumentSelector from "./DocumentSelector";

export default function Page() {
  return (
    <Authenticator>
      {({ signOut }) => <DocumentSelector signOut={signOut} />}
    </Authenticator>
  );
}
