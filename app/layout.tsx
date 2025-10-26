import { Inter } from "next/font/google";
import "./globals.css";
import Warnings from "./components/warnings";
import { assistantId } from "./assistant-config";
import { UniversityProvider } from "./context/UniversityContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "University Student Assistant",
  description: "AI-powered student assistant for universities across Nigeria and beyond",
  icons: {
    icon: "https://res.cloudinary.com/ddjnrebkn/image/upload/v1752596610/all%20folder/download_2_icfqnb.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UniversityProvider>
          {assistantId ? children : <Warnings />}
        </UniversityProvider>
      </body>
    </html>
  );
}
