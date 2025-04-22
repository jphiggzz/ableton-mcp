import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: "AbletonMCP Web",
  description: "Web interface for controlling Ableton Live through MCP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider  
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            <SidebarProvider>
              <AppSidebar />
              <main>
                <SidebarTrigger />
                  {children}
              </main>
            </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
