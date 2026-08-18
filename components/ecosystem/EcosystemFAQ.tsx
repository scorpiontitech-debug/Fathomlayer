import { JsonLd } from "@/components/JsonLd";

const FAQS = [
  {
    question: "What is consumer electronics ecosystem lock-in?",
    answer: "Ecosystem lock-in occurs when a manufacturer (like Apple, Google, or Samsung) designs hardware and software to work perfectly together but artificially restricts compatibility with competing brands. This forces consumers to buy all their devices from a single brand to maintain full functionality, increasing the total cost of ownership."
  },
  {
    question: "How much does the Apple ecosystem tax cost?",
    answer: "The 'ecosystem tax' can add 30% to 50% to your hardware costs over 3-5 years. When you buy an iPhone, you are strongly incentivized to buy an Apple Watch, AirPods, and AirTags, which have little to no resale value or utility if you ever switch to Android."
  },
  {
    question: "What are the best open alternatives to walled gardens?",
    answer: "For smart homes, devices supporting the Matter and Thread protocols (like Home Assistant) offer true interoperability. For wearables, Garmin and Oura are platform-agnostic. For audio, wired IEMs with a Qudelix 5K or standard Multipoint Bluetooth headphones offer superior longevity and cross-platform support."
  },
  {
    question: "Is Matter protocol truly interoperable?",
    answer: "Matter is a unifying open-source connectivity standard built on top of IP (Wi-Fi, Thread, Ethernet). Devices certified for Matter can communicate locally without requiring proprietary cloud bridges, reducing lock-in to specific hubs like Apple HomeKit or Google Home."
  }
];

export function EcosystemFAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="reveal relative z-10 py-16 border-t border-edge">
      <JsonLd data={faqSchema} />
      
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-3xl font-semibold tracking-tight mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-surface/30 border border-edge rounded-2xl p-6">
              <h3 className="font-semibold text-lg text-ink mb-3">{faq.question}</h3>
              <p className="text-dim leading-relaxed text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
