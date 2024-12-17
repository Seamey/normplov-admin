import type { Metadata } from "next";
import { Inter, Suwannaphum } from "next/font/google";
import StoreProvider from "@/app/StoreProvider";
import { NavbarComponent } from "../Components/layout/navbar/NavbarComponent";
import { SidebarComponent } from "../Components/layout/sidebar/SidebarComponent";
import "@/app/globals.css";
import { suwannaphum, inter } from "../font";

export const metadata: Metadata = {
  title: "Norm Plov Admin Dashboard",
  description: "Generated by create next app",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${suwannaphum.variable} ${inter.variable}`}>
        <StoreProvider>
          <div className="flex">
            <aside>
              <SidebarComponent />
            </aside>
            <div className="w-full bg-[#fdfdfd]">
              <NavbarComponent />
              {children}
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
