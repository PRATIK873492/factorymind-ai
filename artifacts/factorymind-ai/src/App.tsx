import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Boxes,
  BrainCircuit,
  ChevronDown,
  ClipboardCheck,
  Factory,
  Gauge,
  LayoutDashboard,
  Menu,
  PackageSearch,
  Settings,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Redirect, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';

const queryClient = new QueryClient();

type NavItem = { href: string; label: string; icon: LucideIcon; badge?: string };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: 'Command',
    items: [
      { href: '/overview', label: 'Overview', icon: LayoutDashboard },
      { href: '/ai-findings', label: 'AI findings', icon: BrainCircuit, badge: '04' },
      { href: '/recommendations', label: 'Recommendations', icon: Sparkles, badge: '03' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/machines', label: 'Machines', icon: Gauge },
      { href: '/operations', label: 'Operations', icon: Activity },
      { href: '/maintenance', label: 'Maintenance', icon: Wrench },
      { href: '/inventory', label: 'Inventory', icon: Boxes },
    ],
  },
  {
    label: 'Assurance',
    items: [
      { href: '/quality', label: 'Quality', icon: ClipboardCheck },
      { href: '/safety', label: 'Safety', icon: ShieldCheck },
      { href: '/energy', label: 'Energy', icon: Zap },
    ],
  },
];

const machineRows = [
  { id: 'press-line-04', name: 'Press Line 04', area: 'Forming / Bay C', state: 'Nominal', value: '82.4%', tone: 'good', detail: 'Cycle time within control limits' },
  { id: 'cnc-cell-02', name: 'CNC Cell 02', area: 'Machining / Bay A', state: 'Watch', value: '74.8%', tone: 'watch', detail: 'Spindle vibration trending upward' },
  { id: 'robot-arm-07', name: 'Robot Arm 07', area: 'Assembly / Bay B', state: 'Nominal', value: '91.1%', tone: 'good', detail: 'Operating at scheduled takt' },
];

function StatusDot({ tone = 'good' }: { tone?: 'good' | 'watch' | 'danger' }) {
  return <span className={`status-dot status-dot-${tone}`} aria-hidden="true" />;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pageTitle = location === '/overview' || location === '/' ? 'Plant overview' : location.split('/')[1]?.replaceAll('-', ' ') ?? 'Control room';

  const sidebar = (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-topline signal-stripe" />
      <div className="brand-lockup">
        <Link href="/overview" className="brand-link" data-testid="link-brand-overview" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark" aria-hidden="true"><Factory size={19} strokeWidth={2.3} /></span>
          <span>
            <span className="brand-name">FactoryMind</span>
            <span className="brand-caption">OPERATIONS INTELLIGENCE</span>
          </span>
        </Link>
        <button className="mobile-close" type="button" aria-label="Close navigation" data-testid="button-close-navigation" onClick={() => setMobileOpen(false)}>
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-nav">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <p className="nav-group-label">{group.label}</p>
            <div className="nav-items">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = location === item.href || (item.href !== '/overview' && location.startsWith(`${item.href}/`));
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={`nav-item ${active ? 'nav-item-active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                    <span>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <Link href="/agents" className={`utility-link ${location === '/agents' ? 'utility-link-active' : ''}`} data-testid="link-nav-agents" onClick={() => setMobileOpen(false)}>
          <Bot size={17} strokeWidth={1.8} />
          <span>AI agents</span>
          <span className="agent-live"><StatusDot /> live</span>
        </Link>
        <Link href="/settings" className={`utility-link ${location === '/settings' ? 'utility-link-active' : ''}`} data-testid="link-nav-settings" onClick={() => setMobileOpen(false)}>
          <Settings size={17} strokeWidth={1.8} />
          <span>Settings</span>
        </Link>
        <div className="sidebar-footnote">
          <span className="font-mono-ui">FM / STAGE 01</span>
          <span>Build 1.0.0</span>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="app-frame industrial-grid">
      <div className={`mobile-scrim ${mobileOpen ? 'mobile-scrim-visible' : ''}`} onClick={() => setMobileOpen(false)} aria-hidden="true" />
      <div className={`sidebar-wrap ${mobileOpen ? 'sidebar-wrap-open' : ''}`}>{sidebar}</div>
      <div className="app-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" type="button" aria-label="Open navigation" data-testid="button-open-navigation" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="breadcrumb">
              <span className="breadcrumb-root">FACTORYMIND</span>
              <span className="breadcrumb-slash">/</span>
              <span className="breadcrumb-current">{pageTitle}</span>
            </div>
          </div>
          <div className="header-actions">
            <label className="plant-select-wrap">
              <span className="sr-only">Select plant</span>
              <Factory size={15} aria-hidden="true" />
              <select defaultValue="northstar" data-testid="select-plant">
                <option value="northstar">Northstar Components</option>
                <option value="riverbend">Riverbend Assembly</option>
                <option value="atlas">Atlas Precision Works</option>
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>
            <div className="header-divider" />
            <div className="popover-anchor">
              <button className={`system-status ${statusOpen ? 'control-active' : ''}`} type="button" aria-expanded={statusOpen} data-testid="button-system-status" onClick={() => { setStatusOpen(!statusOpen); setNotificationsOpen(false); setProfileOpen(false); }}>
                <StatusDot />
                <span className="system-status-text">Systems nominal</span>
                <ChevronDown size={14} />
              </button>
              {statusOpen && <div className="popover status-popover" role="status" data-testid="panel-system-status">
                <div className="popover-heading"><span>System health</span><span className="status-chip status-chip-good">99.96% uptime</span></div>
                <div className="health-line"><span><StatusDot /> Data pipeline</span><span className="font-mono-ui">LIVE</span></div>
                <div className="health-line"><span><StatusDot /> Machine telemetry</span><span className="font-mono-ui">LIVE</span></div>
                <div className="health-line"><span><StatusDot /> AI inference</span><span className="font-mono-ui">LIVE</span></div>
              </div>}
            </div>
            <div className="popover-anchor">
              <button className={`icon-button notification-button ${notificationsOpen ? 'control-active' : ''}`} type="button" aria-label="Open notifications" aria-expanded={notificationsOpen} data-testid="button-notifications" onClick={() => { setNotificationsOpen(!notificationsOpen); setStatusOpen(false); setProfileOpen(false); }}>
                <AlertTriangle size={18} />
                <span className="notification-count">3</span>
              </button>
              {notificationsOpen && <div className="popover notification-popover" data-testid="panel-notifications">
                <div className="popover-heading"><span>Attention queue</span><span className="font-mono-ui muted-label">03 OPEN</span></div>
                <Link href="/ai-findings" className="notification-row" data-testid="link-notification-findings"><StatusDot tone="watch" /><span><strong>Spindle vibration anomaly</strong><small>CNC Cell 02 · 11 min ago</small></span><ArrowUpRight size={14} /></Link>
                <Link href="/maintenance" className="notification-row" data-testid="link-notification-maintenance"><StatusDot tone="danger" /><span><strong>Service window due</strong><small>Press Line 04 · 42 min ago</small></span><ArrowUpRight size={14} /></Link>
                <Link href="/safety" className="notification-row" data-testid="link-notification-safety"><StatusDot tone="watch" /><span><strong>Permit review required</strong><small>Bay C · 1 hr ago</small></span><ArrowUpRight size={14} /></Link>
              </div>}
            </div>
            <div className="popover-anchor">
              <button className={`profile-control ${profileOpen ? 'control-active' : ''}`} type="button" aria-label="Open user menu" aria-expanded={profileOpen} data-testid="button-profile-menu" onClick={() => { setProfileOpen(!profileOpen); setStatusOpen(false); setNotificationsOpen(false); }}>
                <span className="avatar">JM</span>
                <span className="profile-name">J. Morales</span>
                <ChevronDown size={14} />
              </button>
              {profileOpen && <div className="popover profile-popover" data-testid="panel-profile-menu">
                <div className="profile-summary"><span className="avatar avatar-large">JM</span><span><strong>Jordan Morales</strong><small>Plant supervisor</small></span></div>
                <Link href="/settings" className="profile-link" data-testid="link-profile-settings">Account settings <ArrowRight size={14} /></Link>
              </div>}
            </div>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="section-label"><span className="section-label-line" />{children}</div>;
}

function Overview() {
  return (
    <div className="page-enter">
      <section className="overview-head">
        <div>
          <SectionLabel>SHIFT CONTROL · TUESDAY 14 MAY 2024</SectionLabel>
          <h1 className="page-title">Northstar Components<span className="title-period">.</span></h1>
          <p className="page-lede">A clear read on what is running, what is drifting, and where the next decision belongs.</p>
        </div>
        <div className="head-actions">
          <Link href="/operations" className="button button-dark" data-testid="link-open-operations">Open operations <ArrowUpRight size={15} /></Link>
          <button type="button" className="button button-quiet" data-testid="button-refresh-overview" onClick={() => undefined}><Activity size={15} /> Live view</button>
        </div>
      </section>

      <section className="signal-banner fade-up" aria-label="Operational status">
        <div className="signal-banner-icon"><Activity size={20} /></div>
        <div className="signal-banner-copy"><strong>Plant is operating within control.</strong><span>3 items need a decision before the next production handoff at 16:00.</span></div>
        <Link href="/recommendations" className="signal-banner-link" data-testid="link-review-recommendations">Review queue <ArrowRight size={15} /></Link>
      </section>

      <section className="metric-grid fade-up-delay" aria-label="Plant performance summary">
        <article className="metric-card metric-card-primary" data-testid="card-metric-oee">
          <div className="metric-top"><span>Overall equipment effectiveness</span><span className="metric-code">OEE / 01</span></div>
          <div className="metric-value">84<span className="metric-unit">.6%</span></div>
          <div className="metric-bottom"><span className="delta-positive">+2.1% vs last shift</span><span className="metric-spark"><i /><i /><i /><i /><i /><i /><i /></span></div>
        </article>
        <article className="metric-card" data-testid="card-metric-output">
          <div className="metric-top"><span>Production output</span><span className="metric-code">OUT / 02</span></div>
          <div className="metric-value">12,480<span className="metric-unit"> units</span></div>
          <div className="metric-bottom"><span className="metric-muted">Target 14,200 · 87.9%</span><span className="metric-bar"><i style={{ width: '88%' }} /></span></div>
        </article>
        <article className="metric-card" data-testid="card-metric-availability">
          <div className="metric-top"><span>Asset availability</span><span className="metric-code">AVL / 03</span></div>
          <div className="metric-value">91<span className="metric-unit">.2%</span></div>
          <div className="metric-bottom"><span className="delta-positive">+0.8% vs last shift</span><span className="metric-bar bar-green"><i style={{ width: '91%' }} /></span></div>
        </article>
        <article className="metric-card" data-testid="card-metric-alerts">
          <div className="metric-top"><span>Open attention items</span><span className="metric-code">ATT / 04</span></div>
          <div className="metric-value metric-value-alert">03</div>
          <div className="metric-bottom"><span className="metric-muted">1 high priority · 2 watch</span><Link href="/ai-findings" className="metric-link" data-testid="link-metric-findings">View findings <ArrowRight size={13} /></Link></div>
        </article>
      </section>

      <div className="overview-columns">
        <section className="panel machine-panel" aria-labelledby="machine-heading">
          <div className="panel-heading"><div><SectionLabel>LIVE ASSETS</SectionLabel><h2 id="machine-heading">Machine pulse</h2></div><Link href="/machines" className="text-link" data-testid="link-view-machines">All machines <ArrowUpRight size={14} /></Link></div>
          <div className="machine-list">
            {machineRows.map((machine) => (
              <Link href={`/machines/${machine.id}`} className="machine-row" key={machine.id} data-testid={`link-machine-${machine.id}`}>
                <span className="machine-state"><StatusDot tone={machine.tone as 'good' | 'watch'} /></span>
                <span className="machine-info"><strong>{machine.name}</strong><small>{machine.area}</small></span>
                <span className="machine-health"><span className={`machine-state-label machine-state-${machine.tone}`}>{machine.state}</span><small>{machine.detail}</small></span>
                <span className="machine-value">{machine.value}<ArrowUpRight size={14} /></span>
              </Link>
            ))}
          </div>
          <div className="panel-footer-note"><span className="live-pulse" /> Telemetry updated 12 seconds ago <span className="font-mono-ui">24 / 24 SIGNALS</span></div>
        </section>

        <section className="panel recommendation-panel" aria-labelledby="recommendation-heading">
          <div className="panel-heading"><div><SectionLabel>DECISION QUEUE</SectionLabel><h2 id="recommendation-heading">Next best actions</h2></div><Link href="/recommendations" className="text-link" data-testid="link-view-recommendations">View queue <ArrowUpRight size={14} /></Link></div>
          <div className="recommendation-list">
            <Link href="/recommendations/rec-2048" className="recommendation-item recommendation-item-priority" data-testid="link-recommendation-rec-2048">
              <span className="recommendation-index">01</span>
              <span className="recommendation-copy"><strong>Inspect CNC Cell 02 spindle bearings</strong><small>Predicted deviation in 18–26 hours · confidence 87%</small><span className="recommendation-tag tag-amber">Priority review</span></span>
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/recommendations/rec-2043" className="recommendation-item" data-testid="link-recommendation-rec-2043">
              <span className="recommendation-index">02</span>
              <span className="recommendation-copy"><strong>Rebalance Press Line 04 schedule</strong><small>Potential 6.4% throughput gain on next run</small><span className="recommendation-tag tag-green">Production</span></span>
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/recommendations/rec-2039" className="recommendation-item" data-testid="link-recommendation-rec-2039">
              <span className="recommendation-index">03</span>
              <span className="recommendation-copy"><strong>Stage seal kit for Bay C changeover</strong><small>Inventory is available · estimated 14 min saved</small><span className="recommendation-tag tag-slate">Maintenance</span></span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="queue-progress"><span>QUEUE HEALTH</span><div className="queue-track"><i /></div><strong>3 / 7 resolved</strong></div>
        </section>
      </div>

      <section className="lower-grid">
        <section className="panel context-panel" aria-labelledby="context-heading">
          <div className="panel-heading"><div><SectionLabel>OPERATING CONTEXT</SectionLabel><h2 id="context-heading">Shift trajectory</h2></div><span className="context-date font-mono-ui">06:00 — 14:00</span></div>
          <div className="trajectory-chart" aria-label="Shift trajectory chart">
            <div className="chart-y-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
            <div className="chart-area"><div className="chart-grid-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 620 168" preserveAspectRatio="none" role="img" aria-label="OEE rose from 71 to 85 percent through the shift"><path className="chart-fill" d="M0 119 C45 114 62 105 100 109 S150 90 190 96 S235 78 278 84 S320 72 358 77 S412 65 450 71 S500 53 550 63 S595 44 620 39 L620 168 L0 168 Z" /><path className="chart-line" d="M0 119 C45 114 62 105 100 109 S150 90 190 96 S235 78 278 84 S320 72 358 77 S412 65 450 71 S500 53 550 63 S595 44 620 39" /></svg><div className="chart-x-axis"><span>06:00</span><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span></div></div>
          </div>
          <div className="chart-legend"><span><i className="legend-line" />OEE actual</span><span><i className="legend-dash" />Target 82%</span><strong>Current 84.6%</strong></div>
        </section>
        <section className="panel shift-panel" aria-labelledby="shift-heading">
          <div className="panel-heading"><div><SectionLabel>HANDOFF NOTES</SectionLabel><h2 id="shift-heading">Shift brief</h2></div><Link href="/operations" className="icon-link" aria-label="Open operations" data-testid="link-shift-operations"><ArrowUpRight size={16} /></Link></div>
          <div className="shift-note"><span className="note-marker">A</span><div><strong>Production is ahead of plan</strong><p>Press Line 04 recovered 22 minutes after the first material changeover.</p></div></div>
          <div className="shift-note"><span className="note-marker note-marker-amber">B</span><div><strong>One decision is time-sensitive</strong><p>CNC Cell 02 vibration is the only signal crossing its early-warning band.</p></div></div>
          <div className="shift-owner"><span className="avatar avatar-small">JM</span><span><small>Prepared for handoff by</small><strong>Jordan Morales · Plant supervisor</strong></span><span className="font-mono-ui">14:00</span></div>
        </section>
      </section>
    </div>
  );
}

function PageIntro({ label, title, description, icon: Icon, links = [] }: { label: string; title: string; description: string; icon: LucideIcon; links?: { href: string; label: string }[] }) {
  return (
    <div className="placeholder-page page-enter">
      <div className="placeholder-hero">
        <div className="placeholder-icon"><Icon size={23} /></div>
        <SectionLabel>FACTORYMIND / STAGE 01</SectionLabel>
        <h1 className="page-title">{title}<span className="title-period">.</span></h1>
        <p className="page-lede">{description}</p>
      </div>
      <div className="placeholder-body">
        <div className="placeholder-status"><span className="status-chip status-chip-good"><StatusDot /> Shell connected</span><span className="font-mono-ui">MODULE READY / 01</span></div>
        <div className="placeholder-message"><div className="placeholder-rule" /><div><h2>{label} is queued for Stage 2</h2><p>The navigation, context links, and plant-level signals are in place. This surface will become the working view for the {label.toLowerCase()} team in the next build.</p></div></div>
        {links.length > 0 && <div className="context-links"><span className="context-links-label">Continue from here</span>{links.map((link) => <Link href={link.href} className="context-link" key={link.href} data-testid={`link-context-${link.href.replaceAll('/', '-').replace(/^-/, '')}`}>{link.label}<ArrowRight size={14} /></Link>)}</div>}
      </div>
    </div>
  );
}

function Machines() {
  return <PageIntro label="Machine intelligence" title="Machines" description="A live register of the assets that make Northstar Components move." icon={Gauge} links={[{ href: '/machines/press-line-04', label: 'Open Press Line 04' }, { href: '/operations', label: 'Review operations' }]} />;
}

function MachineDetail() {
  const { machineId } = useParams<{ machineId: string }>();
  const machine = machineRows.find((row) => row.id === machineId);
  return <PageIntro label="Machine detail" title={machine?.name ?? 'Machine detail'} description={machine ? `${machine.area} · ${machine.detail}.` : 'Asset identity and telemetry context will appear here.'} icon={Gauge} links={[{ href: '/machines', label: 'Back to machines' }, { href: '/maintenance', label: 'Open maintenance' }]} />;
}

function Recommendations() {
  return <PageIntro label="Decision support" title="Recommendations" description="Ranked actions with expected impact, confidence, and accountable owners." icon={Sparkles} links={[{ href: '/recommendations/rec-2048', label: 'Open priority recommendation' }, { href: '/ai-findings', label: 'See AI findings' }]} />;
}

function RecommendationDetail() {
  const { recommendationId } = useParams<{ recommendationId: string }>();
  return <PageIntro label="Recommendation detail" title={`Recommendation ${recommendationId?.toUpperCase() ?? ''}`} description="Evidence, expected impact, and decision history will be assembled here." icon={Sparkles} links={[{ href: '/recommendations', label: 'Back to recommendations' }, { href: '/machines/cnc-cell-02', label: 'Inspect source machine' }]} />;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/overview" />} />
      <Route path="/overview" component={Overview} />
      <Route path="/machines/:machineId" component={MachineDetail} />
      <Route path="/machines" component={Machines} />
      <Route path="/operations" component={() => <PageIntro label="Operations control" title="Operations" description="Production flow, takt, constraints, and the decisions shaping the current shift." icon={Activity} links={[{ href: '/machines', label: 'Inspect machine pulse' }, { href: '/quality', label: 'Review quality' }]} />} />
      <Route path="/maintenance" component={() => <PageIntro label="Asset care" title="Maintenance" description="Planned work, condition signals, and the interventions that protect uptime." icon={Wrench} links={[{ href: '/machines/cnc-cell-02', label: 'Inspect CNC Cell 02' }, { href: '/inventory', label: 'Check parts inventory' }]} />} />
      <Route path="/inventory" component={() => <PageIntro label="Material readiness" title="Inventory" description="Parts, consumables, and the material constraints behind the next production decisions." icon={PackageSearch} links={[{ href: '/maintenance', label: 'View maintenance needs' }, { href: '/operations', label: 'Review operations' }]} />} />
      <Route path="/quality" component={() => <PageIntro label="Process assurance" title="Quality" description="Yield, defects, and the evidence needed to keep production within specification." icon={ClipboardCheck} links={[{ href: '/operations', label: 'Open operations' }, { href: '/ai-findings', label: 'Review findings' }]} />} />
      <Route path="/safety" component={() => <PageIntro label="People and process" title="Safety" description="Open permits, near-miss signals, and the controls keeping each bay ready for work." icon={ShieldCheck} links={[{ href: '/operations', label: 'View operating context' }, { href: '/settings', label: 'Review controls' }]} />} />
      <Route path="/energy" component={() => <PageIntro label="Resource performance" title="Energy" description="Consumption patterns and operating context for a more disciplined plant." icon={Zap} links={[{ href: '/operations', label: 'Compare shift context' }, { href: '/machines', label: 'Inspect assets' }]} />} />
      <Route path="/ai-findings" component={() => <PageIntro label="Signal interpretation" title="AI findings" description="An evidence-led queue of machine and process signals that deserve human attention." icon={BrainCircuit} links={[{ href: '/recommendations', label: 'Open recommendations' }, { href: '/machines/cnc-cell-02', label: 'Inspect CNC Cell 02' }]} />} />
      <Route path="/recommendations/:recommendationId" component={RecommendationDetail} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/agents" component={() => <PageIntro label="Automation layer" title="AI agents" description="The operating agents observing, reasoning, and preparing decisions across the plant." icon={Bot} links={[{ href: '/ai-findings', label: 'Review findings' }, { href: '/settings', label: 'Configure workspace' }]} />} />
      <Route path="/settings" component={() => <PageIntro label="Workspace controls" title="Settings" description="Plant context, access, integrations, and the guardrails behind FactoryMind." icon={Settings} links={[{ href: '/overview', label: 'Return to overview' }, { href: '/agents', label: 'Review AI agents' }]} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <Shell><AppRoutes /></Shell>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;