import "./globals.css";
import { Poppins, Open_Sans } from "next/font/google";
import Header from "@/app/header";

const poppins = Poppins({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
const openSans = Open_Sans({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata = {
  title: "Revision Club",
  description: "Join us for a fun-filled learning experience.",
  icons: { icon: "icon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
      <body className={`${poppins.variable} ${openSans.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
