import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Smart Workspace?",
    answer:
      "Smart Workspace is a flexible workspace marketplace where you can discover and book coworking spaces, private offices and meeting rooms.",
  },
  {
    question: "How do I book a workspace?",
    answer:
      "Choose a location, explore available spaces, select your preferred date and time, then complete the booking through the secure checkout.",
  },
  {
    question: "Can I book a workspace for just a few hours?",
    answer:
      "Yes. Workspace availability and booking duration depend on the individual space. Many spaces support hourly bookings.",
  },
  {
    question: "How does payment work?",
    answer:
      "After selecting your workspace and booking details, you can complete the payment through the available secure payment option.",
  },
  {
    question: "Can I list my own workspace?",
    answer:
      "Yes. Workspace owners can register as an owner and list their available offices, desks and meeting spaces.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Cancellation depends on the booking policy of the selected workspace. Always review the policy before confirming your booking.",
  },
];

const FAQSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="section-padding bg-[var(--background)]">
      <div className="container-width">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">Need to know</p>

          <h2 className="section-title mt-2">
            Frequently asked
            <span className="text-[var(--secondary)]"> questions.</span>
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
          {faqs.map((faq, index) => {
            const isOpen = active === index;

            return (
              <div
                key={faq.question}
                className="border-b border-[var(--border)] last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setActive(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                >
                  <span className="text-sm font-bold text-[var(--text)]">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--secondary)] transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-7 text-[var(--muted)]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
