"use client"
import { z } from "zod"

// Mock account data
const accounts = [
  { id: "acc1", name: "Premium Checking", number: "****4532", balance: 12435.67, type: "checking" },
  { id: "acc2", name: "Premium Savings", number: "****7890", balance: 34521.89, type: "savings" },
  { id: "acc3", name: "Investment Portfolio", number: "****2341", balance: 98765.43, type: "investment" },
]

// Mock savings goals
const savingsGoals = [
  {
    id: "goal1",
    name: "Vacation Fund",
    target: 5000,
    current: 2500,
    deadline: "2023-12-31",
    icon: "🏝️",
    monthlyContribution: 250,
    projectedCompletion: "2023-12-15",
    interestRate: 1.5,
  },
  {
    id: "goal2",
    name: "New Car",
    target: 25000,
    current: 8750,
    deadline: "2024-06-30",
    icon: "🚗",
    monthlyContribution: 1000,
    projectedCompletion: "2024-05-15",
    interestRate: 1.5,
  },
  {
    id: "goal3",
    name: "Emergency Fund",
    target: 15000,
    current: 12000,
    deadline: "2023-09-30",
    icon: "🛟",
    monthlyContribution: 500,
    projectedCompletion: "2023-09-01",
    interestRate: 1.5,
  },
  {
    id: "goal4",
    name: "Home Down Payment",
    target: 50000,
    current: 15000,
    deadline: "2025-01-31",
    icon: "🏠",
    monthlyContribution: 1500,
    projectedCompletion: "2024-12-15",
    interestRate: 1.5,
  },
]

// Form schema for adding funds to a goal
const addFundsSchema = z.object({
  goal: z.string().min(1, "Please select a savings goal"),
  fromAccount: z.string().min(1\
