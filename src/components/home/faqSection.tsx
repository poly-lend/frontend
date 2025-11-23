import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Is PolyLend custodial?",
    answer:
      "Collateral and loans are managed by smart contracts. There is no traditional custodian, but the code is unaudited and may contain bugs. Always verify contract addresses and understand the trade-offs before interacting.",
  },
  {
    question: "What happens if no one refinances my loan?",
    answer:
      "If a lender calls a loan and the refinancing auction fails, the loan can be closed by transferring collateral to the lender. The borrower loses their position and may still realize a loss relative to the debt they owed.",
  },
  {
    question: "Which markets and chains are supported?",
    answer:
      "PolyLend is designed for Polymarket conditional tokens on the same chain where those markets are deployed. Check the docs and UI for the current supported network and collateral types before interacting.",
  },
  {
    question: "Who is PolyLend for (and who is it not for)?",
    answer:
      "PolyLend is for advanced users who understand prediction markets, on-chain lending, and smart contract risk. It is not suitable for users seeking guaranteed returns or a simple savings product.",
  },
];

const FaqSection = () => {
  return (
    <section id="faq" className="border-t border-slate-900 pt-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-50">
          Frequently asked questions
        </h2>
      </div>

      <div className="space-y-3">
        <Accordion type="single" collapsible>
          {faqItems.map(({ question, answer }) => (
            <AccordionItem key={question} value={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
