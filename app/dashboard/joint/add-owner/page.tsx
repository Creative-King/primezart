import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, UserPlus, Info, Shield } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function AddAccountOwnerPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/joint">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add Account Owner</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Joint Account Owner
          </CardTitle>
          <CardDescription>
            Add a new owner to your joint account. They will have access based on the permissions you set.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter street address" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="State" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" placeholder="ZIP Code" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Access Permissions</h3>
            </div>

            <div className="space-y-2">
              <Label>Access Level</Label>
              <RadioGroup defaultValue="full">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="font-normal">
                    Full Access (Same as Primary Owner)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <Label htmlFor="limited" className="font-normal">
                    Limited Access (Customized Permissions)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="view" id="view" />
                  <Label htmlFor="view" className="font-normal">
                    View Only (No Transaction Capabilities)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2 border p-4 rounded-md">
              <Label className="text-sm font-medium">Specific Permissions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  { id: "withdraw", label: "Withdraw Funds" },
                  { id: "deposit", label: "Deposit Funds" },
                  { id: "transfer", label: "Make Transfers" },
                  { id: "statements", label: "View Statements" },
                  { id: "settings", label: "Change Account Settings" },
                  { id: "owners", label: "Manage Other Owners" },
                  { id: "cards", label: "Request/Manage Cards" },
                  { id: "beneficiaries", label: "Set Beneficiaries" },
                ].map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox id={permission.id} />
                    <Label htmlFor={permission.id} className="font-normal text-sm">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Transaction Limits</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit" className="text-sm">
                    Daily Withdrawal Limit
                  </Label>
                  <Input id="dailyLimit" placeholder="Enter amount" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit" className="text-sm">
                    Monthly Transfer Limit
                  </Label>
                  <Input id="monthlyLimit" placeholder="Enter amount" type="number" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="font-normal text-sm">
                I confirm that I have the legal authority to add this person as an account owner and that all
                information provided is accurate.
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="notify" />
              <Label htmlFor="notify" className="font-normal text-sm">
                Send email notification to the new account owner
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/dashboard/joint/users">Cancel</Link>
          </Button>
          <Button className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Account Owner
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-4 bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800">Important Information</h4>
              <p className="text-sm text-amber-700 mt-1">
                Adding a new account owner is a significant action that grants another person access to your funds. Make
                sure you trust this individual and understand the permissions you are granting them.
              </p>
              <p className="text-sm text-amber-700 mt-2">
                The new account owner will need to complete identity verification before gaining access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
