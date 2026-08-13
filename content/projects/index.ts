import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    title: "Hospital Management ERP",
    slug: "hospital-erp",
    year: "2024",
    category: "Healthcare ERP",
    filters: ["ERP", "Odoo", "Web"],
    featured: true,
    caseStudy: true,
    icon: "hospital",
    description:
      "Odoo-based hospital management solution covering patient and hospital workflows.",
    summary:
      "A centralized hospital ERP that connects patient registration, clinical workflows, billing and operational reporting.",
    overview:
      "The Hospital Management ERP is an Odoo-based operational system for organizations that need one place to manage patient, clinical and administrative work. It replaces fragmented paper and spreadsheet processes with structured modules, role-based access and operational dashboards.",
    role: "ERP Developer / Technical Consultant",
    responsibilities: [
      "Requirements analysis with clinical and administrative stakeholders",
      "Custom module development on Odoo",
      "Workflow and access-control design",
      "Dashboard and reporting development",
      "Deployment and technical support",
    ],
    technologies: ["Odoo", "Python", "PostgreSQL", "OWL"],
    problem:
      "The organization required a centralized system for managing hospital operations across multiple workflows. Patient records, appointments, billing and departmental work lived in separate tools, which made reporting slow and increased the risk of inconsistent data.",
    solution:
      "A modular Odoo implementation with custom hospital modules, structured patient records, workflow states and dashboards. PostgreSQL remains the system of record; the Odoo web client is the operational interface for clinical and administrative users.",
    features: [
      "Patient registration and longitudinal records",
      "Appointment and departmental workflow tracking",
      "Role-based access for clinical, billing and admin users",
      "Operational dashboards for census, activity and bottlenecks",
      "Billing and service documentation tied to patient encounters",
    ],
    architecture: [
      {
        id: "users",
        label: "Users",
        detail: "Clinicians, reception, billing, administration",
      },
      {
        id: "client",
        label: "Odoo Web Client",
        detail: "Forms, kanban, OWL dashboards",
      },
      {
        id: "apps",
        label: "Application layer",
        children: [
          { id: "modules", label: "Custom hospital modules" },
          { id: "dashboards", label: "Operational dashboards" },
        ],
      },
      {
        id: "db",
        label: "PostgreSQL",
        detail: "Patients, encounters, billing, audit",
      },
      {
        id: "infra",
        label: "Infrastructure",
        detail: "Linux, Docker, backups, access control",
      },
    ],
    challenges: [
      {
        title: "Multiple operational workflows",
        description:
          "Hospital work is not a single pipeline. Registration, clinical notes, billing and reporting had to share a data model without forcing every team into the same screen.",
      },
      {
        title: "Access control",
        description:
          "Clinical data needed least-privilege access. Record rules and group design were treated as part of the product, not a later hardening step.",
      },
      {
        title: "Adoption",
        description:
          "The system had to match existing hospital language and status transitions so staff could use it without a long change-management delay.",
      },
    ],
    implementation: [
      "Mapped current-state hospital processes before writing models",
      "Implemented Odoo models, views, security groups and automated actions",
      "Built OWL / Chart-oriented dashboards for daily operational review",
      "Deployed on Linux with PostgreSQL and documented operating procedures",
    ],
    results: [
      "One system of record for patient and hospital operations",
      "Faster operational reporting without manual spreadsheet assembly",
      "Clearer ownership of each workflow stage",
    ],
    impact: [
      "Centralized hospital operations that previously sat in separate tools",
      "Reduced manual coordination between reception, clinical and billing teams",
      "Improved reporting from live operational data",
      "Enabled role-based access instead of shared spreadsheets",
    ],
    screenshots: [
      {
        src: "/projects/hospital-erp.svg",
        alt: "Hospital ERP architecture and workflow overview",
        caption: "Patient, clinical and billing workflows on a shared Odoo data model",
      },
    ],
    lessons: [
      "ERP value comes from the process model, not from the number of screens.",
      "Security groups should be designed with the domain, not added after go-live.",
      "Dashboards are useful only when they answer an operational question.",
    ],
    related: ["hms-dashboard", "exam-management"],
  },
  {
    title: "Business Registrar Dashboard",
    slug: "business-registrar",
    year: "2024",
    category: "Analytics / Odoo",
    filters: ["ERP", "Odoo", "Web"],
    featured: true,
    caseStudy: true,
    icon: "chart",
    description:
      "Interactive business analytics dashboard with KPIs, revenue analysis and geographic/category analysis.",
    summary:
      "An OWL and Chart.js dashboard for registrar and commercial data: KPIs, revenue, geography and category breakdowns.",
    overview:
      "The Business Registrar Dashboard turns registrar and commercial records into an interactive analytics surface. It is built for operators who need to see volume, revenue and geographic distribution without exporting data into a separate BI tool.",
    role: "ERP Developer / Frontend Engineer",
    responsibilities: [
      "KPI definition with business stakeholders",
      "OWL component and Chart.js visualization work",
      "PostgreSQL aggregation and Odoo data services",
      "Filter, drill-down and category analysis UX",
    ],
    technologies: ["Odoo", "OWL", "Chart.js", "PostgreSQL"],
    problem:
      "Registrar and commercial data existed in operational tables, but leadership still assembled KPIs by hand. Geographic and category questions required repeated exports.",
    solution:
      "An in-product dashboard layer on Odoo: OWL components consume aggregated PostgreSQL data and render KPI cards, time series, category mix and geographic analysis with Chart.js.",
    features: [
      "KPI cards for volume, revenue and period-over-period change",
      "Revenue analysis by period, category and segment",
      "Geographic and category breakdowns",
      "Interactive filters without leaving the ERP",
      "Export-friendly summary views for management review",
    ],
    architecture: [
      { id: "users", label: "Analysts and managers" },
      { id: "owl", label: "OWL dashboard client", detail: "Filters, KPI cards, Chart.js" },
      {
        id: "services",
        label: "Odoo services",
        children: [
          { id: "orm", label: "ORM / models" },
          { id: "rpc", label: "JSON-RPC / controllers" },
        ],
      },
      { id: "db", label: "PostgreSQL aggregations" },
    ],
    challenges: [
      {
        title: "Aggregation performance",
        description:
          "Dashboard queries had to stay fast on operational tables. Aggregations were designed around the questions the dashboard actually asks.",
      },
      {
        title: "Readable visuals",
        description:
          "The goal was decision support, not chart density. Each visualization maps to one management question.",
      },
    ],
    implementation: [
      "Defined KPI contracts before writing frontend components",
      "Implemented OWL components with Chart.js for time series and mix charts",
      "Added server-side aggregation endpoints on Odoo",
      "Validated numbers against source registrar records",
    ],
    results: [
      "KPI review moved from spreadsheet exports to an in-ERP dashboard",
      "Category and geography questions became filter operations, not ad-hoc analysis",
    ],
    impact: [
      "Automated KPI assembly that previously required manual exports",
      "Reduced time from question to chart for registrar leadership",
      "Centralized commercial analytics next to the source records",
      "Improved reporting consistency across periods",
    ],
    screenshots: [
      {
        src: "/projects/business-registrar.svg",
        alt: "Business registrar dashboard wireframe",
        caption: "KPI, revenue, category and geography views in one Odoo dashboard",
      },
    ],
    lessons: [
      "A dashboard is a product. KPI definitions belong in the requirements, not in the chart library.",
      "OWL is effective when the backend already exposes a clean aggregation contract.",
    ],
    related: ["hms-dashboard", "hospital-erp"],
  },
  {
    title: "Exam Management Platform",
    slug: "exam-management",
    year: "2024",
    category: "Education",
    filters: ["ERP", "Odoo", "Web"],
    featured: true,
    caseStudy: true,
    icon: "exam",
    description:
      "Examination management system designed for technical training and assessment.",
    summary:
      "An Odoo examination platform for scheduling, delivery, marking and results in technical training programs.",
    overview:
      "The Exam Management Platform supports technical training organizations that need a structured way to define assessments, run sittings, mark scripts and publish results. It is designed around academic operations rather than generic form builders.",
    role: "ERP Developer / Technical Consultant",
    responsibilities: [
      "Domain modeling for courses, sittings, candidates and results",
      "Odoo module and OWL interface development",
      "Access control for examiners, invigilators and candidates",
      "Results reporting and auditability",
    ],
    technologies: ["Odoo", "Python", "OWL", "JavaScript"],
    problem:
      "Technical training programs were managing examinations through documents and spreadsheets. Scheduling, candidate lists, marking and result publication were difficult to audit and easy to desynchronize.",
    solution:
      "A dedicated Odoo application for examination operations: exam definitions, sitting schedules, candidate assignment, marking workflows and result publication, with a clear audit trail.",
    features: [
      "Exam and sitting configuration",
      "Candidate registration and attendance",
      "Marking workflows with role separation",
      "Result compilation and publication",
      "Audit history for changes to marks and sittings",
    ],
    architecture: [
      { id: "actors", label: "Examiners, invigilators, administrators" },
      { id: "client", label: "Odoo Web Client / OWL" },
      {
        id: "domain",
        label: "Exam domain modules",
        children: [
          { id: "defs", label: "Exam definitions" },
          { id: "sittings", label: "Sittings and candidates" },
          { id: "marks", label: "Marking and results" },
        ],
      },
      { id: "db", label: "PostgreSQL" },
    ],
    challenges: [
      {
        title: "Integrity of results",
        description:
          "Marks cannot be treated as ordinary editable fields. The model needed status transitions and an audit trail.",
      },
      {
        title: "Role separation",
        description:
          "The people who schedule sittings, invigilate and mark are not the same users. Security had to follow that split.",
      },
    ],
    implementation: [
      "Modeled exams, sittings, candidates and results as first-class Odoo records",
      "Implemented status workflows and chatter / audit history",
      "Built examiner and administrator views in OWL and standard Odoo views",
      "Documented operating procedures for sitting day and result publication",
    ],
    results: [
      "Examination operations moved onto a single auditable system",
      "Result publication no longer depended on assembling marks by hand",
    ],
    impact: [
      "Automated sitting and result workflows that were previously manual",
      "Centralized candidate, exam and mark data",
      "Improved reporting for training programs",
      "Enabled clearer examiner and administrator responsibilities",
    ],
    screenshots: [
      {
        src: "/projects/exam-management.svg",
        alt: "Exam management platform overview",
        caption: "Exam definition, sitting control and results on one platform",
      },
    ],
    lessons: [
      "Assessment software is a workflow product. Status and audit matter more than form design.",
      "Training organizations adopt systems faster when the language matches how they already run exams.",
    ],
    related: ["school-management", "hospital-erp"],
    github: undefined,
  },
  {
    title: "AI Helpdesk",
    slug: "ai-helpdesk",
    year: "2025",
    category: "AI / Odoo",
    filters: ["AI", "Odoo", "ERP"],
    featured: true,
    caseStudy: true,
    icon: "ai",
    description:
      "Helpdesk workflows assisted by LLM classification, suggested replies and knowledge retrieval inside Odoo.",
    summary:
      "An Odoo helpdesk layer that uses LLM assistance for ticket classification, suggested responses and knowledge-base retrieval.",
    overview:
      "AI Helpdesk is an Odoo helpdesk extension for teams that already run support in ERP. It uses LLM assistance to classify tickets, retrieve related knowledge and draft suggested replies, while leaving acceptance and sending under human control.",
    role: "Software Engineer / Technical Consultant",
    responsibilities: [
      "Helpdesk workflow and knowledge-base modeling",
      "LLM integration design with human-in-the-loop review",
      "Prompt and retrieval boundaries so the model cannot act on its own",
      "Odoo UI for suggestions, confidence and agent acceptance",
    ],
    technologies: ["Odoo", "Python", "JavaScript", "LLM integrations"],
    problem:
      "Support teams spent time on repetitive classification and first-reply drafting. Knowledge existed in tickets and documents, but agents still searched manually.",
    solution:
      "A constrained AI layer on the existing helpdesk: classify, retrieve and suggest. Agents review every suggestion. The ERP remains the system of record.",
    features: [
      "Automatic ticket classification with agent override",
      "Suggested first replies grounded in knowledge-base articles",
      "Human acceptance before any customer-facing send",
      "Trace of model suggestion versus final agent text",
      "Works inside the existing Odoo helpdesk workflow",
    ],
    architecture: [
      { id: "agent", label: "Support agent" },
      { id: "odoo", label: "Odoo Helpdesk UI" },
      {
        id: "ai",
        label: "Assistance layer",
        children: [
          { id: "classify", label: "Classification" },
          { id: "retrieve", label: "Knowledge retrieval" },
          { id: "draft", label: "Suggested reply" },
        ],
      },
      { id: "record", label: "Ticket + knowledge records in PostgreSQL" },
    ],
    challenges: [
      {
        title: "Trust and control",
        description:
          "The model must not send messages or change ticket state on its own. Assistance is a proposal, not an action.",
      },
      {
        title: "Grounding",
        description:
          "Suggested replies are only useful when they can point back to knowledge-base records rather than inventing policy.",
      },
    ],
    implementation: [
      "Kept Odoo helpdesk as the workflow source of truth",
      "Added an assistance service with explicit classify / retrieve / draft steps",
      "Rendered suggestions in the ticket form for accept, edit or discard",
      "Logged suggestion provenance for later review",
    ],
    results: [
      "Faster first-response drafting without removing agent accountability",
      "More consistent ticket classification for reporting",
    ],
    impact: [
      "Automated first-pass classification of incoming tickets",
      "Reduced manual search through knowledge articles",
      "Enabled consistent first-reply drafts under agent control",
      "Improved reporting from cleaner ticket categories",
    ],
    screenshots: [
      {
        src: "/projects/ai-helpdesk.svg",
        alt: "AI helpdesk assistance flow",
        caption: "Classify, retrieve and suggest — with the agent still in control",
      },
    ],
    lessons: [
      "AI in ERP is an interface problem as much as a model problem.",
      "Human acceptance is a product requirement, not a disclaimer.",
    ],
    related: ["hospital-erp", "business-registrar"],
  },
  {
    title: "HMS Dashboard",
    slug: "hms-dashboard",
    year: "2024",
    category: "Healthcare analytics",
    filters: ["Odoo", "Web", "ERP"],
    featured: false,
    caseStudy: false,
    icon: "dashboard",
    description:
      "Hospital operations dashboard for census, throughput and departmental workload.",
    summary:
      "A focused hospital dashboard for daily operational review: occupancy, throughput and departmental load.",
    overview:
      "HMS Dashboard is the operational analytics layer for hospital ERP data. It is intentionally narrower than a full BI suite: daily census, throughput and departmental workload for people who run the hospital, not a general reporting warehouse.",
    role: "ERP Developer",
    responsibilities: [
      "Operational KPI selection with hospital administrators",
      "Dashboard layout and Chart.js visualizations",
      "Query design against hospital ERP models",
    ],
    technologies: ["Odoo", "OWL", "Chart.js", "PostgreSQL"],
    problem:
      "Hospital managers needed a daily picture of occupancy and departmental load. The ERP stored the data, but it was not visible without constructing reports each morning.",
    solution:
      "A dedicated dashboard module that reads from hospital models and presents a small set of operational KPIs with clear visual hierarchy.",
    features: [
      "Daily census and occupancy",
      "Departmental workload",
      "Admission and discharge throughput",
      "Exception lists for overdue or blocked workflows",
    ],
    architecture: [
      { id: "ops", label: "Hospital operations users" },
      { id: "dash", label: "HMS dashboard (OWL)" },
      { id: "hms", label: "Hospital ERP models" },
      { id: "db", label: "PostgreSQL" },
    ],
    challenges: [
      {
        title: "Signal versus noise",
        description:
          "A hospital can generate dozens of charts. The dashboard was limited to the numbers used in a morning operations review.",
      },
    ],
    implementation: [
      "Paired dashboard widgets to existing hospital models",
      "Used Chart.js for trend and mix visuals",
      "Kept drill-through back to source records in Odoo",
    ],
    results: [
      "Morning operational review no longer required assembling reports by hand",
    ],
    impact: [
      "Improved reporting for daily hospital operations",
      "Centralized occupancy and throughput visibility",
      "Enabled faster identification of blocked workflows",
    ],
    screenshots: [
      {
        src: "/projects/hms-dashboard.svg",
        alt: "Hospital dashboard wireframe",
        caption: "Census, throughput and departmental load",
      },
    ],
    lessons: [
      "Operational dashboards should open the source record, not trap users in charts.",
    ],
    related: ["hospital-erp", "business-registrar"],
  },
  {
    title: "Telecom Optimization Practice",
    slug: "telecom-optimization",
    year: "2019 — Present",
    category: "RNPO",
    filters: ["Telecom"],
    featured: false,
    caseStudy: true,
    icon: "radio",
    description:
      "Radio network planning and optimization across 2G, 3G, 4G and 5G, with KPI analysis and field troubleshooting.",
    summary:
      "Live-network RNPO work: coverage, quality, capacity and KPI analysis across 2G through 5G.",
    overview:
      "Telecom Optimization is the professional practice behind the RNPO role: planning and optimizing live radio networks, reading KPIs correctly, and turning drive-test and OSS evidence into parameter and configuration changes. Sensitive operator data is not published here.",
    role: "RNPO Engineer",
    responsibilities: [
      "2G / 3G / 4G / 5G optimization",
      "KPI analysis and quality investigation",
      "Coverage and capacity analysis",
      "Network troubleshooting and field correlation",
    ],
    technologies: ["2G", "3G", "4G", "5G", "RNPO", "KPI analysis"],
    problem:
      "Radio networks degrade through traffic growth, neighbor errors, coverage holes and parameter drift. The work is to find the actual cause — RF, parameter, or configuration — and change the right thing.",
    solution:
      "A disciplined RNPO loop: define the KPI question, collect OSS and drive-test evidence, isolate RF versus parameter causes, implement a controlled change, and verify.",
    features: [
      "Accessibility, retainability, mobility and integrity KPI review",
      "Coverage and quality analysis (including RxLev, RxQual and TA on 2G)",
      "TCH drop and related retainability investigation",
      "Neighbor, handover and parameter consistency checks",
      "Field correlation without publishing site-level operational data",
    ],
    architecture: [
      { id: "evidence", label: "OSS counters + drive-test traces" },
      { id: "analysis", label: "KPI and RF analysis" },
      { id: "decision", label: "Parameter / neighbor / physical change" },
      { id: "verify", label: "Post-change KPI verification" },
    ],
    challenges: [
      {
        title: "Cause isolation",
        description:
          "A bad KPI is not a diagnosis. Drop rate, RxQual and TA can point at different layers. The analysis has to separate coverage, interference, handover and core issues.",
      },
      {
        title: "Operational sensitivity",
        description:
          "Live-network work cannot be presented as a public dataset. The portfolio describes method, not operator internals.",
      },
    ],
    implementation: [
      "Used OSS KPIs to locate the problem cluster before going to traces",
      "Correlated RF samples (RxLev, RxQual, TA) with retainability and mobility KPIs",
      "Applied parameter and neighbor changes in controlled windows",
      "Verified with the same KPI definitions used to open the investigation",
    ],
    results: [
      "Repeatable investigation method across 2G, 3G, 4G and 5G",
      "Field and desk analysis treated as one loop, not separate jobs",
    ],
    impact: [
      "Improved quality analysis on live radio networks",
      "Enabled structured KPI investigation instead of trial-and-error changes",
      "Reduced time from symptom to likely cause in retainability and coverage cases",
    ],
    screenshots: [
      {
        src: "/projects/telecom-optimization.svg",
        alt: "RNPO analysis loop",
        caption: "Evidence, analysis, change, verification",
      },
    ],
    lessons: [
      "KPI definitions matter. A TCH drop rate is only useful if the numerator and denominator are understood.",
      "RxQual, RxLev and TA answer different questions. They should not be collapsed into a single 'coverage' story.",
    ],
    related: ["hospital-erp"],
  },
  {
    title: "School Management System",
    slug: "school-management",
    year: "2023",
    category: "Education ERP",
    filters: ["ERP", "Odoo", "Web"],
    featured: false,
    caseStudy: false,
    icon: "school",
    description:
      "Odoo school administration system for public high schools in Hargeisa, covering students, exams, attendance and staff.",
    summary:
      "An all-in-one school administration system designed for public high schools in Hargeisa, Somaliland.",
    overview:
      "The School Management System was built to simplify administration in public high schools: student records, exams and grading, attendance, admissions, alumni and human resources. I acted as developer and project lead, with Python, Odoo and PostgreSQL as the core stack.",
    role: "Developer and project lead",
    responsibilities: [
      "Product definition for public high-school administration",
      "Core module design and implementation",
      "User-interface design for staff with mixed technical experience",
      "PostgreSQL data model and Odoo security",
    ],
    technologies: ["Odoo", "Python", "PostgreSQL", "JavaScript", "CSS"],
    problem:
      "Schools were running student information, exams, attendance, admissions and HR as separate paper and spreadsheet processes. That created duplication, slow reporting and avoidable administrative load.",
    solution:
      "A modular Odoo system that keeps school administration in one place, with an interface designed to be usable by staff who are not software specialists.",
    features: [
      "Student information management",
      "Exam and grading",
      "Attendance tracking",
      "Admissions and alumni records",
      "Human-resources administration",
    ],
    architecture: [
      { id: "staff", label: "School administrators and teachers" },
      { id: "odoo", label: "Odoo school modules" },
      { id: "db", label: "PostgreSQL" },
    ],
    challenges: [
      {
        title: "Usability in a school office",
        description:
          "The interface had to remain obvious for users with limited ERP experience. Visual hierarchy and navigation were treated as part of the engineering work.",
      },
    ],
    implementation: [
      "Designed modules around actual school-office workflows in Hargeisa",
      "Implemented backend models in Python on Odoo with PostgreSQL",
      "Kept the frontend in standard Odoo views plus targeted JavaScript/CSS",
    ],
    results: [
      "One administrative system instead of disconnected office tools",
      "A concrete ERP delivery for a public-education context",
    ],
    impact: [
      "Reduced manual paperwork across student and exam administration",
      "Centralized school records",
      "Enabled a single system for attendance, grading and admissions",
    ],
    screenshots: [
      {
        src: "/projects/school-management.svg",
        alt: "School management system overview",
        caption: "Student, exam, attendance and HR modules on Odoo",
      },
    ],
    lessons: [
      "Local context matters. A school system for Hargeisa is not a generic campus product.",
    ],
    related: ["exam-management"],
  },
  {
    title: "Dentist Management",
    slug: "dentist-management",
    year: "Practice / delivery",
    category: "Clinic ERP",
    filters: ["ERP", "Odoo", "Web"],
    featured: false,
    caseStudy: false,
    icon: "clinic",
    description:
      "Clinic management module work for dental practice operations on Odoo.",
    summary:
      "Odoo module work for dental clinic operations, from patient records to practice workflows.",
    overview:
      "Dentist Management is clinic-oriented Odoo work: patient records and practice workflows for a dental setting. The public repository captures the development line; the product intent is a small-clinic ERP rather than a hospital suite.",
    role: "Odoo Developer",
    responsibilities: [
      "Clinic domain modeling",
      "Odoo module development",
      "Practice workflow views",
    ],
    technologies: ["Odoo", "Python", "PostgreSQL"],
    problem:
      "Small dental clinics need structured patient and appointment records without the complexity of a full hospital information system.",
    solution:
      "A focused Odoo module set for dental practice operations, kept intentionally smaller than the hospital ERP.",
    features: [
      "Patient records",
      "Clinic workflow views",
      "Odoo-native security and forms",
    ],
    architecture: [
      { id: "clinic", label: "Clinic staff" },
      { id: "module", label: "Odoo dentist module" },
      { id: "db", label: "PostgreSQL" },
    ],
    challenges: [
      {
        title: "Scope control",
        description:
          "Clinic software fails when it inherits hospital complexity. The module set stays on practice operations.",
      },
    ],
    implementation: [
      "Developed module structure and models on Odoo",
      "Kept the data model aligned with clinic rather than hospital workflows",
    ],
    results: [
      "A reusable starting point for clinic ERP work",
    ],
    impact: [
      "Enabled clinic operations on a standard Odoo stack",
      "Centralized patient and practice records",
    ],
    screenshots: [
      {
        src: "/projects/dentist-management.svg",
        alt: "Dentist management module overview",
        caption: "Clinic-scale Odoo module structure",
      },
    ],
    lessons: [
      "The same ERP platform can serve hospital and clinic work, but the domain model must not be copied blindly.",
    ],
    related: ["hospital-erp"],
    github: "https://github.com/Ahmed-Shukr/dentist_management",
  },
];
