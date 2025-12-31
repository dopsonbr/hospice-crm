# HospicePro CRM User Guide

> A comprehensive guide to managing your hospice software sales pipeline

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Facilities](#managing-facilities)
4. [Managing Contacts](#managing-contacts)
5. [Working with Deals](#working-with-deals)
6. [Task Management](#task-management)
7. [Logging Activities](#logging-activities)
8. [Daily Workflows](#daily-workflows)
9. [Tips & Best Practices](#tips--best-practices)
10. [Keyboard Shortcuts](#keyboard-shortcuts)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First-Time Setup

1. **Log in** at `https://your-hospice-crm.vercel.app`
2. **Create your account** using email or Google sign-in
3. **Complete your profile** with your name and territory information

### Navigation

The main navigation appears in the header bar with five primary sections:

| Icon | Section | Purpose |
|------|---------|---------|
| 📊 | Dashboard | At-a-glance pipeline health and daily priorities |
| 🏥 | Facilities | Hospice organizations you're selling to |
| 👤 | Contacts | People within those facilities |
| 💰 | Pipeline | Visual deal board and opportunity tracking |
| ✅ | Tasks | Your to-do list and follow-up reminders |

> **📍 Wireframe Reference**: See the header navigation in `wireframes.jsx` lines 280-310

---

## Dashboard Overview

The Dashboard is your command center—designed to answer "What should I focus on right now?"

### Stats Row

Four key metrics appear at the top:

| Metric | What It Shows | Why It Matters |
|--------|---------------|----------------|
| **Pipeline Value** | Total value of all active deals | Your total potential revenue |
| **Active Deals** | Count of deals not yet closed | Workload indicator |
| **This Month** | Revenue closed this month | Progress toward quota |
| **Win Rate** | % of deals won (last 90 days) | Sales effectiveness |

> **📍 Wireframe Reference**: Stats cards in `wireframes.jsx` lines 145-175

### Pipeline Overview

A horizontal bar chart shows your deals distributed across stages:

```
Lead         ████████░░░░░░░░░░  8 deals   $180,000
Discovery    ██████░░░░░░░░░░░░  5 deals   $145,000
Demo Sched   ████░░░░░░░░░░░░░░  3 deals   $95,000
Demo Done    ██████░░░░░░░░░░░░  4 deals   $165,000
Proposal     ███░░░░░░░░░░░░░░░  2 deals   $73,000
Negotiation  ████░░░░░░░░░░░░░░  2 deals   $155,000
```

**Reading the Chart**:
- Longer bars = more value in that stage
- Click any bar to see deals in that stage
- Healthy pipeline has deals distributed across stages (not bunched up)

> **📍 Wireframe Reference**: Pipeline visualization in `wireframes.jsx` lines 178-200

### Today's Tasks

Shows your most urgent items:

- **Red dot** = High priority
- **Yellow dot** = Medium priority  
- **Gray dot** = Low priority
- **"Overdue" badge** = Past due date

Click a task to mark it complete or view details.

> **📍 Wireframe Reference**: Task list in `wireframes.jsx` lines 203-225

### Recent Activity

A feed of your latest touchpoints across all deals. Each entry shows:
- Activity type icon (call, email, meeting, etc.)
- Description of what happened
- Facility and contact name
- Timestamp

> **📍 Wireframe Reference**: Activity feed in `wireframes.jsx` lines 228-245

---

## Managing Facilities

Facilities are hospice organizations—your primary accounts.

### Viewing Facilities

Navigate to **Facilities** to see all your accounts in a sortable table.

| Column | Description |
|--------|-------------|
| Facility | Name, type, and location |
| Census | Average daily census (key sizing metric) |
| Stage | Current deal stage for primary opportunity |
| Value | Deal value |
| Next Step | What needs to happen next |
| Last Contact | Days since last touchpoint |

**Sorting**: Click any column header to sort. Click again to reverse.

**Filtering**: Use the dropdown filters for:
- Facility Type (Hospice, Home Health, Palliative, Hybrid)
- Deal Stage
- Territory

> **📍 Wireframe Reference**: Facilities table in `wireframes.jsx` lines 250-295

### Adding a New Facility

1. Click **+ Add Facility** button (top right)
2. Fill in required fields:
   - **Facility Name** (required)
   - **Facility Type** (required)
   - **City/State** (recommended)
3. Add optional but valuable fields:
   - **Census Size** — helps with deal sizing
   - **Contract Renewal Date** — critical for timing
   - **Current Software** — know your competition
4. Click **Save**

**Pro Tip**: Always capture the contract renewal date when you learn it. This is often the #1 predictor of when a facility will seriously evaluate new software.

### Facility Detail Panel

Click any facility row to open the detail panel on the right side.

The panel shows:
- **Header**: Facility name, type, location
- **Quick Stats**: Census size, deal value
- **Current Stage**: Visual badge
- **Contract Renewal**: Calendar date
- **Next Step**: Highlighted action item
- **Quick Actions**: Call, Email, Log Activity buttons

> **📍 Wireframe Reference**: Detail panel in `wireframes.jsx` lines 297-355

### Editing a Facility

1. Click the facility row to open the detail panel
2. Click the **Edit** button (pencil icon)
3. Modify any fields
4. Click **Save Changes**

---

## Managing Contacts

Contacts are people within facilities who influence buying decisions.

### Understanding Buyer Roles

Each contact should be tagged with their role in the buying process:

| Role | Description | Strategy |
|------|-------------|----------|
| **Decision Maker** | Has final authority to sign | Must have their buy-in to close |
| **Champion** | Internal advocate for your solution | Nurture closely, arm with ammo |
| **Influencer** | Affects the decision but doesn't decide | Address their concerns |
| **Blocker** | Actively opposes your solution | Understand objections, neutralize |
| **End User** | Will use the software daily | Demonstrate ease of use |

> **📍 Wireframe Reference**: Role badges in `wireframes.jsx` lines 85-95

### Adding a Contact

1. Navigate to **Contacts**
2. Click **+ Add Contact**
3. Fill in:
   - **Name** (required)
   - **Facility** (required) — select from your facilities
   - **Title** (e.g., Executive Director, DON)
   - **Buyer Role** — crucial for strategy
   - **Email / Phone**
   - **Preferred Contact Method**
4. Click **Save**

### Contact List View

The contact list shows:
- **Avatar**: Initials with color coding
- **Name & Role Badge**: Quick identification
- **Title**: Their position
- **Facility**: Where they work
- **Last Contact**: Engagement recency
- **Quick Actions**: Phone and email buttons

> **📍 Wireframe Reference**: Contact cards in `wireframes.jsx` lines 360-400

### Key Contacts to Track

For a typical hospice software deal, try to identify:

1. **Executive Director / Administrator** — Usually the Decision Maker
2. **Director of Nursing (DON)** — Clinical Champion or Blocker
3. **CFO / Finance Director** — Cares about ROI and cost
4. **IT Director** — Technical requirements
5. **Owner / Board Member** — Strategic decisions (if applicable)

---

## Working with Deals

Deals (opportunities) track your active sales pursuits.

### Pipeline Stages

Your deals move through these stages:

```
┌─────────┐   ┌───────────┐   ┌──────────────┐   ┌──────────────┐
│  Lead   │ → │ Discovery │ → │ Demo Sched'd │ → │ Demo Done    │
│   5%    │   │    15%    │   │     25%      │   │     40%      │
└─────────┘   └───────────┘   └──────────────┘   └──────────────┘
                                                        │
                                                        ▼
┌─────────┐   ┌───────────┐   ┌──────────────┐   ┌──────────────┐
│ Closed  │ ← │  Verbal   │ ← │ Negotiation  │ ← │   Proposal   │
│  Won!   │   │  Commit   │   │     75%      │   │     60%      │
└─────────┘   └───────────┘   └──────────────┘   └──────────────┘
```

**Stage Definitions**:

| Stage | Exit Criteria | Typical Duration |
|-------|---------------|------------------|
| Lead | Initial contact made, basic qualification | 1-2 weeks |
| Discovery | Completed needs assessment call | 2-4 weeks |
| Demo Scheduled | Demo date confirmed with stakeholders | 1-2 weeks |
| Demo Completed | Demo delivered, feedback captured | 1-2 weeks |
| Proposal Sent | Formal quote/proposal delivered | 2-4 weeks |
| Negotiation | Active contract discussion | 2-8 weeks |
| Verbal Commit | Verbal yes, awaiting paperwork | 1-4 weeks |

### Pipeline Board View

The Pipeline view shows a Kanban-style board:

- **Columns** = Stages
- **Cards** = Individual deals
- **Drag & Drop** = Move deals between stages

Each deal card shows:
- Facility name
- City/State
- Deal value
- Last contact date

> **📍 Wireframe Reference**: Kanban board in `wireframes.jsx` lines 405-455

### Creating a Deal

Deals are typically created alongside a new facility:

1. Add the Facility first
2. From the Facility detail panel, click **+ New Deal**

Or create standalone:
1. Navigate to **Pipeline**
2. Click **+ Add Deal** in any stage column
3. Select the Facility
4. Set the Primary Contact
5. Enter Deal Value (estimate is fine)
6. Add Next Step

### Updating Deal Stage

**Method 1: Drag & Drop**
- In Pipeline view, drag the deal card to a new column

**Method 2: Detail Panel**
- Click the deal to open details
- Use the Stage dropdown to select new stage

**Important**: When moving to "Closed Lost," you'll be prompted to select a loss reason. This data is valuable for improving your approach.

### Deal Value Guidelines

For hospice software, deal value typically correlates with census:

| Census Size | Typical Deal Range |
|-------------|-------------------|
| Under 50 | $15,000 - $30,000 |
| 50-100 | $30,000 - $50,000 |
| 100-200 | $50,000 - $80,000 |
| 200+ | $80,000 - $150,000+ |

**Tip**: Update deal values as you learn more during discovery. Early estimates are often wrong.

---

## Task Management

Tasks ensure nothing falls through the cracks.

### Task Types

| Type | When to Use |
|------|-------------|
| **Call** | Scheduled phone conversations |
| **Email** | Important emails that need follow-up |
| **Meeting** | In-person or video meetings |
| **Demo** | Product demonstrations |
| **Follow-up** | General check-ins |
| **Other** | Anything else |

### Creating Tasks

**Quick Add** (from any page):
1. Look for the **+ Add Task** button
2. Select task type
3. Enter description
4. Link to Facility (and optionally Contact/Deal)
5. Set due date and priority
6. Save

> **📍 Wireframe Reference**: Quick add form in `wireframes.jsx` lines 490-540

**From Activity Logging**:
When you log an activity, you can create a follow-up task in the same flow.

### Task Views

The Tasks page offers several views:

| View | Shows |
|------|-------|
| **Today** | Overdue + due today |
| **Upcoming** | Next 7 days |
| **All Open** | Everything not completed |
| **Completed** | Done tasks (for reference) |

### Completing Tasks

- **Checkbox**: Click the checkbox to mark complete
- **Bulk Actions**: Select multiple tasks to complete at once

### Smart Reminders (Auto-Generated)

The system automatically creates tasks for:

| Trigger | Task Created |
|---------|--------------|
| No contact with active deal in 14 days | "Check in on [Facility]" |
| Contract renewal in 90 days | "Renewal approaching - reach out" |
| Proposal sent, no response in 7 days | "Follow up on proposal" |
| Demo tomorrow | "Confirm demo with [Contact]" |

These appear with a 🤖 icon to indicate they're system-generated.

---

## Logging Activities

Activities create a permanent record of every touchpoint.

### Why Log Activities?

1. **Memory**: Remember what you discussed 6 months ago
2. **Patterns**: See what's working across deals
3. **Handoff**: If someone else takes over, they have context
4. **Accountability**: Track your own effort

### Activity Fields

| Field | Description |
|-------|-------------|
| **Type** | Call, Email, Meeting, Demo, Site Visit, Note |
| **Subject** | Brief description |
| **Date/Time** | When it happened |
| **Duration** | How long (for meetings/calls) |
| **Facility** | Which account |
| **Contact(s)** | Who was involved |
| **Deal** | Related opportunity |
| **Notes** | Detailed summary |
| **Outcome** | Positive / Neutral / Negative |
| **Follow-up** | Schedule next step |

### Logging Best Practices

**Do Log**:
- Every call (even voicemails)
- Every meeting (with attendee list)
- Important emails (not routine)
- Key discoveries and objections
- Commitments made (by you or them)

**Don't Bother Logging**:
- "Just checking in" emails with no response
- Internal discussions
- Calendar reminders

### Quick Logging

From the Facility detail panel:
1. Click **Log Activity**
2. Select type
3. Add quick notes
4. Optionally schedule follow-up
5. Save

---

## Daily Workflows

### Morning Routine (15 minutes)

```
1. Open Dashboard
   └── Scan "Today's Tasks" for overdue items

2. Check Hot Deals
   └── Any updates needed?
   └── Any follow-ups due?

3. Review Calendar
   └── Prep for any meetings/demos
   └── Confirm appointments
```

### During the Day

```
For Each Activity:
1. Before: Review facility history
2. During: Take notes
3. After: Log activity immediately
         Update deal stage if needed
         Create follow-up task
```

**Pro Tip**: Log activities within 5 minutes of completion. Details fade fast.

### End of Day (10 minutes)

```
1. Complete Task Review
   └── Mark done items complete
   └── Reschedule anything slipping

2. Pipeline Scan
   └── Any deals need stage updates?
   └── Any neglected deals?

3. Tomorrow Planning
   └── Top 3 priorities for tomorrow
```

### Weekly Review (30 minutes)

```
Every Friday:
1. Pipeline Health Check
   └── Total value trending up/down?
   └── Deals stuck in any stage?
   └── Win rate tracking?

2. Neglected Accounts
   └── Who haven't you talked to in 2+ weeks?
   └── Schedule re-engagement

3. Forecast Update
   └── What's likely to close this month?
   └── Adjust expected close dates
```

---

## Tips & Best Practices

### Data Hygiene

| Do | Don't |
|----|-------|
| Update deal stages promptly | Let deals sit in wrong stage |
| Log activities same day | Batch log at end of week |
| Capture contact roles | Leave role field blank |
| Record loss reasons | Just close lost without why |

### Working Hot Deals

A deal is "hot" when:
- Activity in last 7 days
- Clear next step defined
- Decision timeline is near

For hot deals:
- Review before every touchpoint
- Update notes immediately after calls
- Keep next step current

### Managing Long Sales Cycles

Hospice deals often take 6-12 months. Stay organized:

1. **Set realistic close dates** — don't just put "end of quarter"
2. **Create recurring check-in tasks** — even if just "touch base"
3. **Track contract renewal** — time your push accordingly
4. **Note all stakeholders** — people leave, new ones join
5. **Document objections** — they'll come up again

### Competitive Intelligence

When you learn about competitors in a deal:

1. Add them to the deal record
2. Note their strengths/weaknesses
3. If you lose, capture why they won
4. If you win, capture why you won

This data helps with future competitive deals.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `G` then `D` | Go to Dashboard |
| `G` then `F` | Go to Facilities |
| `G` then `C` | Go to Contacts |
| `G` then `P` | Go to Pipeline |
| `G` then `T` | Go to Tasks |
| `N` | New item (context-aware) |
| `S` | Search |
| `/` | Focus search bar |
| `?` | Show all shortcuts |

---

## Troubleshooting

### Common Issues

**Q: I can't find a facility I added**
- Check if you have any filters active
- Use the search bar
- Make sure you saved the record

**Q: My pipeline totals look wrong**
- Check that deal values are entered correctly
- Ensure deals are in the right stage
- Verify closed deals have correct close date

**Q: I'm not getting reminders**
- Check your notification settings
- Ensure your email is verified
- Look in spam folder

**Q: The app is slow**
- Try refreshing the page
- Clear browser cache
- Check your internet connection

### Getting Help

- **Documentation**: You're reading it!
- **Email Support**: support@hospicepro.com
- **Feature Requests**: Use the feedback button in-app

---

## Appendix: Field Reference

### Facility Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text | Yes | Organization name |
| Facility Type | Dropdown | Yes | Hospice, Home Health, Palliative, Hybrid |
| Ownership Type | Dropdown | No | For-Profit, Non-Profit, etc. |
| Census Size | Number | No | Average daily census |
| Annual Revenue | Currency | No | Estimate okay |
| Address | Text | No | Street address |
| City | Text | No | |
| State | Dropdown | No | US states |
| Medicare Provider # | Text | No | CMS certification |
| Current Software | Text | No | Incumbent vendor |
| Contract Renewal | Date | No | Critical for timing |
| Pain Points | Text | No | Known issues |
| Notes | Text | No | General notes |

### Contact Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text | Yes | Full name |
| Facility | Lookup | Yes | Link to facility |
| Title | Text | No | Job title |
| Buyer Role | Dropdown | No | Decision Maker, Champion, etc. |
| Email | Email | No | Primary email |
| Phone | Phone | No | Office line |
| Mobile | Phone | No | Cell phone |
| Preferred Contact | Dropdown | No | Email, Phone, Text |
| LinkedIn | URL | No | Profile link |
| Notes | Text | No | Personal details, rapport |

### Deal Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text | Yes | Usually "Facility - Product" |
| Facility | Lookup | Yes | Link to facility |
| Primary Contact | Lookup | No | Main POC |
| Stage | Dropdown | Yes | Pipeline stage |
| Value | Currency | No | Estimated contract value |
| Probability | Percentage | No | Auto from stage or manual |
| Expected Close | Date | No | When you expect to close |
| Next Step | Text | No | Immediate next action |
| Competitors | Multi-select | No | Who you're competing against |
| Notes | Text | No | Deal-specific notes |

---

## Document References

| Document | Location | Description |
|----------|----------|-------------|
| Wireframes | `wireframes.jsx` | Interactive React prototype |
| Functional Design | `FUNCTIONAL_DESIGN.md` | Detailed specifications |
| Tech Stack | `TECH_STACK.md` | Architecture decisions |
| README | `README.md` | Project overview |

---

**Last Updated**: December 2024  
**Version**: 1.0