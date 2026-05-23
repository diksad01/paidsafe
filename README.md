
# PaidSafe


AI-Powered Escrow Infrastructure for Africa's Freelance Economy

PaidSafe is a web-based escrow and contract automation platform designed to protect African freelancers and remote workers from client non-payment and project ghosting.

Unlike traditional freelance marketplaces, PaidSafe is not built to help users find jobs. It acts as a trust and payment protection layer for freelance work that already happens outside platforms — through WhatsApp, Instagram, LinkedIn, referrals, and direct client relationships.

## The Problem

Across Africa, millions of freelancers work informally without enforceable contracts, secure payment systems, escrow protection, or dispute resolution infrastructure. Freelancers frequently deliver completed work only to get ignored, delayed, or never paid.

PaidSafe solves this by creating a trust infrastructure layer for Africa's informal digital economy.

## How It Works

1. Freelancer describes the project in plain English
2. AI engine generates a structured milestone-based contract
3. Client receives a link, reviews terms, and agrees
4. Client deposits the first milestone payment into escrow via Flutterwave
5. Freelancer delivers the work and marks the milestone complete
6. Client approves — payment releases automatically (98% to freelancer, 2% platform fee)
7. Cycle repeats for each milestone until project is complete

## Dispute Handling

When a client raises a dispute instead of approving a milestone:
- The milestone is immediately frozen — no money moves in either direction
- A 48-hour resolution window opens for both parties
- The freelancer's submitted proof of delivery is held on record
- If unresolved after 48 hours, a PaidSafe admin reviews the evidence and manually triggers either release or refund
- All decisions are logged against the contract record
Automated AI-assisted arbitration is planned for a future version.

## Key Features
- AI-generated milestone contracts from plain English input
- Escrow-based payment protection via Flutterwave
- Milestone tracking and automated payment release
- Dispute handling with frozen escrow and admin resolution
- Freelancer and client dashboards
- Real-time payment notifications via email
- Mobile-first, cross-device browser support
- No app download required

## What Makes PaidSafe Different

Upwork and Fiverr help people find jobs. PaidSafe protects payments for the clients you already have.

It works for:
- WhatsApp deals
- Instagram clients
- Referral work
- Local agency projects
- Direct remote contracts

No platform lock-in. No 20% cut. Just a shareable link.


## Tech Stack

| Layer | Tool | Free Tier |
|---|---|---|
| Frontend | React + Vite + TypeScript | Vercel free |
| Styling | Tailwind CSS | Open source |
| State | Zustand | Open source |
| Backend | Node.js + Express | Railway free |
| Database + Auth | Firebase (Firestore + Auth) | Spark plan free |
| Payments | Flutterwave | Free to integrate |
| AI Agent | OpenRouter — DeepSeek R1 | Free tier |
| Email | Resend | 3K emails/mo free |
| Error Tracking | Sentry | 5K errors/mo free |
| CI/CD | GitHub Actions | Free for public repos |

## Project Structure

paidsafe/
├── frontend/     # React + Vite app
├── backend/      # Node.js + Express API
└── README.md


## The Crew — Meridian

| Name | Country | Role |
|---|---|--------|
| Saddiq | Nigeria | Crew Lead · Architecture · Backend Support |
| Mohamed | Kenya | Frontend Lead |@M-khalifa8103
| Remla | Ethiopia | Backend Lead |


## Running Locally
 Week 1 — project is in setup phase. Full local setup instructions will be added in Week 2 once the first build is live.

## Mission
To become the trusted payment and contract infrastructure powering Africa's growing freelance and creator economy.

## The Build

This project is part of **The Build** — a six-week public shipment cycle by NSK AI and The Udara Project 2026.

Crew: **Meridian** · Started: 20 May 2026



Add this:

First, commit it with the message `docs: update README with dispute flow and full product description`
