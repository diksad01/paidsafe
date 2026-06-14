import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type {
  Contract,
  ContractStatus,
  CreateContractInput,
  DashboardStats,
  Milestone,
  MilestoneStatus,
} from "../types/contract";

const COLLECTION = "contracts";
const MILESTONES_SUB = "milestones";

const fromTimestamp = (value: unknown): string => {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
};

const fetchMilestones = async (contractId: string): Promise<Milestone[]> => {
  const snap = await getDocs(
    collection(db, COLLECTION, contractId, MILESTONES_SUB)
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title as string,
      description: (data.description as string) ?? "",
      amount: data.amount as number,
      status: ((data.status as MilestoneStatus) ?? "PENDING"),
      order: (data.order as number) ?? 0,
    };
  });
};

const deserializeContract = async (
  id: string,
  data: Record<string, unknown>
): Promise<Contract> => {
  const milestones = await fetchMilestones(id);
  return {
    id,
    freelancerId: data.freelancerId as string,
    title: data.title as string,
    clientEmail: data.clientEmail as string,
    description: (data.description as string) ?? "",
    status: data.status as ContractStatus,
    totalAmount: data.totalAmount as number,
    milestones,
    createdAt: fromTimestamp(data.createdAt),
    updatedAt: fromTimestamp(data.updatedAt),
  };
};

export const createContract = async (
  freelancerId: string,
  input: CreateContractInput
): Promise<string> => {
  const totalAmount = input.milestones.reduce((sum, m) => sum + m.amount, 0);

  const ref = await addDoc(collection(db, COLLECTION), {
    freelancerId,
    title: input.title,
    clientEmail: input.clientEmail,
    description: input.description,
    status: "PENDING_CLIENT" as ContractStatus,
    totalAmount,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const milestonesCol = collection(db, COLLECTION, ref.id, MILESTONES_SUB);
  for (const m of input.milestones) {
    await addDoc(milestonesCol, {
      title: m.title,
      description: m.description ?? "",
      amount: m.amount,
      status: "PENDING" as MilestoneStatus,
      order: m.order ?? 0,
      createdAt: serverTimestamp(),
    });
  }

  return ref.id;
};

export const getContractById = async (
  id: string
): Promise<Contract | null> => {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return deserializeContract(snap.id, snap.data() as Record<string, unknown>);
};

export const getContractsByOwner = async (
  uid: string
): Promise<Contract[]> => {
  const q = query(
    collection(db, COLLECTION),
    where("freelancerId", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  const contracts = await Promise.all(
    snap.docs.map((d) =>
      deserializeContract(d.id, d.data() as Record<string, unknown>)
    )
  );
  return contracts;
};

export const updateContractStatus = async (
  contractId: string,
  status: ContractStatus
): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, contractId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const updateMilestoneStatus = async (
  contractId: string,
  milestoneId: string,
  status: MilestoneStatus
): Promise<void> => {
  await updateDoc(
    doc(db, COLLECTION, contractId, MILESTONES_SUB, milestoneId),
    {
      status,
      updatedAt: serverTimestamp(),
    }
  );
};

export const computeDashboardStats = (
  contracts: Contract[]
): DashboardStats => {
  let inEscrow = 0;
  let released = 0;
  let pendingApproval = 0;
  let active = 0;
  let pending = 0;
  let completed = 0;

  for (const contract of contracts) {
    const cStatus = contract.status ? contract.status.toLowerCase() : "";
    if (cStatus === "active") {
      active++;
    } else if (cStatus === "completed" || cStatus === "complete") {
      completed++;
    } else {
      pending++;
    }

    for (const milestone of contract.milestones) {
      const mStatus = milestone.status ? milestone.status.toLowerCase() : "";
      if (mStatus === "released" || mStatus === "approved") {
        released += milestone.amount;
      } else {
        inEscrow += milestone.amount;
      }
      if (mStatus === "in_review" || mStatus === "complete") {
        pendingApproval += 1;
      }
    }
  }

  return {
    totalContracts: contracts.length,
    inEscrow,
    released,
    pendingApproval,
    total: contracts.length,
    active,
    pending,
    completed,
  };
};