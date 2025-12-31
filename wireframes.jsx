import React, { useState } from 'react';

// Mock data
const facilities = [
  { id: 1, name: 'Sunrise Hospice Care', type: 'Hospice', census: 85, city: 'Atlanta', state: 'GA', stage: 'Demo Completed', value: 45000, nextStep: 'Send proposal by Friday', lastContact: '2 days ago', renewal: '2025-03-15' },
  { id: 2, name: 'Comfort Home Health', type: 'Home Health', census: 120, city: 'Marietta', state: 'GA', stage: 'Discovery', value: 62000, nextStep: 'Schedule needs assessment', lastContact: '5 days ago', renewal: '2025-06-01' },
  { id: 3, name: 'Grace Palliative Services', type: 'Palliative', census: 45, city: 'Decatur', state: 'GA', stage: 'Proposal Sent', value: 28000, nextStep: 'Follow up on proposal', lastContact: '1 day ago', renewal: '2024-12-30' },
  { id: 4, name: 'Haven Hospice Group', type: 'Hospice', census: 200, city: 'Alpharetta', state: 'GA', stage: 'Negotiation', value: 95000, nextStep: 'Contract review call', lastContact: 'Today', renewal: '2025-01-15' },
  { id: 5, name: 'Peaceful Journey Care', type: 'Hybrid', census: 65, city: 'Roswell', state: 'GA', stage: 'Lead', value: 35000, nextStep: 'Initial outreach call', lastContact: '12 days ago', renewal: '2025-08-01' },
];

const contacts = [
  { id: 1, name: 'Sarah Mitchell', title: 'Executive Director', facility: 'Sunrise Hospice Care', role: 'Decision Maker', email: 's.mitchell@sunrise.com', phone: '(404) 555-0101', lastContact: '2 days ago' },
  { id: 2, name: 'James Chen', title: 'Director of Nursing', facility: 'Sunrise Hospice Care', role: 'Champion', email: 'j.chen@sunrise.com', phone: '(404) 555-0102', lastContact: '2 days ago' },
  { id: 3, name: 'Maria Rodriguez', title: 'CFO', facility: 'Haven Hospice Group', role: 'Decision Maker', email: 'm.rodriguez@haven.com', phone: '(770) 555-0201', lastContact: 'Today' },
  { id: 4, name: 'Robert Kim', title: 'IT Director', facility: 'Comfort Home Health', role: 'Influencer', email: 'r.kim@comfort.com', phone: '(770) 555-0301', lastContact: '5 days ago' },
];

const tasks = [
  { id: 1, type: 'Call', description: 'Follow up with Sarah on demo feedback', facility: 'Sunrise Hospice Care', due: 'Today', priority: 'High', status: 'open' },
  { id: 2, type: 'Email', description: 'Send proposal to Grace Palliative', facility: 'Grace Palliative Services', due: 'Today', priority: 'High', status: 'open' },
  { id: 3, type: 'Meeting', description: 'Contract review call with Maria', facility: 'Haven Hospice Group', due: 'Tomorrow', priority: 'High', status: 'open' },
  { id: 4, type: 'Call', description: 'Discovery call with Comfort Home Health', facility: 'Comfort Home Health', due: 'Dec 3', priority: 'Medium', status: 'open' },
  { id: 5, type: 'Follow-up', description: 'Check in on Peaceful Journey', facility: 'Peaceful Journey Care', due: 'Overdue', priority: 'Low', status: 'open' },
];

const activities = [
  { id: 1, type: 'Demo', description: 'Product demo - full platform walkthrough', facility: 'Haven Hospice Group', contact: 'Maria Rodriguez', date: 'Today, 10:00 AM', outcome: 'positive' },
  { id: 2, type: 'Call', description: 'Proposal questions follow-up', facility: 'Grace Palliative Services', contact: 'Director', date: 'Yesterday', outcome: 'neutral' },
  { id: 3, type: 'Email', description: 'Sent case study and ROI calculator', facility: 'Sunrise Hospice Care', contact: 'Sarah Mitchell', date: '2 days ago', outcome: 'positive' },
  { id: 4, type: 'Meeting', description: 'On-site visit and stakeholder meeting', facility: 'Haven Hospice Group', contact: 'Multiple', date: '3 days ago', outcome: 'positive' },
];

const pipelineStages = [
  { name: 'Lead', count: 8, value: 180000, color: '#94a3b8' },
  { name: 'Discovery', count: 5, value: 145000, color: '#60a5fa' },
  { name: 'Demo Scheduled', count: 3, value: 95000, color: '#34d399' },
  { name: 'Demo Completed', count: 4, value: 165000, color: '#a78bfa' },
  { name: 'Proposal', count: 2, value: 73000, color: '#fbbf24' },
  { name: 'Negotiation', count: 2, value: 155000, color: '#f97316' },
  { name: 'Verbal Commit', count: 1, value: 48000, color: '#22c55e' },
];

// Icons
const Icons = {
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Facility: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>,
  Contact: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>,
  Deal: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Task: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  Phone: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Email: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 5v14M5 12h14"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>,
  Activity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

// Utility function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
};

// Stage badge component
const StageBadge = ({ stage }) => {
  const colors = {
    'Lead': 'bg-slate-100 text-slate-700',
    'Discovery': 'bg-blue-100 text-blue-700',
    'Demo Scheduled': 'bg-emerald-100 text-emerald-700',
    'Demo Completed': 'bg-violet-100 text-violet-700',
    'Proposal Sent': 'bg-amber-100 text-amber-700',
    'Negotiation': 'bg-orange-100 text-orange-700',
    'Verbal Commit': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[stage] || 'bg-gray-100 text-gray-700'}`}>
      {stage}
    </span>
  );
};

// Role badge component
const RoleBadge = ({ role }) => {
  const colors = {
    'Decision Maker': 'bg-rose-100 text-rose-700 border-rose-200',
    'Champion': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Influencer': 'bg-sky-100 text-sky-700 border-sky-200',
    'Blocker': 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {role}
    </span>
  );
};

// Priority indicator
const PriorityDot = ({ priority }) => {
  const colors = { High: 'bg-red-500', Medium: 'bg-amber-500', Low: 'bg-slate-400' };
  return <span className={`w-2 h-2 rounded-full ${colors[priority]}`}></span>;
};

// Dashboard View
const DashboardView = () => {
  const totalPipeline = pipelineStages.reduce((acc, s) => acc + s.value, 0);
  const totalDeals = pipelineStages.reduce((acc, s) => acc + s.count, 0);
  
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Pipeline Value</p>
          <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalPipeline)}</p>
          <p className="text-xs text-emerald-600 mt-1">↑ 12% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Active Deals</p>
          <p className="text-2xl font-semibold text-slate-900">{totalDeals}</p>
          <p className="text-xs text-slate-500 mt-1">Across all stages</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">This Month</p>
          <p className="text-2xl font-semibold text-emerald-600">{formatCurrency(48000)}</p>
          <p className="text-xs text-slate-500 mt-1">1 deal closed</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Win Rate</p>
          <p className="text-2xl font-semibold text-slate-900">34%</p>
          <p className="text-xs text-slate-500 mt-1">Last 90 days</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pipeline Funnel */}
        <div className="col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Pipeline Overview</h3>
          <div className="space-y-3">
            {pipelineStages.map((stage) => (
              <div key={stage.name} className="flex items-center gap-3">
                <div className="w-28 text-sm text-slate-600">{stage.name}</div>
                <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                  <div 
                    className="h-full rounded-lg flex items-center px-3 transition-all duration-500"
                    style={{ 
                      width: `${Math.max((stage.value / totalPipeline) * 100, 15)}%`,
                      backgroundColor: stage.color 
                    }}
                  >
                    <span className="text-xs font-medium text-white drop-shadow-sm">
                      {stage.count} deals
                    </span>
                  </div>
                </div>
                <div className="w-24 text-right text-sm font-medium text-slate-700">
                  {formatCurrency(stage.value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Today's Tasks</h3>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {tasks.filter(t => t.due === 'Today' || t.due === 'Overdue').length} due
            </span>
          </div>
          <div className="space-y-3">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <input type="checkbox" className="mt-1 rounded border-slate-300" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <PriorityDot priority={task.priority} />
                    <span className="text-xs text-slate-500">{task.type}</span>
                    <span className={`text-xs ${task.due === 'Overdue' ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                      {task.due}
                    </span>
                  </div>
                  <p className="text-sm text-slate-900 truncate">{task.description}</p>
                  <p className="text-xs text-slate-500 truncate">{task.facility}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-medium
                ${activity.outcome === 'positive' ? 'bg-emerald-500' : activity.outcome === 'negative' ? 'bg-red-500' : 'bg-slate-400'}`}>
                {activity.type.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">{activity.description}</p>
                <p className="text-xs text-slate-500">{activity.facility} • {activity.contact}</p>
              </div>
              <span className="text-xs text-slate-500">{activity.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Facilities View
const FacilitiesView = () => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  
  return (
    <div className="flex gap-6">
      <div className={`${selectedFacility ? 'w-7/12' : 'w-full'} transition-all duration-300`}>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Icons.Search />
                <input 
                  type="text" 
                  placeholder="Search facilities..." 
                  className="pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>All Types</option>
                <option>Hospice</option>
                <option>Home Health</option>
                <option>Palliative</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
              <Icons.Plus /> Add Facility
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Facility</th>
                <th className="px-4 py-3">Census</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Next Step</th>
                <th className="px-4 py-3">Last Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facilities.map((facility) => (
                <tr 
                  key={facility.id} 
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedFacility?.id === facility.id ? 'bg-teal-50' : ''}`}
                  onClick={() => setSelectedFacility(facility)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{facility.name}</p>
                      <p className="text-xs text-slate-500">{facility.type} • {facility.city}, {facility.state}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{facility.census}</td>
                  <td className="px-4 py-3"><StageBadge stage={facility.stage} /></td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{formatCurrency(facility.value)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-48 truncate">{facility.nextStep}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{facility.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Detail Panel */}
      {selectedFacility && (
        <div className="w-5/12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-teal-600 to-teal-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg">{selectedFacility.name}</h3>
                <p className="text-teal-100 text-sm">{selectedFacility.type} • {selectedFacility.city}, {selectedFacility.state}</p>
              </div>
              <button 
                onClick={() => setSelectedFacility(null)}
                className="text-teal-100 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Census Size</p>
                <p className="text-lg font-semibold text-slate-900">{selectedFacility.census}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Deal Value</p>
                <p className="text-lg font-semibold text-teal-600">{formatCurrency(selectedFacility.value)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 mb-1">Current Stage</p>
              <StageBadge stage={selectedFacility.stage} />
            </div>
            
            <div>
              <p className="text-xs text-slate-500 mb-1">Contract Renewal</p>
              <div className="flex items-center gap-2">
                <Icons.Calendar />
                <span className="text-sm text-slate-700">{selectedFacility.renewal}</span>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 mb-1">Next Step</p>
              <p className="text-sm text-slate-900 bg-amber-50 border border-amber-200 rounded-lg p-3">{selectedFacility.nextStep}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-3">Quick Actions</p>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm hover:bg-slate-200 transition-colors">
                  <Icons.Phone /> Call
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm hover:bg-slate-200 transition-colors">
                  <Icons.Email /> Email
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-teal-700 transition-colors">
                  <Icons.Task /> Log Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Contacts View
const ContactsView = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-4 border-b border-slate-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <input 
          type="text" 
          placeholder="Search contacts..." 
          className="px-4 py-2 text-sm border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2">
          <option>All Roles</option>
          <option>Decision Makers</option>
          <option>Champions</option>
          <option>Influencers</option>
        </select>
      </div>
      <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
        <Icons.Plus /> Add Contact
      </button>
    </div>
    <div className="divide-y divide-slate-100">
      {contacts.map((contact) => (
        <div key={contact.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-slate-900">{contact.name}</h4>
                  <RoleBadge role={contact.role} />
                </div>
                <p className="text-sm text-slate-600">{contact.title}</p>
                <p className="text-sm text-slate-500">{contact.facility}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500">Last contact</p>
                <p className="text-sm text-slate-700">{contact.lastContact}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                  <Icons.Phone />
                </button>
                <button className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                  <Icons.Email />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Deals/Pipeline View
const DealsView = () => (
  <div className="space-y-6">
    {/* Kanban-style pipeline */}
    <div className="flex gap-4 overflow-x-auto pb-4">
      {['Lead', 'Discovery', 'Demo Scheduled', 'Demo Completed', 'Proposal Sent', 'Negotiation'].map((stage) => {
        const stageDeals = facilities.filter(f => f.stage === stage);
        const stageTotal = stageDeals.reduce((acc, d) => acc + d.value, 0);
        
        return (
          <div key={stage} className="min-w-72 bg-slate-100 rounded-xl p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-700 text-sm">{stage}</h4>
              <span className="text-xs text-slate-500">{formatCurrency(stageTotal)}</span>
            </div>
            <div className="space-y-2">
              {stageDeals.length > 0 ? stageDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-lg p-3 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                  <h5 className="font-medium text-slate-900 text-sm mb-1">{deal.name}</h5>
                  <p className="text-xs text-slate-500 mb-2">{deal.city}, {deal.state}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-teal-600">{formatCurrency(deal.value)}</span>
                    <span className="text-xs text-slate-500">{deal.lastContact}</span>
                  </div>
                </div>
              )) : (
                <div className="bg-white/50 rounded-lg p-4 border-2 border-dashed border-slate-300 text-center">
                  <p className="text-xs text-slate-400">No deals</p>
                </div>
              )}
              <button className="w-full py-2 text-xs text-slate-500 hover:text-teal-600 hover:bg-white rounded-lg transition-colors">
                + Add Deal
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Tasks View
const TasksView = () => (
  <div className="grid grid-cols-3 gap-6">
    <div className="col-span-2 space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">All Tasks</h3>
          <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
            <Icons.Plus /> Add Task
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 rounded border-slate-300" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <PriorityDot priority={task.priority} />
                    <span className="text-xs font-medium text-slate-500 uppercase">{task.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${task.due === 'Overdue' ? 'bg-red-100 text-red-700' : task.due === 'Today' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {task.due}
                    </span>
                  </div>
                  <p className="text-sm text-slate-900">{task.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{task.facility}</p>
                </div>
                <button className="text-slate-400 hover:text-teal-600">
                  <Icons.ChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    {/* Quick Add */}
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <h3 className="font-semibold text-slate-900 mb-4">Quick Add Task</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Task Type</label>
          <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2">
            <option>Call</option>
            <option>Email</option>
            <option>Meeting</option>
            <option>Follow-up</option>
            <option>Demo</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Description</label>
          <input type="text" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" placeholder="What needs to be done?" />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Facility</label>
          <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2">
            <option>Select facility...</option>
            {facilities.map(f => <option key={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Due Date</label>
            <input type="date" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Priority</label>
            <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
        <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
          Create Task
        </button>
      </div>
    </div>
  </div>
);

// Main App Component
export default function HospiceCRM() {
  const [activeView, setActiveView] = useState('dashboard');
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'facilities', label: 'Facilities', icon: Icons.Facility },
    { id: 'contacts', label: 'Contacts', icon: Icons.Contact },
    { id: 'deals', label: 'Pipeline', icon: Icons.Deal },
    { id: 'tasks', label: 'Tasks', icon: Icons.Task },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-semibold text-slate-900 text-lg">HospicePro</span>
              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">CRM</span>
            </div>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === item.id 
                      ? 'bg-teal-50 text-teal-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
              <Icons.Search />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white text-xs font-medium">
              BW
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-6">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'facilities' && <FacilitiesView />}
        {activeView === 'contacts' && <ContactsView />}
        {activeView === 'deals' && <DealsView />}
        {activeView === 'tasks' && <TasksView />}
      </main>
    </div>
  );
}
