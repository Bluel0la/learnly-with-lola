
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

// Focus-trap and ARIA attributes for better a11y
const steps = [
  {
    icon: <CheckCircle className="h-6 w-6 text-green-500" aria-hidden="true" />,
    title: "Welcome to Learnly!",
    description: "We're excited to help you study smarter and learn faster.",
  },
  {
    icon: <ArrowRight className="h-6 w-6 text-blue-500" aria-hidden="true" />,
    title: "Quick tour",
    description: "Explore flashcards, quizzes, AI chat, and your learning dashboard.",
  },
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, onComplete }) => {
  const [step, setStep] = React.useState(0);
  const nextBtnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (open && nextBtnRef.current) {
      nextBtnRef.current.focus();
    }
  }, [open, step]);

  const handleNext = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e && e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  // Keyboard support (arrow keys, enter, escape)
  React.useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        handleNext();
      }
      if (e.key === "Escape") {
        onComplete();
      }
      if (e.key === "ArrowRight" && step < steps.length - 1) {
        setStep(s => Math.min(s + 1, steps.length - 1));
      }
      if (e.key === "ArrowLeft" && step > 0) {
        setStep(s => Math.max(s - 1, 0));
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [open, step, onComplete]);

  return (
    <Dialog open={open} modal>
      <DialogContent className="max-w-md mx-auto p-0" aria-live="polite">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3 py-2">
            {steps[step].icon}
            <DialogTitle id="onboarding-title" className="text-lg text-center">{steps[step].title}</DialogTitle>
            <div id="onboarding-desc" className="text-gray-600 text-center">{steps[step].description}</div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="w-full"
            onClick={handleNext}
            ref={nextBtnRef}
            aria-label={step < steps.length - 1 ? "Next step" : "Finish onboarding"}
            autoFocus
          >
            {step < steps.length - 1 ? "Next" : "Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
