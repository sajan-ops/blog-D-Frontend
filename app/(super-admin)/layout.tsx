'use client'
import { useState, createContext } from "react"
import "../globals.css"



// shape of global state
interface GlobalState {
  mediaItems: [];
}

// shape of context
interface GlobalContextType {
  globalState: GlobalState;
  setglobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

// Create the context with proper typing
export const GlobalStateContext = createContext<GlobalContextType | null>(null);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [globalState, setglobalState] = useState<GlobalState>({
    mediaItems: []
  });

  return (
    <html lang="en">
      <GlobalStateContext.Provider value={{ globalState, setglobalState }}>
        <body>{children}</body>
      </GlobalStateContext.Provider>
    </html>
  )
}