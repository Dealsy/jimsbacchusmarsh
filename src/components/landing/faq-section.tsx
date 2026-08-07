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
              <AccordionTrigger className="px-5 py-5 text-left text-base md:text-lg **:data-[slot=accordion-trigger-icon]:size-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
