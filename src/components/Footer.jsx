"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-border bg-background" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">

        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Get in Touch</CardTitle>
                <CardDescription>
                    Reach out for collaborations or just to say hi.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 items-center pb-6">
                <Button variant="outline" className="w-full gap-2" asChild>
                    <a href={`mailto:${siteConfig.contact.email}`}>
                        <Mail className="h-4 w-4" />
                        {siteConfig.contact.email}
                    </a>
                </Button>
                 <div className="text-xs text-muted-foreground">
                    Backup: <a href={`mailto:${siteConfig.contact.backupEmail}`} className="hover:text-foreground transition-colors underline underline-offset-4">{siteConfig.contact.backupEmail}</a>
                </div>
            </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">© 2025</p>
      </div>
    </footer>
  );
}
