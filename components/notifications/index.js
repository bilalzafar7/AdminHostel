"use client";
import * as React from "react";
import { PlusCircle, Search } from "lucide-react";

import { MailDisplay } from "@/components/notification-display";
import { NotificationsList } from "@/components/notifications-list";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "../ui/button";

export function NotificationSection({
  mails,
  setMails,
  defaultLayout = [265, 440, 655],
}) {
  const [mail, setMail] = React.useState(mails[0]);
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="px-4 py-2 flex justify-between w-full">
            <h1 className="text-xl font-bold">Notifications</h1>
            <div className="">
              <Button variant="outline" disabled={!mail}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Notification
                <span className="sr-only">Create Notification</span>
              </Button>
            </div>
          </div>

          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <NotificationsList items={mails} mail={mail} setMail={setMail} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MailDisplay
            mails={mails}
            setMails={setMails}
            mail={mails.find((item) => item.id === mail.selected) || null}
            setMail={setMail}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
