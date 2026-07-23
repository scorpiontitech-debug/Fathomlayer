export type Playbook = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMonthlyCost: number;
  timeToImplementMins: number;
  toolsUsed: string[];
  flowchart: { step: number; action: string; tool: string }[];
};

export const PLAYBOOKS: Playbook[] = [
  {
    id: "auto-seo-blog",
    title: "The Autonomous SEO Writer",
    description: "A fully automated pipeline that researches trending topics on Google, uses an LLM to write a 2,000-word SEO-optimized article, and publishes it directly to Webflow.",
    difficulty: "Intermediate",
    estimatedMonthlyCost: 29.00,
    timeToImplementMins: 45,
    toolsUsed: ["Make.com", "Perplexity API", "Anthropic Claude", "Webflow"],
    flowchart: [
      { step: 1, action: "Trigger daily at 9:00 AM", tool: "Make.com" },
      { step: 2, action: "Search 'latest AI news'", tool: "Perplexity API" },
      { step: 3, action: "Draft SEO Article", tool: "Claude 3.5 Sonnet" },
      { step: 4, action: "Create CMS Item", tool: "Webflow" }
    ]
  },
  {
    id: "support-ticket-triage",
    title: "AI Support Ticket Triage",
    description: "Stop manually assigning Zendesk tickets. This agent reads incoming customer emails, categorizes the urgency, drafts a reply, and pings the correct department in Slack.",
    difficulty: "Advanced",
    estimatedMonthlyCost: 45.00,
    timeToImplementMins: 120,
    toolsUsed: ["Lindy AI", "Zendesk", "Slack"],
    flowchart: [
      { step: 1, action: "Listen for new Ticket", tool: "Zendesk" },
      { step: 2, action: "Analyze sentiment & category", tool: "Lindy AI" },
      { step: 3, action: "If urgent, DM support manager", tool: "Slack" },
      { step: 4, action: "Draft response in ticket", tool: "Zendesk" }
    ]
  },
  {
    id: "meeting-crm-updater",
    title: "The Hands-Free Sales Rep",
    description: "Never type meeting notes again. Automatically transcribe Google Meet calls, extract action items, and update the Lead profile in Salesforce or HubSpot.",
    difficulty: "Beginner",
    estimatedMonthlyCost: 15.00,
    timeToImplementMins: 15,
    toolsUsed: ["Fireflies.ai", "Zapier", "HubSpot"],
    flowchart: [
      { step: 1, action: "Record & Transcribe Call", tool: "Fireflies.ai" },
      { step: 2, action: "Webhook trigger on completion", tool: "Zapier" },
      { step: 3, action: "Extract Action Items", tool: "OpenAI GPT-4o" },
      { step: 4, action: "Update Contact Notes", tool: "HubSpot" }
    ]
  }
];
