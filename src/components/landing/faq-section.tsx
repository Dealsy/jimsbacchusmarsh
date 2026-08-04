import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type FaqSectionProps = {
  readonly page: PublishedLandingPage;
};

export function FaqSection({ page }: FaqSectionProps) {
  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-3xl space-y-10 px-4">
        <h2 className="text-center font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Common questions
        </h2>
        <Accordion className="w-full">
          {page.faq.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
