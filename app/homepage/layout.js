// app/layout.js
import { Poppins, Open_Sans } from "next/font/google";
import { getSession } from "@/actions/auth-actions";
import Header from "@/components/header2";

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

export default async function ChildLayout({ children }) {
  const { user } = await getSession();
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${openSans.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
