export type ContractStatus =
  | "draft"
  | "active"
  | "completed"
  | "disputed"
  | "PENDING_CLIENT"
  | "ACTIVE"
  | "COMPLETED"
  | "DISPUTED";

export type MilestoneStatus =
  | "pending"
  | "PENDING"
  | "in_review"
  | "released"
  | "FUNDED"
  | "AWAITING_APPROVAL"
  | "RELEASED"
  | "DISPUTED";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  order: number;
}

export interface Contract {
  id: string;
  freelancerId: string;
  title: string;
  clientEmail: string;
  description: string;
  status: ContractStatus;
  totalAmount: number;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractInput {
  title: string;
  clientEmail: string;
  description: string;
  milestones: Omit<Milestone, "id" | "status">[];
}

export interface DashboardStats {
  totalContracts: number;
  inEscrow: number;
  released: number;
  pendingApproval: number;
  total: number;
  active: number;
  pending: number;
  completed: number;
}