export type ThankYouFields = {
  headline: string;
  body: string;
  phonePrompt?: string;
  nextStepsTitle?: string;
  useHowItWorksSteps?: boolean;
  nextSteps?: Array<{
    step: number;
    title: string;
    description: string;
  }>;
};

export function createDefaultThankYou(): ThankYouFields {
  return {
    headline: "Thanks — we'll call you back today",
    body: "Your request is in. We'll be in touch shortly to arrange your free assessment.",
    phonePrompt: "Need to speak with someone now?",
    nextStepsTitle: "What happens next",
    useHowItWorksSteps: true,
  };
}
