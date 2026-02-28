import { cookies } from "next/headers";
import { HubGate } from "./HubGate";

export const metadata = {
  title: "laboratory",
};

export default async function HubLayout({ children }) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("hub-auth")?.value === "authenticated";

  return (
    <HubGate isAuthed={isAuthed}>
      {children}
    </HubGate>
  );
}
