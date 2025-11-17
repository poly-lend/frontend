import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

const ExpandIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-slate-400"
  >
    <path
      d="M8.12 9.29L12 13.17L15.88 9.29C16.27 8.9 16.9 8.9 17.29 9.29C17.68 9.68 17.68 10.31 17.29 10.7L12.7 15.29C12.31 15.68 11.68 15.68 11.29 15.29L6.7 10.7C6.31 10.31 6.31 9.68 6.7 9.29C7.09 8.9 7.73 8.9 8.12 9.29Z"
      fill="currentColor"
    />
  </svg>
);

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
        {faqItems.map(({ question, answer }) => (
          <Accordion
            key={question}
            disableGutters
            className="rounded-xl border border-slate-900 bg-slate-950/85"
            sx={{ "&:before": { display: "none" } }}
          >
            <AccordionSummary expandIcon={<ExpandIcon />}>
              <div className="text-sm font-semibold text-slate-50">
                {question}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="text-xs leading-relaxed text-slate-300">
                {answer}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
