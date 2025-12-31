# HospicePro CRM

> A lightweight, purpose-built CRM for solo sales professionals selling hospice facility management software.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-in%20development-yellow.svg)

---

## Overview

HospicePro CRM is designed specifically for the unique challenges of selling software to hospice and home health organizations. Unlike generic CRMs that require extensive customization, HospicePro understands the hospice industry out of the box—from Medicare provider numbers to census-based deal sizing to the long, relationship-driven sales cycles typical in healthcare B2B.

### Who Is This For?

- **Solo salespeople** or small teams (1-3 people) selling hospice/home health software
- **Sales professionals** managing 50-200 active prospects with 3-12 month sales cycles
- **Territory-based sellers** who need geographic organization of accounts

### Why Another CRM?

| Generic CRM Pain Points | HospicePro Solution |
|------------------------|---------------------|
| Hours of custom field setup | Hospice-specific fields pre-configured |
| Complex multi-user permissions | Streamlined for single user |
| Expensive per-seat pricing | Free/low-cost for solo use |
| No industry context | Built-in hospice industry intelligence |
| Overkill features you'll never use | Focused feature set for what matters |

---

## Business Functionality

### 🏥 Facility Management

Track hospice organizations as your primary selling entity. Each facility record captures:

- **Organization Details**: Name, type (Hospice, Home Health, Palliative, Hybrid), ownership structure
- **Sizing Metrics**: Average daily census, estimated annual revenue—the key indicators for deal sizing
- **Compliance Data**: Medicare Provider Number for verification and research
- **Competitive Intelligence**: Current software vendor, contract renewal date, known pain points
- **Decision Timeline**: When they plan to evaluate and make a decision

**Key Insight**: Contract renewal dates are gold. HospicePro surfaces facilities with upcoming renewals so you can time your outreach perfectly.

### 👤 Contact Management

Map the buying committee within each facility:

- **Buyer Roles**: Decision Maker, Influencer, Champion, Blocker, End User
- **Key Titles**: Executive Director, Director of Nursing, CFO, IT Director, Owner
- **Communication Preferences**: Email, phone, text, in-person
- **Engagement Tracking**: Last contact date, response rates, meeting attendance

**Key Insight**: Hospice software purchases typically involve 3-5 stakeholders. HospicePro helps you identify and track relationships with each.

### 💰 Deal Pipeline

Manage opportunities through a healthcare-calibrated sales process:

| Stage | Probability | What It Means |
|-------|-------------|---------------|
| Lead | 5% | Initial contact made, qualified as potential fit |
| Discovery | 15% | Needs assessment completed, pain points identified |
| Demo Scheduled | 25% | Demo date confirmed with key stakeholders |
| Demo Completed | 40% | Demo delivered, stakeholders attended |
| Proposal Sent | 60% | Formal quote/proposal delivered |
| Negotiation | 75% | Active contract discussion, legal review |
| Verbal Commit | 90% | Verbal yes, awaiting signed paperwork |
| Closed Won | 100% | Contract signed, deal complete |
| Closed Lost | 0% | Deal lost (reason captured for analysis) |

**Key Insight**: The 3-12 month sales cycle in healthcare means deals can go cold. HospicePro alerts you when deals are stagnating.

### ✅ Task Management

Never miss a follow-up with intelligent task tracking:

- **Task Types**: Calls, emails, meetings, demos, proposals, follow-ups
- **Priority Levels**: High, Medium, Low with visual indicators
- **Smart Reminders**: Auto-generated alerts for neglected deals, upcoming renewals, and overdue follow-ups
- **Daily Workflow**: "Today's Tasks" view shows exactly what needs attention

**Auto-Generated Reminders**:
- No contact with active deal in 14 days
- Contract renewal approaching (90/60/30 days out)
- Proposal sent with no response in 7 days
- Demo scheduled (day-before reminder)

### 📊 Activity Logging

Build a complete history of every touchpoint:

- **Activity Types**: Calls (in/out), emails (sent/received), meetings, demos, site visits
- **Outcome Tracking**: Positive, neutral, negative—spot patterns in what's working
- **Duration Logging**: Track time investment per deal
- **Notes & Context**: Rich text notes for meeting summaries and action items

### 📈 Reporting & Analytics

Understand your pipeline health at a glance:

| Report | Business Value |
|--------|----------------|
| Pipeline Summary | Total and weighted pipeline value by stage |
| Activity Metrics | Calls, emails, demos per week/month |
| Win/Loss Analysis | Why deals close or don't—patterns and trends |
| Forecast | Expected revenue by month/quarter |
| Territory Coverage | Geographic view of your accounts |
| Neglected Prospects | Deals going cold that need attention |
| Lead Source ROI | Which lead sources produce the best deals |

**Key Metrics**:
- Average deal size
- Average sales cycle length
- Win rate (overall and by competitor)
- Activities per closed deal

---

## Industry Intelligence

### Built-In Competitor Tracking

Track how you stack up against:
- Homecare Homebase
- Brightree
- Axxess
- MatrixCare
- WellSky
- Netsmart

Log wins and losses by competitor to identify patterns and refine your positioning.

### Common Objection Library

Pre-loaded responses to typical hospice software objections:
- "We're happy with our current system"
- "Implementation is too disruptive"
- "Budget constraints"
- "Staff won't adopt new technology"
- "Concerned about data migration"

### Buying Trigger Recognition

The system helps you identify and track common buying triggers:
- Current software contract expiring
- Regulatory compliance issues
- Growth/scaling challenges
- Merger or acquisition activity
- New leadership with different preferences
- Poor support from incumbent vendor

---

## Key Workflows

### Daily Sales Routine

```
Morning (15 min):
├── Review overdue tasks
├── Check today's scheduled activities
└── Scan hot deals for updates

Active Selling:
├── Execute calls and emails
├── Log activities in real-time
└── Update deal stages as warranted

End of Day (10 min):
├── Plan tomorrow's priorities
├── Update any stale deals
└── Quick pipeline review
```

### New Lead Intake

```
1. Add Facility (basic info + renewal date)
2. Add Primary Contact (title + buyer role)
3. Create Deal (Stage: Lead)
4. Log initial activity (source, first impression)
5. Schedule discovery call task
```

### Demo Workflow

```
Pre-Demo:
├── Move deal to "Demo Scheduled"
├── Send calendar invite
├── Send pre-demo questionnaire
└── Day-before confirmation call

Post-Demo:
├── Log activity with attendees and notes
├── Capture stakeholder feedback
├── Update deal stage
└── Schedule proposal or follow-up
```

---

## Data Model

```
┌─────────────┐       ┌─────────────┐
│  Facility   │───────│   Contact   │
│             │ 1:M   │             │
└─────────────┘       └─────────────┘
       │                     │
       │ 1:M                 │
       ▼                     │
┌─────────────┐              │
│    Deal     │──────────────┘
│             │         M:1 (primary contact)
└─────────────┘
       │
       │ 1:M
       ▼
┌─────────────┐       ┌─────────────┐
│  Activity   │       │    Task     │
└─────────────┘       └─────────────┘
```

- **Facility** (1) → (Many) **Contacts**: Multiple people at each organization
- **Facility** (1) → (Many) **Deals**: Could have multiple opportunities over time
- **Deal** (Many) → (1) **Primary Contact**: One main point of contact per deal
- **Deal** (1) → (Many) **Activities**: Complete interaction history
- **Deal** (1) → (Many) **Tasks**: Follow-ups and to-dos

---

## Technical Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js 16, React, TypeScript | Modern, fast, great DX |
| UI Components | shadcn/ui + Tailwind CSS | Full control, accessible |
| Backend | Next.js Server Actions | Simple, type-safe |
| Database | Supabase (PostgreSQL) | Free tier, built-in auth |
| ORM | Drizzle | Fast, SQL-first, type-safe |
| Auth | Supabase Auth | Email, magic links, OAuth |
| Deployment | Vercel | Free, automatic CI/CD |

**Cost**: $0/month on free tiers until significant scale

---

## Getting Started

### Prerequisites

- Node.js 24+
- npm or pnpm
- Supabase account (free)
- Vercel account (free, optional for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hospice-crm.git
cd hospice-crm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and keys

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_connection_string
```

---

## Project Structure

```
hospice-crm/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login, signup pages
│   ├── (dashboard)/       # Protected CRM pages
│   │   ├── facilities/
│   │   ├── contacts/
│   │   ├── deals/
│   │   └── tasks/
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── facilities/        # Facility-specific components
│   ├── deals/             # Deal-specific components
│   └── shared/            # Layout, navigation
├── lib/
│   ├── db/                # Drizzle schema & client
│   ├── supabase/          # Supabase clients
│   └── actions/           # Server actions
└── types/                 # TypeScript definitions
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [USER_GUIDE.md](./USER_GUIDE.md) | Complete guide to using the application |
| [FUNCTIONAL_DESIGN.md](./FUNCTIONAL_DESIGN.md) | Detailed functional specifications |
| [TECH_STACK.md](./TECH_STACK.md) | Architecture and technology decisions |

---

## Roadmap

### Phase 1: Core CRM (Current)
- [ ] Facility management
- [ ] Contact management
- [ ] Deal pipeline
- [ ] Task management
- [ ] Activity logging
- [ ] Basic reporting

### Phase 2: Intelligence
- [ ] Contract renewal alerts
- [ ] Deal health scoring
- [ ] Competitor win/loss tracking
- [ ] Objection library

### Phase 3: Productivity
- [ ] Email integration (auto-log)
- [ ] Calendar sync
- [ ] Mobile app
- [ ] Territory map view

### Phase 4: Growth
- [ ] Multi-user support
- [ ] Team dashboards
- [ ] API access
- [ ] Integrations (DocuSign, LinkedIn)

---

## Contributing

This is currently a single-developer project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for hosting and v0

---

**Built with ❤️ for hospice sales professionals**
