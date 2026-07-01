import {
  Tenant,
  User,
  Document,
  Conversation,
  Message,
  UsageStats,
  BillingRecord,
  PlanLimits,
} from "../types";

// 3 tenants representing different industries and subscription plans
export const mockTenants: Tenant[] = [
  {
    id: "tenant-smith-partners",
    name: "Smith & Partners",
    industry: "Legal Services",
    plan: "pro",
    stripeCustomerId: "cus_smith_12345",
    createdAt: new Date("2024-01-15T09:00:00Z"),
  },
  {
    id: "tenant-medicore",
    name: "MediCore Hospital",
    industry: "Healthcare",
    plan: "enterprise",
    stripeCustomerId: "cus_medicore_67890",
    createdAt: new Date("2023-08-20T10:30:00Z"),
  },
  {
    id: "tenant-bytestack",
    name: "ByteStack Technologies",
    industry: "Technology Startup",
    plan: "free",
    stripeCustomerId: "cus_bytestack_abcde",
    createdAt: new Date("2025-02-10T14:15:00Z"),
  },
];

// 6 users spread across the 3 tenants with different roles
export const mockUsers: User[] = [
  // Smith & Partners (pro plan)
  {
    id: "user-smith-admin",
    email: "admin@smithpartners.com",
    name: "Sarah Smith",
    role: "admin",
    tenantId: "tenant-smith-partners",
    createdAt: new Date("2024-01-15T09:05:00Z"),
  },
  {
    id: "user-smith-manager",
    email: "john.davis@smithpartners.com",
    name: "John Davis",
    role: "manager",
    tenantId: "tenant-smith-partners",
    createdAt: new Date("2024-02-01T11:00:00Z"),
  },

  // MediCore Hospital (enterprise plan)
  {
    id: "user-medicore-admin",
    email: "dr.roberts@medicore.org",
    name: "Dr. Elizabeth Roberts",
    role: "admin",
    tenantId: "tenant-medicore",
    createdAt: new Date("2023-08-20T10:45:00Z"),
  },
  {
    id: "user-medicore-viewer",
    email: "nurse.clark@medicore.org",
    name: "Robert Clark",
    role: "viewer",
    tenantId: "tenant-medicore",
    createdAt: new Date("2023-09-12T08:30:00Z"),
  },

  // ByteStack Technologies (free plan)
  {
    id: "user-bytestack-manager",
    email: "alex.chen@bytestack.dev",
    name: "Alex Chen",
    role: "manager",
    tenantId: "tenant-bytestack",
    createdAt: new Date("2025-02-10T14:20:00Z"),
  },
  {
    id: "user-bytestack-viewer",
    email: "lisa.jones@bytestack.dev",
    name: "Lisa Jones",
    role: "viewer",
    tenantId: "tenant-bytestack",
    createdAt: new Date("2025-03-01T16:00:00Z"),
  },
];

// 8 documents spread across tenants with different statuses, file types, and realistic names
export const mockDocuments: Document[] = [
  // Smith & Partners documents
  {
    id: "doc-smith-1",
    tenantId: "tenant-smith-partners",
    uploadedBy: "user-smith-admin",
    name: "Employee Handbook 2024.pdf",
    fileType: "pdf",
    fileUrl:
      "https://storage.googleapis.com/documind-assets/smith/employee-handbook-2024.pdf",
    status: "ready",
    createdAt: new Date("2024-01-16T10:00:00Z"),
  },
  {
    id: "doc-smith-2",
    tenantId: "tenant-smith-partners",
    uploadedBy: "user-smith-manager",
    name: "NDA Template.docx",
    fileType: "docx",
    fileUrl:
      "https://storage.googleapis.com/documind-assets/smith/nda-template.docx",
    status: "ready",
    createdAt: new Date("2024-02-05T15:30:00Z"),
  },
  {
    id: "doc-smith-3",
    tenantId: "tenant-smith-partners",
    uploadedBy: "user-smith-manager",
    name: "Litigation Strategy Draft.pdf",
    fileType: "pdf",
    fileUrl:
      "https://storage.googleapis.com/documind-assets/smith/litigation-strategy.pdf",
    status: "processing",
    createdAt: new Date("2026-06-27T11:00:00Z"), // uploading today
  },

  // MediCore Hospital documents
  {
    id: "doc-medicore-1",
    tenantId: "tenant-medicore",
    uploadedBy: "user-medicore-admin",
    name: "Patient Privacy Policy v3.pdf",
    fileType: "pdf",
    fileUrl:
      "https://storage.googleapis.com/documind-assets/medicore/privacy-policy-v3.pdf",
    status: "ready",
    createdAt: new Date("2023-08-21T09:15:00Z"),
  },
  {
    id: "doc-medicore-2",
    tenantId: "tenant-medicore",
    uploadedBy: "user-medicore-admin",
    name: "Standard Operating Procedures - ICU.docx",
    fileType: "docx",
    fileUrl:
      "https://storage.googleapis.com/documind-assets/medicore/sop-icu.docx",
    status: "ready",
    createdAt: new Date("2023-09-01T14:00:00Z"),
  },
  {
    id: "doc-medicore-3",
    tenantId: "tenant-medicore",
    uploadedBy: "user-medicore-viewer",
    name: "Medical Equipment Corrupted File.pdf",
    fileType: "pdf",
    fileUrl:
      "https://storage.googleapis.com/documind-assets/medicore/corrupted-file.pdf",
    status: "failed",
    createdAt: new Date("2024-05-15T11:20:00Z"),
  },

  // ByteStack Technologies documents
  {
    id: "doc-bytestack-1",
    tenantId: "tenant-bytestack",
    uploadedBy: "user-bytestack-manager",
    name: "Pitch Deck Series A.pdf",
    fileType: "pdf",
    fileUrl:
      "https://storage.googleapis.com/documind-assets/bytestack/pitch-deck-series-a.pdf",
    status: "ready",
    createdAt: new Date("2025-02-11T10:00:00Z"),
  },
  {
    id: "doc-bytestack-2",
    tenantId: "tenant-bytestack",
    uploadedBy: "user-bytestack-manager",
    name: "Technical Architecture Schema.docx",
    fileType: "docx",
    fileUrl:
      "https://storage.googleapis.com/documind-assets/bytestack/architecture-schema.docx",
    status: "ready",
    createdAt: new Date("2025-03-05T13:45:00Z"),
  },
];

// 5 conversations with realistic titles
export const mockConversations: Conversation[] = [
  // Smith & Partners
  {
    id: "conv-smith-1",
    tenantId: "tenant-smith-partners",
    userId: "user-smith-manager",
    title: "Explain clause 5 of the NDA",
    createdAt: new Date("2024-02-10T14:00:00Z"),
  },
  {
    id: "conv-smith-2",
    tenantId: "tenant-smith-partners",
    userId: "user-smith-admin",
    title: "What is our refund policy?",
    createdAt: new Date("2024-03-01T09:30:00Z"),
  },

  // MediCore Hospital
  {
    id: "conv-medicore-1",
    tenantId: "tenant-medicore",
    userId: "user-medicore-viewer",
    title: "ICU handoff protocol checklist",
    createdAt: new Date("2023-09-15T18:20:00Z"),
  },
  {
    id: "conv-medicore-2",
    tenantId: "tenant-medicore",
    userId: "user-medicore-admin",
    title: "Patient data disclosure exceptions",
    createdAt: new Date("2023-08-25T11:45:00Z"),
  },

  // ByteStack Technologies
  {
    id: "conv-bytestack-1",
    tenantId: "tenant-bytestack",
    userId: "user-bytestack-manager",
    title: "Our security hosting compliance details",
    createdAt: new Date("2025-02-15T16:10:00Z"),
  },
];

// 10 messages alternating between user and assistant roles with source citations
export const mockMessages: Message[] = [
  // Conversation: Explain clause 5 of the NDA (conv-smith-1)
  {
    id: "msg-1",
    conversationId: "conv-smith-1",
    role: "user",
    content:
      "Can you summarize clause 5 of the NDA Template and explain what happens if there is a breach?",
    sources: [],
    createdAt: new Date("2024-02-10T14:00:00Z"),
  },
  {
    id: "msg-2",
    conversationId: "conv-smith-1",
    role: "assistant",
    content:
      'Clause 5 of the NDA Template defines the "Remedies for Breach". According to this section:\n\n1. **Injunction Relief:** The disclosing party is entitled to seek an injunction or equitable relief to prevent unauthorized disclosure, without the requirement of posting a bond.\n2. **Monetary Damages:** The receiving party acknowledges that any breach will cause irreparable harm, and they can be held liable for actual monetary damages and associated legal fees.\n3. **Survival of Obligations:** These remedies survive the termination or expiration of the NDA for a period of five (5) years.',
    sources: [
      "NDA Template.docx - Section 5: Remedies for Breach",
      "NDA Template.docx - Section 8: Term and Survival",
    ],
    createdAt: new Date("2024-02-10T14:01:15Z"),
  },

  // Conversation: What is our refund policy? (conv-smith-2)
  {
    id: "msg-3",
    conversationId: "conv-smith-2",
    role: "user",
    content:
      "Do we have a standard policy regarding refund requests for legal consultations in the Employee Handbook?",
    sources: [],
    createdAt: new Date("2024-03-01T09:30:00Z"),
  },
  {
    id: "msg-4",
    conversationId: "conv-smith-2",
    role: "assistant",
    content:
      'Based on the Employee Handbook 2024, there is no direct refund policy for clients outlined because the handbook primarily governs internal staff operations. However, Section 4.2 touches upon "Billing Transparency" and states that any fee disputes or adjustment requests must be routed directly to the Managing Partner within 15 days of invoice issuance.',
    sources: [
      "Employee Handbook 2024.pdf - Section 4.2: Billing and Retainers",
    ],
    createdAt: new Date("2024-03-01T09:31:05Z"),
  },

  // Conversation: ICU handoff protocol checklist (conv-medicore-1)
  {
    id: "msg-5",
    conversationId: "conv-medicore-1",
    role: "user",
    content: "What is the mandatory checklist for patient handoffs in the ICU?",
    sources: [],
    createdAt: new Date("2023-09-15T18:20:00Z"),
  },
  {
    id: "msg-6",
    conversationId: "conv-medicore-1",
    role: "assistant",
    content:
      "According to the ICU Standard Operating Procedures, patient handoffs must follow the **I-PASS** mnemonic structure:\n\n1. **I (Illness Severity):** Classify the patient as stable, watcher, or unstable.\n2. **P (Patient Summary):** Provide a brief description of events, diagnoses, and current treatment plan.\n3. **A (Action List):** List specific to-do items and designate responsible personnel.\n4. **S (Situation Awareness):** Outline contingency plans for potential complications.\n5. **S (Synthesis by Receiver):** The receiving nurse/doctor must repeat back critical information to verify understanding.",
    sources: [
      "Standard Operating Procedures - ICU.docx - Page 12: Handover Protocol",
    ],
    createdAt: new Date("2023-09-15T18:21:30Z"),
  },

  // Conversation: Patient data disclosure exceptions (conv-medicore-2)
  {
    id: "msg-7",
    conversationId: "conv-medicore-2",
    role: "user",
    content:
      "Under what specific conditions can patient data be disclosed without consent under our privacy policy?",
    sources: [],
    createdAt: new Date("2023-08-25T11:45:00Z"),
  },
  {
    id: "msg-8",
    conversationId: "conv-medicore-2",
    role: "assistant",
    content:
      "Under the Patient Privacy Policy v3, patient health information (PHI) may be disclosed without explicit consent ONLY under the following strict exceptions:\n\n1. **Public Health Authorities:** Reporting of communicable diseases or vaccine-adverse reactions as mandated by law.\n2. **Judicial Proceedings:** Response to a court-issued subpoena or warrant.\n3. **Emergency Care:** When the patient is incapacitated and immediate access to medical history is critical to save their life.\n4. **Law Enforcement:** To help identify or locate a suspect, fugitive, or missing person.",
    sources: [
      "Patient Privacy Policy v3.pdf - Section 2.4: Permitted Unconsented Disclosures",
    ],
    createdAt: new Date("2023-08-25T11:46:12Z"),
  },

  // Conversation: Our security hosting compliance details (conv-bytestack-1)
  {
    id: "msg-9",
    conversationId: "conv-bytestack-1",
    role: "user",
    content:
      "What security compliances do we guarantee to clients regarding our hosting providers in our Series A deck?",
    sources: [],
    createdAt: new Date("2025-02-15T16:10:00Z"),
  },
  {
    id: "msg-10",
    conversationId: "conv-bytestack-1",
    role: "assistant",
    content:
      "In the Pitch Deck Series A, we highlight that our primary cloud infrastructure is hosted in multi-region setups featuring:\n\n- **SOC 2 Type II Certified** data centers.\n- **ISO 27001** alignment for data security management.\n- **End-to-end data encryption** both in transit (TLS 1.3) and at rest (AES-256).",
    sources: [
      "Pitch Deck Series A.pdf - Slide 14: Infrastructure & Security Core",
    ],
    createdAt: new Date("2025-02-15T16:11:40Z"),
  },
];

// Current limits for each plan tier
export const mockPlanLimits: Record<string, PlanLimits> = {
  free: {
    maxDocuments: 5,
    maxUsers: 3,
    maxQuestionsPerMonth: 50,
    maxStorageGB: 0.5,
  },
  pro: {
    maxDocuments: 100,
    maxUsers: 15,
    maxQuestionsPerMonth: 1000,
    maxStorageGB: 10,
  },
  enterprise: {
    maxDocuments: 10000,
    maxUsers: 500,
    maxQuestionsPerMonth: 50000,
    maxStorageGB: 500,
  },
};

// Usage stats for each tenant keyed by tenantId
export const mockUsageStats: Record<string, UsageStats> = {
  "tenant-smith-partners": {
    documentsCount: 3,
    usersCount: 2,
    questionsThisMonth: 420,
    storageUsedGB: 1.2,
  },
  "tenant-medicore": {
    documentsCount: 3,
    usersCount: 2,
    questionsThisMonth: 8500,
    storageUsedGB: 12.5,
  },
  "tenant-bytestack": {
    documentsCount: 2,
    usersCount: 2,
    questionsThisMonth: 35,
    storageUsedGB: 0.12,
  },
};

// Billing records for tenants
export const mockBillingRecords: BillingRecord[] = [
  {
    id: "bill-smith-1",
    tenantId: "tenant-smith-partners",
    amount: 79.0,
    status: "paid",
    date: new Date("2026-06-15T08:00:00Z"),
    invoiceUrl: "https://billing.stripe.com/pdf/inv_smith_062026",
  },
  {
    id: "bill-smith-2",
    tenantId: "tenant-smith-partners",
    amount: 79.0,
    status: "pending",
    date: new Date("2026-06-25T08:00:00Z"),
    invoiceUrl: "https://billing.stripe.com/pdf/inv_smith_072026_pending",
  },
  {
    id: "bill-medicore-1",
    tenantId: "tenant-medicore",
    amount: 499.0,
    status: "paid",
    date: new Date("2026-06-01T09:00:00Z"),
    invoiceUrl: "https://billing.stripe.com/pdf/inv_medicore_062026",
  },
  {
    id: "bill-bytestack-1",
    tenantId: "tenant-bytestack",
    amount: 0.0,
    status: "paid",
    date: new Date("2026-06-10T10:00:00Z"),
    invoiceUrl: "https://billing.stripe.com/pdf/inv_bytestack_free",
  },
];
