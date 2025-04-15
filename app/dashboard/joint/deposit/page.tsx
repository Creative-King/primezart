"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function JointAccountDepositPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    amount: "",
    sourceAccount: "",
    description: "",
    depositMethod: "transfer",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [depositComplete, setDepositComplete] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate deposit processing
    setTimeout(() => {
      setIsSubmitting(false)
      setDepositComplete(true)
    }, 2000)
  }

  if (depositComplete) {
    return (
      <div className="container max-w-md mx-auto py-8">
        <Card className="w-full">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-xl font-semibold">Deposit Complete</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Deposit Successful</h2>
            <p className="text-gray-600 text-center mb-4">
              Your deposit to the joint account has been processed successfully.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg w-full mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">${formData.amount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Reference:</span>
                <span className="font-medium">JNT-{Math.floor(Math.random() * 1000000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-4 w-full">
              <Button variant="outline" className="flex-1" onClick={() => router.push("/dashboard/joint")}>
                Back to Account
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setDepositComplete(false)}>
                New Deposit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-8">
      <Card className="w-full">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-xl">Deposit to Joint Account</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="amount">Deposit Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  name="amount"
                  className="pl-8"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="sourceAccount">Source Account</Label>
              <Select
                onValueChange={(value) => handleSelectChange("sourceAccount", value)}
                value={formData.sourceAccount}
              >
                <SelectTrigger id="sourceAccount">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Personal Checking Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="external">External Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <Label htmlFor="depositMethod">Deposit Method</Label>
              <RadioGroup
                defaultValue="transfer"
                className="flex flex-col gap-2 mt-2"
                onValueChange={(value) => handleSelectChange("depositMethod", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer" className="cursor-pointer">
                    Account Transfer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="check" id="check" />
                  <Label htmlFor="check" className="cursor-pointer">
                    Check Deposit
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wire" id="wire" />
                  <Label htmlFor="wire" className="cursor-pointer">
                    Wire Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.depositMethod === "check" && (
              <div className="mb-4">
                <Label htmlFor="checkImage">Check Image Upload</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                  <Input id="checkImage" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("checkImage")?.click()}
                  >
                    Select File
                  </Button>
                  {file && <p className="mt-2 text-sm text-green-600">{file.name} selected</p>}
                </div>
              </div>
            )}

            <div className="mb-6">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add a note about this deposit"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/dashboard/joint")}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Deposit Funds"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
