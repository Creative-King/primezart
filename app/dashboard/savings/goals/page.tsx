"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Calendar, Trash2, Edit, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FloatingRadialMenu from "@/components/floating-radial-menu"

// Mock data
const savingsGoals = [
  {
    id: "goal1",
    name: "Emergency Fund",
    target: 10000,
    current: 8500,
    deadline: "2024-12-31",
    color: "#22c55e",
    description: "Three months of living expenses for emergencies",
  },
  {
    id: "goal2",
    name: "Vacation",
    target: 5000,
    current: 2750,
    deadline: "2025-06-30",
    color: "#6366f1",
    description: "Summer vacation to Europe",
  },
  {
    id: "goal3",
    name: "New Car",
    target: 25000,
    current: 12500,
    deadline: "2026-01-15",
    color: "#f59e0b",
    description: "Down payment for a new hybrid vehicle",
  },
  {
    id: "goal4",
    name: "Home Down Payment",
    target: 50000,
    current: 15000,
    deadline: "2027-05-20",
    color: "#ec4899",
    description: "20% down payment for first home purchase",
  },
]

export default function SavingsGoalsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [goals, setGoals] = useState(savingsGoals)
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    current: "",
    deadline: "",
    description: "",
  })

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const calculatePercentage = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  const calculateDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const handleAddGoal = () => {
    // Validate form
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) {
      return
    }

    // Create new goal
    const goal = {
      id: `goal${goals.length + 1}`,
      name: newGoal.name,
      target: Number.parseFloat(newGoal.target),
      current: Number.parseFloat(newGoal.current) || 0,
      deadline: newGoal.deadline,
      color: ["#22c55e", "#6366f1", "#f59e0b", "#ec4899"][Math.floor(Math.random() * 4)],
      description: newGoal.description,
    }

    // Add to goals
    setGoals([...goals, goal])

    // Reset form
    setNewGoal({
      name: "",
      target: "",
      current: "",
      deadline: "",
      description: "",
    })

    // Close dialog
    setShowAddGoalDialog(false)
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/savings")} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Savings Goals</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
            <p className="text-gray-600">Track and manage your financial goals</p>
          </div>
          <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Savings Goal</DialogTitle>
                <DialogDescription>Set a new financial goal to help you save for what matters most.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    placeholder="e.g., Vacation Fund"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="target">Target Amount</Label>
                  <Input
                    id="target"
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    placeholder="5000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="current">Current Amount (optional)</Label>
                  <Input
                    id="current"
                    type="number"
                    value={newGoal.current}
                    onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Target Date</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="What are you saving for?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddGoalDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGoal} className="bg-green-600 hover:bg-green-700">
                  Create Goal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden">
              <div className="h-2" style={{ backgroundColor: goal.color }}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{goal.name}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-1">
                  <span>{formatCurrency(goal.current)}</span>
                  <span>{formatCurrency(goal.target)}</span>
                </div>
                <Progress
                  value={calculatePercentage(goal.current, goal.target)}
                  max={100}
                  className="h-2 bg-gray-100"
                  indicatorClassName={`bg-[${goal.color}]`}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{calculatePercentage(goal.current, goal.target)}% complete</span>
                  <span>{formatCurrency(goal.target - goal.current)} to go</span>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{calculateDaysRemaining(goal.deadline)} days remaining</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                    Add Funds
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Menu */}
      <FloatingRadialMenu type="savings" />
    </div>
  )
}
