import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import CreateAnnonce from "@/components/CreateAnnonce";
import PublishOffer from "@/components/PublishOffer";

export default function DeposerContenu() {
  const { mode } = useContext(UserContext);

  return (
    <div className="py-10">
      {mode === "client" ? <CreateAnnonce /> : <PublishOffer />}
    </div>
  );
}
