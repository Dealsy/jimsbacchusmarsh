import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LinkButton } from "@/components/ui/link-button";
import { resolveFaqSection } from "@/lib/landing-page-content";
import { landingSectionSurfaceClass } from "@/lib/landing-section-surface";
import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type FaqSectionProps = {
  readonly page: PublishedLandingPage;
};

export function FaqSection({ page }: FaqSectionProps) {
  const section = resolveFaqSection(page);
  const showPhone = !isPlaceholderPhone(page.phone);
  const phoneHref = formatPhoneHref(page.phone);

  return (
    <section
      id="faq"
      data-landing-section="faq"
      className={`${landingSectionSurfaceClass("band")} scroll-mt-4 py-16 md:py-20`}
    >
      <div className="mx-auto max-w-3xl space-y-10 px-4">
        <h2 className="text-center font-heading text-3xl font-bold tracking-tight md:text-4xl">
          {section.title}
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
        <div className="space-y-4 text-center">
          <p className="font-heading text-xl font-semibold">Still unsure?</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="#quote-form" landingCtaLocation="faq" size="lg">
              {page.ctaLabel}
            </LinkButton>
            {showPhone ? (
              <LinkButton href={phoneHref} variant="outline" size="lg">
                {page.phone}
              </LinkButton>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
