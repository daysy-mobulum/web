import { useState } from "react";
import { useApp } from "../context/AppContext";
import OnboardingModal from "./OnboardingModal";

function OnboardingWrapper() {
  const { settings } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (settings.onboardingCompleted || dismissed) return null;

  return <OnboardingModal onComplete={() => setDismissed(true)} />;
}

export default OnboardingWrapper;
