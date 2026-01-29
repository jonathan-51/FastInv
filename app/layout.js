import "./globals.css";
import { fontSans } from "./fonts.js";

export const metadata = {
  title: "TradeFlow",
  description: "Trade business management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={fontSans.variable}>
        {children}
      </body>
    </html>
  );
}
