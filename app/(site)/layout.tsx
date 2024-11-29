"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
import ToasterContext from "../context/ToastContext";
import { useEffect, useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import LoadingBar from "react-top-loading-bar";
import { SessionProvider } from "next-auth/react";
import { io } from "socket.io-client";
import { apiUrl } from "@/lib/apiConfig";

const inter = Inter({ subsets: ["latin"] });

// Create a Socket Context
const SocketContext = createContext(null);
export const useSocket = () => {
  return useContext(SocketContext);
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const [socket, setSocket] = useState<any>(null);
  const publicKey =
    "BPEcNC79FcWy3D2ytLEIIOcGrtLAgPYevQ9KwtGPPwnDlP9Z6mxL2yd2nFS6BH65svBxWfLlD0OjWwOoh7HYkPM";

  useEffect(() => {
    // Check if service worker is supported
    if ("serviceWorker" in navigator) {
      // Request notification permission
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            // Register the service worker if permission is granted
            navigator.serviceWorker
              .register("/sw-v2.js")
              .then((registration) => {
                console.log(
                  "Service Worker registered with scope:",
                  registration.scope,
                );
              })
              .catch((error) => {
                console.error("Service Worker registration failed:", error);
              });
          } else {
            console.error("Notification permission denied");
          }
        })
        .catch((error) => {
          console.error("Failed to request notification permission:", error);
        });
    }
  }, []);

  // useEffect(() => {
  //   const registerServiceWorker = async () => {
  //     if ("serviceWorker" in navigator) {
  //       try {
  //         const registration = await navigator.serviceWorker.register(
  //           "/sw2.js",
  //           { scope: "/" },
  //         );
  //         console.log(
  //           "Service Worker registered with scope:",
  //           registration.scope,
  //         );

  //         // Request notification permission
  //         const permission = await Notification.requestPermission();
  //         if (permission === "granted") {
  //           console.log("Notification permission granted.");
  //           // Call your function to handle the subscription here, if needed
  //           checkSubscription(registration);
  //         } else {
  //           console.error("Notification permission denied");
  //         }
  //       } catch (error) {
  //         console.error("Service Worker registration failed:", error);
  //       }
  //     }
  //   };

  //   registerServiceWorker();
  // }, []);

  // const checkSubscription = async (register) => {
  //   const existingSubscription = await register.pushManager.getSubscription();

  //   if (existingSubscription) {
  //     console.log("User is already subscribed:", existingSubscription);
  //   } else {
  //     subscribeUser(register);
  //   }
  // };

  // const subscribeUser = async (register) => {
  //   const subscription = await register.pushManager.subscribe({
  //     userVisibleOnly: true,
  //     applicationServerKey: urlBase64ToUint8Array(publicKey),
  //   });

  //   // Send subscription to the server
  //   await fetch(`${apiUrl}/subscribe`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(subscription),
  //   });
  // };

  // function urlBase64ToUint8Array(base64String) {
  //   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/-/g, "+")
  //     .replace(/_/g, "/");
  //   const rawData: any = window.atob(base64);
  //   return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  // }

  useEffect(() => {
    setProgress(20);
    setTimeout(() => setProgress(40), 100);
    setTimeout(() => setProgress(100), 400);
  }, [pathname]);

  useEffect(() => {
    // Create a socket connection when the component mounts
    const socketInstance = io("http://localhost:1000"); // Replace with your server URL if needed
    setSocket(socketInstance);

    // Clean up the connection on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`dark:bg-black ${inter.className}`}>
        <SessionProvider>
          <LoadingBar
            color="blue"
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
          />
          <ThemeProvider
            enableSystem={false}
            attribute="class"
            defaultTheme="light"
          >
            <SocketContext.Provider value={socket}>
              <Lines />
              <Header />
              <ToasterContext />
              {children}
              <Footer />
              <ScrollToTop />
            </SocketContext.Provider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
