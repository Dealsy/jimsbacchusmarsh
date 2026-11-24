import { ArrowRightIcon, PhoneIcon, PlusIcon } from "lucide-react";

import { LandingSection } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { SectionHeading } from "@/components/landing/shell/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LinkButton } from "@/components/ui/link-button";
import { resolveFaqSection } from "@/lib/landing-page-content";
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
    <LandingSection
      id="faq"
      data-landing-section="faq"
      tone="light"
      className="scroll-mt-4"
      containerClassName="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8"
    >
      <Reveal className="lg:col-start-1 lg:row-start-1">
        <SectionHeading
          eyebrow="FAQ"
          title={section.title}
          className="lg:mx-0 lg:text-left lg:[&>p:first-child]:justify-start lg:[&>p:first-child>span:last-child]:hidden"
        />
      </Reveal>

      <Reveal
        delay={100}
        className="lg:col-start-2 lg:row-span-2 lg:row-start-1"
      >
        <Accordion className="gap-3 overflow-visible rounded-none border-0">
          {page.faq.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="rounded-2xl bg-card shadow-xs ring-1 ring-border transition-shadow not-last:border-b-0 data-open:bg-card data-open:shadow-elevated data-open:ring-primary/30"
            >
              <AccordionTrigger className="items-center px-5 py-5 text-left font-heading text-base font-semibold hover:no-underline md:px-6 md:text-lg **:data-[slot=accordion-trigger-icon]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-45 group-aria-expanded/accordion-trigger:bg-primary group-aria-expanded/accordion-trigger:text-primary-foreground"
                >
                  <PlusIcon className="size-4" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-6 md:px-2 text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>

      <Reveal className="lg:sticky lg:top-12 lg:col-start-1 lg:row-start-2 lg:self-start">
        <div className="rounded-3xl bg-(--landing-section-band) p-6 text-center ring-1 ring-border lg:text-left">
          <p className="font-heading text-xl font-semibold">Still unsure?</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <LinkButton
              href="#quote-form"
              landingCtaLocation="faq"
              size="lg"
              className="h-11 px-6 shadow-lg shadow-primary/25"
            >
              {page.ctaLabel}
              <ArrowRightIcon data-icon="inline-end" />
            </LinkButton>
            {showPhone ? (
              <LinkButton
                href={phoneHref}
                variant="outline"
                size="lg"
                className="h-11 bg-background px-5"
              >
                <PhoneIcon data-icon="inline-start" />
                {page.phone}
              </LinkButton>
            ) : null}
          </div>
        </div>
      </Reveal>
    </LandingSection>
  );
}
