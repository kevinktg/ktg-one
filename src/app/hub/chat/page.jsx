import { Suspense } from "react";
import OneChatInner from "./OneChatInner";

export const metadata = {
  title: "onechat",
};

export default function OneChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <OneChatInner />
    </Suspense>
  );
}
