"use client";
import { useState } from "react";
import { NotificationSection } from "@/components/notifications/index.js";
import { accounts, mails } from "@/data/notifications";
export default function MailPage() {
  const [allMails, setAllMails] = useState(mails);
  return (
    <div className="hidden flex-col md:flex">
      <NotificationSection
        accounts={accounts}
        mails={allMails}
        setMails={setAllMails}
      />
    </div>
  );
}
