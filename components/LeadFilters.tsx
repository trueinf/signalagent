'use client'

interface LeadFiltersProps {
  filters: {
    sourceType: string
    industry: string
    buyerRole: string
    age: string
  }
  onFilterChange: (key: string, value: string) => void
}

export default function LeadFilters({ filters, onFilterChange }: LeadFiltersProps) {
  const sourceOptions = [
    { value: 'ALL', label: 'All Sources' },
    { value: 'TRIAL', label: 'Trial' },
    { value: 'WEBINAR', label: 'Webinar' },
    { value: 'CAMPAIGN_DOWNLOAD', label: 'Campaign Download' },
    { value: 'SQL', label: 'SQL' },
    { value: 'CAMPAIGN_EMAIL', label: 'Campaign Email' },
  ]

  const industryOptions = [
    { value: 'ALL', label: 'All Industries' },
    { value: 'RETAIL', label: 'Retail' },
    { value: 'HEALTHCARE', label: 'Healthcare' },
    { value: 'FINANCE', label: 'Finance' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'LOGISTICS', label: 'Logistics' },
  ]

  const buyerRoleOptions = [
    { value: 'ALL', label: 'All Roles' },
    { value: 'IT_ADMIN', label: 'IT Admin' },
    { value: 'FINANCE_HEAD', label: 'Finance Head' },
    { value: 'PROCUREMENT', label: 'Procurement' },
    { value: 'CEO', label: 'CEO' },
  ]

  const ageOptions = [
    { value: 'ALL', label: 'All Ages' },
    { value: 'NEW', label: 'New (1d)' },
    { value: 'ACTIVE', label: 'Active (3–7d)' },
    { value: 'OLDER', label: 'Older (7d+)' },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.sourceType}
        onChange={(e) => onFilterChange('sourceType', e.target.value)}
        className="px-3 py-2 border border-[var(--border-subtle)] rounded text-base bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
      >
        {sourceOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={filters.industry}
        onChange={(e) => onFilterChange('industry', e.target.value)}
        className="px-3 py-2 border border-[var(--border-subtle)] rounded text-base bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
      >
        {industryOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={filters.buyerRole}
        onChange={(e) => onFilterChange('buyerRole', e.target.value)}
        className="px-3 py-2 border border-[var(--border-subtle)] rounded text-base bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
      >
        {buyerRoleOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={filters.age}
        onChange={(e) => onFilterChange('age', e.target.value)}
        className="px-3 py-2 border border-[var(--border-subtle)] rounded text-base bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
      >
        {ageOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
