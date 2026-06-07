export type ContractStatus = "draft" | "active" | "completed" | "disputed";

export type MilestoneStatus = "pending" | "in_review" | "released";

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