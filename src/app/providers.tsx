import { ClerkProvider } from '@clerk/nextjs';

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider

      appearance={{
        variables: {
          colorPrimary: '#FF5733', // Orange vif
          colorBackground: '#F3F4F6', // Fond gris clair
          // Texte sombre
        },
      }}
    >
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      {children}
    </ClerkProvider>

  );
}
