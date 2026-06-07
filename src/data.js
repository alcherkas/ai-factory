// AI Factory — a concept map of patterns for building software with agent fleets
// (synthesized from a June-2026 research brief on "AI Factories for the SDLC").
//
// This is the ONLY file you need to edit to change what the graph shows.
// Each node: { id, label, category, description, stat?, sources?, notes?, connectsTo[] }
//   - category: one of CATEGORIES below (drives spatial clustering + the panel chip)
//   - stat:     short headline metric (optional)
//   - sources:  short citations (optional)
//   - notes:    quotable lines (optional)
// Links between nodes are derived from `connectsTo` automatically (see bottom).
// Node size scales with how connected a concept is.

// Ordered theme list — single source of truth for clustering and the panel chip.
export const CATEGORIES = [
  { id: 'production-line', label: 'Production Line' },
  { id: 'patterns', label: 'Orchestration Patterns' },
  { id: 'methods', label: 'Methodologies' },
  { id: 'parallelism', label: 'Parallelism' },
  { id: 'context-memory', label: 'Context & Memory' },
  { id: 'verification', label: 'Verification & Quality' },
  { id: 'governance', label: 'Governance & Security' },
  { id: 'cost-tokens', label: 'Cost & Tokens' },
  { id: 'tools', label: 'Tooling' },
  { id: 'roles-org', label: 'Roles & Org' },
  { id: 'metrics', label: 'Metrics & Risk' },
]

export const nodes = [
  // ── Production Line ─────────────────────────────────────────────
  {
    id: 'ai-factory',
    label: 'AI Factory',
    category: 'production-line',
    description:
      "The operating model: running fleets of coding agents along a repeatable production line, where the human's job becomes specification, orchestration, and review — not typing.",
    connectsTo: ['production-line', 'orchestrator', 'spec-driven', 'verification-bottleneck', 'fleet-management'],
  },
  {
    id: 'production-line',
    label: 'Production Line',
    category: 'production-line',
    description: 'The six-step line — Plan, Spawn, Monitor, Verify, Integrate, Retro — that maps factory discipline onto agentic development.',
    sources: ['Osmani, “The Code Agent Orchestra”'],
    connectsTo: ['ai-factory', 'plan-mode', 'wip-limits', 'retro', 'kill-criteria'],
  },
  {
    id: 'orchestrator',
    label: 'Orchestrator vs Conductor',
    category: 'production-line',
    description: 'The mindset shift from conductor (one agent, synchronous) to orchestrator (many agents, asynchronous).',
    connectsTo: ['orchestrator-worker', 'wip-limits', 'ai-factory'],
  },
  {
    id: 'kill-criteria',
    label: 'Kill Criteria',
    category: 'production-line',
    description: 'If an agent is stuck 3+ iterations on the same error, stop it and reassign to a fresh agent.',
    connectsTo: ['ralph-loop', 'out-of-context-verification', 'production-line'],
  },
  {
    id: 'retro',
    label: 'Retro / Compound Learning',
    category: 'production-line',
    description: 'Per-task retros that append learnings to a memory file so improvement compounds over time.',
    connectsTo: ['agents-md', 'middle-loop', 'production-line'],
  },

  // ── Orchestration Patterns ──────────────────────────────────────
  {
    id: 'orchestrator-worker',
    label: 'Orchestrator–Worker',
    category: 'patterns',
    description: 'A lead agent decomposes work and delegates to specialist sub-agents working in parallel on a shared filesystem.',
    stat: '+90.2% vs single-agent · ~15× tokens',
    sources: ['Anthropic'],
    connectsTo: ['hierarchical-subagents', 'orchestrator', 'agent-teams', 'ai-factory'],
  },
  {
    id: 'hierarchical-subagents',
    label: 'Hierarchical Subagents',
    category: 'patterns',
    description: "Feature-lead agents that spawn their own specialists — deeper decomposition without blowing up the orchestrator's context.",
    connectsTo: ['orchestrator-worker', 'context-engineering'],
  },
  {
    id: 'plan-mode',
    label: 'Plan Mode',
    category: 'patterns',
    description: 'The agent presents a structured plan (files, changes, sequence) for human approval before executing.',
    notes: ['It is far cheaper to fix a bad plan than to fix bad code.'],
    connectsTo: ['plan-approval', 'spec-driven', 'rubber-duck', 'production-line'],
  },
  {
    id: 'plan-approval',
    label: 'Plan Approval',
    category: 'patterns',
    description: 'A human gate on the plan before any code is written — the feature that makes autonomy trustworthy.',
    connectsTo: ['plan-mode'],
  },
  {
    id: 'evaluator-optimizer',
    label: 'Evaluator–Optimizer',
    category: 'patterns',
    description: 'One agent generates, a separate agent critiques and refines — the verification loop made explicit.',
    connectsTo: ['separate-agent-verification', 'llm-as-judge', 'best-of-n'],
  },
  {
    id: 'best-of-n',
    label: 'Best-of-N / Advisor',
    category: 'patterns',
    description: 'A cheap executor calls a stronger advisor model only on hard cases; generate N attempts and pick the best.',
    connectsTo: ['multi-model-routing', 'rubber-duck', 'evaluator-optimizer'],
  },
  {
    id: 'rubber-duck',
    label: 'Rubber Duck Critic',
    category: 'patterns',
    description: 'A critic run after planning, after a complex implementation, and after writing tests but before running them.',
    connectsTo: ['plan-mode', 'verification-bottleneck', 'best-of-n'],
  },
  {
    id: 'ralph-loop',
    label: 'The Ralph Loop',
    category: 'patterns',
    description: 'Break work into atomic tasks and loop an agent — pick, implement, validate, commit, reset context — using compile + tests as the halting condition.',
    notes: ['Ship while you sleep.'],
    sources: ['Huntley', 'Carson'],
    connectsTo: ['out-of-context-verification', 'progress-files', 'kill-criteria', 'fleet-management'],
  },

  // ── Methodologies ───────────────────────────────────────────────
  {
    id: 'spec-driven',
    label: 'Spec-Driven Development',
    category: 'methods',
    description: 'Specs as version-controlled, executable contracts that constrain agent output — the defining methodology of 2026.',
    notes: ['The spec is the prompt.'],
    sources: ['GitHub Spec Kit', 'Fowler'],
    connectsTo: ['spec-as-contract', 'plan-mode', 'eval-driven', 'ai-factory'],
  },
  {
    id: 'spec-as-contract',
    label: 'Spec as Contract',
    category: 'methods',
    description: 'Intent is the source of truth; code is the regenerable output of a precise specification.',
    connectsTo: ['spec-driven', 'verification-bottleneck'],
  },
  {
    id: 'test-driven',
    label: 'Agent TDD',
    category: 'methods',
    description: "Writing tests before code so agents can't generate tests that merely confirm their own broken output.",
    connectsTo: ['eval-driven', 'deterministic-verifiers'],
  },
  {
    id: 'eval-driven',
    label: 'Eval-Driven Development',
    category: 'methods',
    description: 'Define capabilities and held-out eval sets before building the agent; combine deterministic checks, LLM-as-judge, and human review.',
    sources: ['Inspect AI', 'Braintrust'],
    connectsTo: ['test-driven', 'llm-as-judge', 'spec-driven'],
  },
  {
    id: 'fleet-management',
    label: 'Fleet Management',
    category: 'methods',
    description: 'Engineers trigger autonomous changes; agents write, test, and build in sandboxes and open PRs — resting on a catalog of every component and its owner.',
    stat: '650+ agent PRs/mo · up to 90% time saved',
    notes: ["You can't safely automate what you don't understand."],
    sources: ['Spotify “Honk”'],
    connectsTo: ['ai-factory', 'sandboxing', 'quality-gates', 'ralph-loop', 'cloud-agents'],
  },
  {
    id: 'middle-loop',
    label: 'The Middle Loop',
    category: 'methods',
    description: 'A new supervisory layer of engineering work emerging between the inner loop (coding) and the outer loop (delivery).',
    sources: ['ThoughtWorks'],
    connectsTo: ['review-capacity', 'roles-shift', 'retro'],
  },

  // ── Parallelism ─────────────────────────────────────────────────
  {
    id: 'worktree-isolation',
    label: 'Worktree Isolation',
    category: 'parallelism',
    description: 'Git worktrees give each agent its own working directory and branch over one .git store, moving conflicts to merge time.',
    stat: '~3× tokens for 3 agents',
    connectsTo: ['wip-limits', 'one-file-one-owner', 'integration-branch', 'token-engineering'],
  },
  {
    id: 'integration-branch',
    label: 'Integration-Branch Merge',
    category: 'parallelism',
    description: 'Merge agent output to a staging branch, run tests, then merge clean to main.',
    connectsTo: ['worktree-isolation', 'quality-gates'],
  },
  {
    id: 'wip-limits',
    label: 'WIP Limits (3–5)',
    category: 'parallelism',
    description: "Don't run more agents than you can review; 3–5 is the repeatedly cited sweet spot.",
    stat: 'sweet spot: 3–5 agents',
    connectsTo: ['one-file-one-owner', 'worktree-isolation', 'review-capacity'],
  },
  {
    id: 'one-file-one-owner',
    label: 'One File, One Owner',
    category: 'parallelism',
    description: 'Never let two agents edit the same file at once.',
    connectsTo: ['worktree-isolation', 'wip-limits'],
  },

  // ── Context & Memory ────────────────────────────────────────────
  {
    id: 'context-engineering',
    label: 'Context Engineering',
    category: 'context-memory',
    description: 'Engineering what goes into the context window — not just the prompt — is now the core discipline.',
    connectsTo: ['context-rot', 'agents-md', 'initializer-agent', 'hierarchical-subagents'],
  },
  {
    id: 'context-rot',
    label: 'Context Rot',
    category: 'context-memory',
    description: 'Every model degrades as the window fills with the wrong tokens; bigger windows shift the problem, not solve it.',
    sources: ['Chroma'],
    connectsTo: ['context-engineering'],
  },
  {
    id: 'agents-md',
    label: 'AGENTS.md',
    category: 'context-memory',
    description: 'A human-curated memory file of project rules and learnings that bridges context resets.',
    stat: 'dev-written +4% · AI-generated ~−3%, +20% cost',
    sources: ['Gloaguen et al., ETH Zurich'],
    connectsTo: ['retro', 'context-engineering'],
  },
  {
    id: 'initializer-agent',
    label: 'Initializer Agent',
    category: 'context-memory',
    description: 'On first run, sets up the environment and writes a comprehensive requirements file for later sessions.',
    connectsTo: ['progress-files', 'context-engineering'],
  },
  {
    id: 'progress-files',
    label: 'Progress Files',
    category: 'context-memory',
    description: "Artifacts like claude-progress.txt that let agents work 'in shifts,' carrying state across context resets.",
    connectsTo: ['initializer-agent', 'ralph-loop'],
  },

  // ── Verification & Quality ──────────────────────────────────────
  {
    id: 'verification-bottleneck',
    label: 'Verification Bottleneck',
    category: 'verification',
    description: 'The binding constraint has shifted decisively from code generation to verification.',
    notes: ['The bottleneck is no longer typing — it is review.'],
    connectsTo: ['separate-agent-verification', 'quality-gates', 'acceleration-whiplash', 'ai-factory', 'rubber-duck', 'spec-as-contract'],
  },
  {
    id: 'separate-agent-verification',
    label: 'Separate-Agent Verification',
    category: 'verification',
    description: "A different model or fresh-context agent verifies, because a model grading its own work shares its own blind spots.",
    notes: ['Never let the writer grade its own exam.'],
    connectsTo: ['llm-as-judge', 'evaluator-optimizer', 'verification-bottleneck'],
  },
  {
    id: 'llm-as-judge',
    label: 'LLM-as-Judge',
    category: 'verification',
    description: 'An LLM compares the diff against the original prompt to catch over-ambitious agents that drift outside their brief.',
    sources: ['Spotify “Honk”'],
    connectsTo: ['eval-driven', 'separate-agent-verification', 'deterministic-verifiers'],
  },
  {
    id: 'quality-gates',
    label: 'Quality Gates / Hooks',
    category: 'verification',
    description: 'Hooks that run lint/build/test on task completion and block an agent from stopping on red.',
    connectsTo: ['deterministic-verifiers', 'fleet-management', 'integration-branch'],
  },
  {
    id: 'deterministic-verifiers',
    label: 'Deterministic Verifiers',
    category: 'verification',
    description: 'Non-LLM checks — format, build, test — that give an objective halting signal.',
    connectsTo: ['quality-gates', 'out-of-context-verification', 'test-driven'],
  },
  {
    id: 'out-of-context-verification',
    label: 'Out-of-Context Verification',
    category: 'verification',
    description: "Using compile + tests outside the agent's context as the halting condition solves the 'all done, tests pass!' lying problem.",
    connectsTo: ['ralph-loop', 'deterministic-verifiers', 'kill-criteria'],
  },

  // ── Governance & Security ───────────────────────────────────────
  {
    id: 'sandboxing',
    label: 'Sandboxing',
    category: 'governance',
    description: "Isolated execution (microVMs/gVisor) that can't stop prompt injection but contains its blast radius.",
    connectsTo: ['defense-in-depth', 'fleet-management', 'containment'],
  },
  {
    id: 'owasp-agentic',
    label: 'OWASP Agentic Top 10',
    category: 'governance',
    description: 'The OWASP Top 10 for Agentic Applications; Agent Goal Hijacking (ASI01) ranks #1.',
    sources: ['OWASP 2025'],
    connectsTo: ['defense-in-depth', 'containment'],
  },
  {
    id: 'defense-in-depth',
    label: 'Defense-in-Depth',
    category: 'governance',
    description: 'Scoped read-only tokens, secrets kept out of the agent, egress firewalls, safe-output gates, threat scans.',
    connectsTo: ['sandboxing', 'governance-as-code', 'owasp-agentic'],
  },
  {
    id: 'containment',
    label: 'Containment over Prevention',
    category: 'governance',
    description: 'Assume prompt injection will happen; design proportional human approval gates instead of trying to prevent it.',
    connectsTo: ['sandboxing', 'owasp-agentic'],
  },
  {
    id: 'governance-as-code',
    label: 'Governance as Code',
    category: 'governance',
    description: 'Codify the security pipeline — token scope, sandbox, firewall, safe-outputs, scan — as part of the workflow.',
    connectsTo: ['defense-in-depth', 'quality-gates'],
  },

  // ── Cost & Tokens ───────────────────────────────────────────────
  {
    id: 'token-engineering',
    label: 'Effective Tokens',
    category: 'cost-tokens',
    description: 'Treat tokens as a budget: prune unused tools, replace MCP calls with deterministic CLI calls, run auditor/optimizer agents.',
    stat: '−62% token spend',
    sources: ['GitHub'],
    connectsTo: ['prompt-cache', 'mcp-pruning', 'worktree-isolation', 'multi-model-routing'],
  },
  {
    id: 'prompt-cache',
    label: 'Prompt-Cache Hit Rate',
    category: 'cost-tokens',
    description: 'High cache hit rates separate cheap from ruinous; a sudden drop signals a prompt-assembly bug.',
    stat: 'target >94% · ~70% = bug',
    sources: ['GitHub'],
    connectsTo: ['token-engineering'],
  },
  {
    id: 'mcp-pruning',
    label: 'MCP Tool Pruning',
    category: 'cost-tokens',
    description: "A 40-tool MCP server can add 10–15 KB of schema per turn; drop the tools the agent doesn't use.",
    sources: ['GitHub'],
    connectsTo: ['token-engineering'],
  },
  {
    id: 'multi-model-routing',
    label: 'Multi-Model Routing',
    category: 'cost-tokens',
    description: 'Cheap models for planning, strong models for implementation, a separate model for review.',
    stat: 'Haiku 0.25× · Sonnet 1× · Opus 5×',
    connectsTo: ['best-of-n', 'token-engineering'],
  },

  // ── Tooling ─────────────────────────────────────────────────────
  {
    id: 'agent-teams',
    label: 'Agent Teams (Tier 1)',
    category: 'tools',
    description: 'In-process subagents: a lead plus 3–5 teammates with a shared task list, dependency auto-unblock, and file locking.',
    connectsTo: ['orchestrator-worker', 'harness-race', 'local-orchestrators'],
  },
  {
    id: 'local-orchestrators',
    label: 'Local Orchestrators (Tier 2)',
    category: 'tools',
    description: 'Local tools (Conductor, Vibe Kanban, Cursor agents, Claude Squad) that run parallel sprints over worktrees.',
    connectsTo: ['worktree-isolation', 'agent-teams', 'cloud-agents'],
  },
  {
    id: 'cloud-agents',
    label: 'Cloud Async Agents (Tier 3)',
    category: 'tools',
    description: 'Cloud async agents (Claude Code Web, Copilot Coding Agent, Jules, Codex Web) that drain the backlog overnight.',
    connectsTo: ['fleet-management', 'local-orchestrators'],
  },
  {
    id: 'harness-race',
    label: 'The Harness Race',
    category: 'tools',
    description: 'The frontier has moved from the model race to the harness race — the scaffolding around the model now matters most.',
    stat: 'SWE-bench 62% → 87% in ~1 yr',
    sources: ['Anthropic'],
    connectsTo: ['agent-teams'],
  },

  // ── Roles & Org ─────────────────────────────────────────────────
  {
    id: 'roles-shift',
    label: 'Upstream Migration of Rigor',
    category: 'roles-org',
    description: "Engineering rigor doesn't disappear — it moves upstream to specs, architecture, and review.",
    connectsTo: ['not-trusting-ai', 'junior-pipeline', 'middle-loop', 'review-capacity'],
  },
  {
    id: 'not-trusting-ai',
    label: 'Not Trusting AI Code',
    category: 'roles-org',
    description: 'The new core skill: specifying precisely and reviewing rigorously rather than trusting AI output.',
    notes: ['Never file a PR with code you haven’t reviewed yourself.'],
    sources: ['Pragmatic Engineer 2026'],
    connectsTo: ['verification-bottleneck', 'review-capacity', 'roles-shift'],
  },
  {
    id: 'junior-pipeline',
    label: 'Junior-Pipeline Debate',
    category: 'roles-org',
    description: 'AI adoption is pressuring entry-level hiring, risking a future mid-level talent gap and eroded mentorship.',
    stat: 'junior dev employment −9–10%',
    sources: ['Harvard 2026'],
    connectsTo: ['roles-shift'],
  },
  {
    id: 'conways-agents',
    label: "Conway's Law for Agents",
    category: 'roles-org',
    description: 'Agent topologies can mirror dysfunctional org boundaries, reintroducing communication bottlenecks.',
    sources: ['ThoughtWorks'],
    connectsTo: ['orchestrator-worker', 'roles-shift'],
  },
  {
    id: 'circuit-breaker',
    label: 'PR Circuit Breaker',
    category: 'roles-org',
    description: "Predict high-maintenance agent PRs at creation time, before they impose a hidden 'attention tax' on reviewers.",
    stat: '33,707 PRs · 28.3% merge instantly',
    sources: ["MSR '26"],
    connectsTo: ['no-review-merges', 'review-capacity'],
  },
  {
    id: 'review-capacity',
    label: 'Review Capacity',
    category: 'roles-org',
    description: 'Review throughput is the scarce resource; add agents only as fast as you can review their output.',
    connectsTo: ['verification-bottleneck', 'acceleration-whiplash', 'not-trusting-ai'],
  },

  // ── Metrics & Risk ──────────────────────────────────────────────
  {
    id: 'acceleration-whiplash',
    label: 'Acceleration Whiplash',
    category: 'metrics',
    description: 'Real throughput gains at the top, compounding quality costs at every stage below.',
    stat: 'epics +66% · bugs +54% · review +442% · no-review +31%',
    sources: ['Faros AI 2026'],
    connectsTo: ['faros', 'dora', 'verification-bottleneck', 'review-capacity'],
  },
  {
    id: 'faros',
    label: 'Faros Telemetry',
    category: 'metrics',
    description: "Two years of telemetry quantifying AI's downside as well as its gains.",
    stat: '22,000+ devs · 4,000+ teams',
    sources: ['Faros AI 2026'],
    connectsTo: ['acceleration-whiplash', 'no-review-merges'],
  },
  {
    id: 'dora',
    label: 'DORA: AI as Amplifier',
    category: 'metrics',
    description: 'AI magnifies the strengths of strong orgs and the dysfunctions of struggling ones.',
    notes: ['AI is an amplifier — it magnifies strengths and dysfunctions alike.'],
    sources: ['DORA 2025'],
    connectsTo: ['acceleration-whiplash', 'j-curve'],
  },
  {
    id: 'j-curve',
    label: 'The J-Curve',
    category: 'metrics',
    description: 'Value realization dips before it rises; expect an initial productivity drop.',
    sources: ['DORA 2026'],
    connectsTo: ['dora'],
  },
  {
    id: 'no-review-merges',
    label: 'Unreviewed Merges',
    category: 'metrics',
    description: 'The clearest leading indicator of trouble: a creeping rate of PRs merged with no review at all.',
    stat: '+31.3% unreviewed merges',
    sources: ['Faros AI 2026'],
    connectsTo: ['faros', 'review-capacity', 'circuit-breaker'],
  },
]

// --- derive undirected links from connectsTo (dedupe a–b / b–a) ---
const ids = new Set(nodes.map((n) => n.id))
const seen = new Set()
export const links = []
for (const n of nodes) {
  for (const target of n.connectsTo || []) {
    if (!ids.has(target)) continue // skip dangling references
    const key = [n.id, target].sort().join('::')
    if (seen.has(key)) continue
    seen.add(key)
    links.push({ source: n.id, target })
  }
}
