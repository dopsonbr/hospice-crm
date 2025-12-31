// Activity types
export const ACTIVITY_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'demo', label: 'Demo' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'other', label: 'Other' },
] as const;

export const OUTCOMES = [
  { value: 'positive', label: 'Positive', color: 'success' },
  { value: 'neutral', label: 'Neutral', color: 'secondary' },
  { value: 'negative', label: 'Negative', color: 'destructive' },
] as const;

// Task types and priorities
export const TASK_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'demo', label: 'Demo' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'other', label: 'Other' },
] as const;

export const PRIORITIES = [
  { value: 'high', label: 'High', color: 'destructive' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'low', label: 'Low', color: 'secondary' },
] as const;

// Deal stages
export const DEAL_STAGES = [
  { value: 'lead', label: 'Lead', probability: 5 },
  { value: 'discovery', label: 'Discovery', probability: 15 },
  { value: 'demo_scheduled', label: 'Demo Scheduled', probability: 25 },
  { value: 'demo_completed', label: 'Demo Completed', probability: 40 },
  { value: 'proposal_sent', label: 'Proposal Sent', probability: 60 },
  { value: 'negotiation', label: 'Negotiation', probability: 75 },
  { value: 'verbal_commit', label: 'Verbal Commit', probability: 90 },
  { value: 'closed_won', label: 'Closed Won', probability: 100 },
  { value: 'closed_lost', label: 'Closed Lost', probability: 0 },
] as const;

export type DealStage = (typeof DEAL_STAGES)[number]['value'];
