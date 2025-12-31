# HospicePro CRM - Functional Design Document

## Executive Summary

A lightweight, single-user CRM designed specifically for selling hospice facility management software. Built for efficiency with a focus on relationship tracking, long B2B sales cycles, and healthcare industry-specific workflows.

---

## 1. Target User Profile

**Primary User**: Solo salesperson or small team selling hospice facility management software

**Key Characteristics**:
- Manages 50-200 active prospects at any time
- Deals with long sales cycles (3-12 months typical in healthcare B2B)
- Multiple stakeholders per facility (Administrator, Director of Nursing, IT, Finance)
- Compliance and regulatory considerations in conversations
- Territory-based selling (geographic regions)

---

## 2. Core Modules

### 2.1 Dashboard (Home)

**Purpose**: At-a-glance view of sales health and immediate priorities

**Key Widgets**:
| Widget | Description |
|--------|-------------|
| Today's Tasks | Overdue + due today follow-ups, calls, demos |
| Pipeline Summary | Visual funnel with deal count and value per stage |
| Recent Activity | Last 10 touchpoints logged |
| Hot Prospects | Deals marked as "hot" or with activity in last 7 days |
| Revenue Forecast | Projected closes this month/quarter |
| Win/Loss Ticker | Recent wins and losses with quick access to post-mortems |

---

### 2.2 Facilities (Accounts)

**Purpose**: Track hospice organizations as the primary selling entity

**Facility Record Fields**:

| Field | Type | Notes |
|-------|------|-------|
| Facility Name | Text | Primary identifier |
| Facility Type | Dropdown | Hospice, Home Health, Palliative Care, Hybrid |
| Ownership Type | Dropdown | For-Profit, Non-Profit, Hospital-Affiliated, Independent |
| Census Size | Number | Average daily census (key sizing metric) |
| Annual Revenue | Currency | Estimated, for deal sizing |
| Address | Address | Physical location |
| Service Territory | Multi-select | Counties/regions served |
| Medicare Provider # | Text | CMS certification number |
| Current Software | Text | Incumbent EMR/billing system |
| Contract Renewal | Date | When current software contract expires |
| Pain Points | Multi-line | Key issues with current solution |
| Decision Timeline | Date Range | When they plan to make a decision |
| Assigned Territory | Dropdown | Your sales territory assignment |

**Facility Views**:
- All Facilities (filterable grid)
- My Territory Map (geographic visualization)
- Renewal Calendar (timeline of contract expirations)
- Recently Contacted / Neglected (activity-based)

---

### 2.3 Contacts (People)

**Purpose**: Track individuals within facilities who influence buying decisions

**Contact Record Fields**:

| Field | Type | Notes |
|-------|------|-------|
| Name | Text | Full name |
| Title/Role | Dropdown | Administrator, DON, CFO, IT Director, Owner, Other |
| Facility | Lookup | Link to facility record |
| Buyer Role | Dropdown | Decision Maker, Influencer, Champion, Blocker, End User |
| Email | Email | Primary email |
| Phone | Phone | Direct line |
| Mobile | Phone | Cell for texting |
| Preferred Contact | Dropdown | Email, Phone, Text, In-Person |
| LinkedIn | URL | Profile link |
| Notes | Multi-line | Personal details, rapport notes |
| Last Contact | Auto | Auto-updated from activities |
| Engagement Score | Calculated | Based on response rates, meeting attendance |

**Contact Views**:
- All Contacts
- Decision Makers Only
- Champions (your internal advocates)
- Neglected Contacts (no touch in 30+ days)

---

### 2.4 Deals (Opportunities)

**Purpose**: Track active sales opportunities through your pipeline

**Deal Record Fields**:

| Field | Type | Notes |
|-------|------|-------|
| Deal Name | Text | Typically "Facility Name - Product" |
| Facility | Lookup | Link to facility |
| Primary Contact | Lookup | Main point of contact |
| Stage | Dropdown | See pipeline stages below |
| Deal Value | Currency | Estimated contract value |
| Recurring Value | Currency | Annual recurring revenue |
| Product Interest | Multi-select | Modules they're interested in |
| Close Date | Date | Expected close |
| Probability | Percentage | Auto from stage or manual override |
| Competition | Multi-select | Competing vendors |
| Next Step | Text | Immediate next action |
| Loss Reason | Dropdown | If lost: Price, Features, Incumbent, Timing, etc. |

**Pipeline Stages**:

| Stage | Probability | Exit Criteria |
|-------|-------------|---------------|
| 1. Lead | 5% | Initial contact made |
| 2. Discovery | 15% | Needs assessment call completed |
| 3. Demo Scheduled | 25% | Demo date confirmed |
| 4. Demo Completed | 40% | Demo delivered, stakeholders attended |
| 5. Proposal Sent | 60% | Formal proposal/quote delivered |
| 6. Negotiation | 75% | Active contract discussion |
| 7. Verbal Commit | 90% | Verbal yes, awaiting paperwork |
| 8. Closed Won | 100% | Contract signed |
| 9. Closed Lost | 0% | Deal lost (capture reason) |

---

### 2.5 Activities

**Purpose**: Log all touchpoints and schedule follow-ups

**Activity Types**:
- Call (Outbound/Inbound)
- Email (Sent/Received)
- Meeting (In-Person/Virtual)
- Demo
- Proposal Review
- Site Visit
- Conference/Trade Show
- Note (General)

**Activity Record**:

| Field | Type |
|-------|------|
| Type | Dropdown |
| Subject | Text |
| Date/Time | DateTime |
| Duration | Number |
| Facility | Lookup |
| Contact(s) | Multi-lookup |
| Deal | Lookup |
| Notes | Rich Text |
| Follow-up Date | Date |
| Follow-up Type | Dropdown |
| Outcome | Dropdown (Positive/Neutral/Negative) |

---

### 2.6 Tasks & Reminders

**Purpose**: Never miss a follow-up

**Task Fields**:
- Task Type (Call, Email, Send Info, Follow-up, Other)
- Due Date/Time
- Priority (High/Medium/Low)
- Related Facility
- Related Contact
- Related Deal
- Notes
- Status (Open/Completed/Deferred)

**Smart Reminders** (Auto-generated):
- No contact with active deal in 14 days
- Contract renewal approaching (90/60/30 days)
- Follow-up date passed
- Demo scheduled (day before reminder)
- Proposal sent, no response in 7 days

---

### 2.7 Industry Intelligence

**Purpose**: Track market context for better conversations

**Data Points**:
- Competitor Tracking (features, pricing, wins/losses)
- Industry News Feed (hospice regulations, M&A, policy changes)
- Trade Show Calendar
- Common Objections Library (with responses)
- Case Studies / Social Proof inventory

---

## 3. Key Workflows

### 3.1 New Lead Intake

```
1. Add Facility (basic info)
2. Add Primary Contact
3. Create Deal (Stage: Lead)
4. Log initial activity (how you found them)
5. Schedule discovery call task
```

### 3.2 Demo Workflow

```
1. Deal moves to "Demo Scheduled"
2. Auto-create tasks:
   - Send calendar invite
   - Send pre-demo questionnaire
   - Prepare custom demo environment
   - Day-before confirmation call
3. Post-demo: Log activity, update stage, capture feedback
4. Auto-prompt for proposal or follow-up scheduling
```

### 3.3 Daily Sales Routine

```
Morning Review:
1. Check overdue tasks
2. Review today's scheduled activities
3. Scan hot deals for updates

Active Selling:
4. Execute calls/emails
5. Log activities in real-time
6. Update deal stages as warranted

End of Day:
7. Plan tomorrow's priorities
8. Update any stale deals
9. Quick pipeline review
```

---

## 4. Reporting & Analytics

### 4.1 Core Reports

| Report | Description |
|--------|-------------|
| Pipeline Report | All active deals by stage with values |
| Activity Summary | Calls, emails, demos by week/month |
| Win/Loss Analysis | Closed deals with reasons and patterns |
| Forecast Report | Expected revenue by month/quarter |
| Territory Coverage | Facilities by region with status |
| Neglected Prospects | Active deals with no recent activity |
| Lead Source ROI | Where your best deals originate |

### 4.2 Key Metrics to Track

- Total Pipeline Value
- Weighted Pipeline Value
- Average Deal Size
- Average Sales Cycle Length
- Win Rate (by stage, by competitor, by facility type)
- Activities per Deal (calls to close)
- Conversion Rates (stage to stage)

---

## 5. Integrations (Future)

| Integration | Purpose |
|-------------|---------|
| Email (Gmail/Outlook) | Auto-log sent/received emails |
| Calendar | Sync meetings, auto-create activities |
| LinkedIn Sales Navigator | Enrich contact data |
| DocuSign | Track proposal/contract status |
| Phone/Dialer | Click-to-call, call logging |
| CMS/Medicare Data | Auto-populate facility data |

---

## 6. Mobile Considerations

**Essential Mobile Features**:
- Quick activity logging (voice-to-text)
- View upcoming tasks
- Facility/contact lookup
- Click-to-call/email
- Add quick notes post-meeting
- Offline access to key data

---

## 7. Data Model Summary

```
Facility (1) ─── (M) Contacts
    │                  │
    │                  │
    └──── (M) Deals ───┘
              │
              │
         (M) Activities
              │
         (M) Tasks
```

---

## 8. User Experience Principles

1. **Minimum Clicks**: Most common actions in 1-2 clicks
2. **Context Preservation**: See related info without leaving current view
3. **Smart Defaults**: Pre-fill based on patterns
4. **Keyboard Navigation**: Power user shortcuts
5. **Offline-First**: Core functionality works without connection
6. **Healthcare Aesthetic**: Calming, professional, trustworthy

---

## 9. Security & Compliance

- Data encryption at rest and in transit
- Daily automated backups
- Export functionality (CSV, PDF)
- Activity audit log
- HIPAA-aware (though CRM data typically not PHI)

---

## Appendix A: Hospice Industry Context

**Key Decision Makers**:
- Executive Director/Administrator (final authority)
- Director of Nursing (clinical champion)
- CFO/Finance Director (ROI focus)
- IT Director (technical requirements)
- Owner/Board (strategic decisions)

**Buying Triggers**:
- Current software contract expiring
- Regulatory compliance issues
- Growth/scaling challenges
- Merger/acquisition
- New leadership with different preferences
- Poor support from incumbent vendor

**Common Objections**:
- "We're happy with our current system"
- "Implementation is too disruptive"
- "Budget constraints"
- "Staff won't adopt new technology"
- "Concerned about data migration"

---

## Appendix B: Competitive Landscape

Track these competitors and their positioning:
- Homecare Homebase
- Brightree
- Axxess
- MatrixCare
- WellSky
- Netsmart
- Kinnser (now part of WellSky)

---

*Document Version: 1.0*
*Last Updated: December 2024*
