"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Search, Edit, Trash2, Check, Building, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AdminSidebar from "@/components/admin/admin-sidebar"

// Define form schema
const bankFormSchema = z.object({
  name: z.string().min(1, "Bank name is required"),
  country: z.string().min(1, "Country is required"),
  swiftCode: z.string().optional(),
  routingNumber: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]).default("active"),
})

// Mock data for countries
const countries = [
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "MX", name: "Mexico" },
  { code: "RU", name: "Russia" },
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
]

// Mock data for banks
const initialBanks = [
  {
    id: "bank1",
    name: "Chase Bank",
    country: "US",
    swiftCode: "CHASUS33",
    routingNumber: "021000021",
    address: "270 Park Avenue, New York, NY 10017, USA",
    website: "https://www.chase.com",
    status: "active",
  },
  {
    id: "bank2",
    name: "Bank of America",
    country: "US",
    swiftCode: "BOFAUS3N",
    routingNumber: "026009593",
    address: "100 North Tryon Street, Charlotte, NC 28255, USA",
    website: "https://www.bankofamerica.com",
    status: "active",
  },
  {
    id: "bank3",
    name: "HSBC UK",
    country: "GB",
    swiftCode: "MIDLGB22",
    routingNumber: "",
    address: "8 Canada Square, London E14 5HQ, UK",
    website: "https://www.hsbc.co.uk",
    status: "active",
  },
  {
    id: "bank4",
    name: "Deutsche Bank",
    country: "DE",
    swiftCode: "DEUTDEFF",
    routingNumber: "",
    address: "Taunusanlage 12, 60325 Frankfurt am Main, Germany",
    website: "https://www.db.com",
    status: "active",
  },
  {
    id: "bank5",
    name: "BNP Paribas",
    country: "FR",
    swiftCode: "BNPAFRPP",
    routingNumber: "",
    address: "16 Boulevard des Italiens, 75009 Paris, France",
    website: "https://www.bnpparibas.com",
    status: "active",
  },
]

export default function AdminBanksPage() {
  const [banks, setBanks] = useState(initialBanks)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBank, setCurrentBank] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Initialize form for adding/editing banks
  const form = useForm<z.infer<typeof bankFormSchema>>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      name: "",
      country: "",
      swiftCode: "",
      routingNumber: "",
      address: "",
      website: "",
      status: "active",
    },
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isAddDialogOpen && !isEditDialogOpen) {
      form.reset()
    }
  }, [isAddDialogOpen, isEditDialogOpen, form])

  // Set form values when editing a bank
  useEffect(() => {
    if (currentBank && isEditDialogOpen) {
      form.setValue("name", currentBank.name)
      form.setValue("country", currentBank.country)
      form.setValue("swiftCode", currentBank.swiftCode || "")
      form.setValue("routingNumber", currentBank.routingNumber || "")
      form.setValue("address", currentBank.address || "")
      form.setValue("website", currentBank.website || "")
      form.setValue("status", currentBank.status)
    }
  }, [currentBank, isEditDialogOpen, form])

  // Filter banks based on search query and filters
  const filteredBanks = banks.filter((bank) => {
    const matchesSearch =
      searchQuery === "" ||
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.swiftCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      countries
        .find((c) => c.code === bank.country)
        ?.name.toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesCountry = countryFilter === "" || bank.country === countryFilter
    const matchesStatus = statusFilter === "" || bank.status === statusFilter

    return matchesSearch && matchesCountry && matchesStatus
  })

  // Handle adding a new bank
  const handleAddBank = (values: z.infer<typeof bankFormSchema>) => {
    try {
      const newBank = {
        id: `bank${banks.length + 1}`,
        ...values,
      }

      setBanks([...banks, newBank])
      setIsAddDialogOpen(false)
      setSuccessMessage("Bank added successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error adding bank:", error)
      setErrorMessage("Failed to add bank. Please try again.")

      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("")
      }, 3000)
    }
  }

  // Handle editing a bank
  const handleEditBank = (values: z.infer<typeof bankFormSchema>) => {
    try {
      const updatedBanks = banks.map((bank) => (bank.id === currentBank.id ? { ...bank, ...values } : bank))

      setBanks(updatedBanks)
      setIsEditDialogOpen(false)
      setSuccessMessage("Bank updated successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error updating bank:", error)
      setErrorMessage("Failed to update bank. Please try again.")

      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("")
      }, 3000)
    }
  }

  // Handle deleting a bank
  const handleDeleteBank = () => {
    try {
      const updatedBanks = banks.filter((bank) => bank.id !== currentBank.id)

      setBanks(updatedBanks)
      setIsDeleteDialogOpen(false)
      setSuccessMessage("Bank deleted successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error deleting bank:", error)
      setErrorMessage("Failed to delete bank. Please try again.")

      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("")
      }, 3000)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Bank Management</h1>
          <p className="text-gray-500">Manage banks for international transfers</p>
        </div>

        {/* Success and Error Messages */}
        {successMessage && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search banks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Bank
            </Button>
          </div>
        </div>

        {/* Banks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Banks</CardTitle>
            <CardDescription>
              {filteredBanks.length} {filteredBanks.length === 1 ? "bank" : "banks"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Bank Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Country</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">SWIFT/BIC</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBanks.length > 0 ? (
                    filteredBanks.map((bank) => (
                      <tr key={bank.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{bank.name}</td>
                        <td className="py-3 px-4">
                          {countries.find((c) => c.code === bank.country)?.name || bank.country}
                        </td>
                        <td className="py-3 px-4">{bank.swiftCode || "-"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              bank.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {bank.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentBank(bank)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentBank(bank)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500">
                        No banks found. Try adjusting your filters or add a new bank.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add Bank Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Bank</DialogTitle>
              <DialogDescription>Add a new bank to the system for international transfers</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddBank)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="swiftCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SWIFT/BIC Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SWIFT code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter routing number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank website" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Bank</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Bank Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Bank</DialogTitle>
              <DialogDescription>Update bank information</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditBank)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="swiftCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SWIFT/BIC Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SWIFT code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter routing number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank website" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Bank</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Bank Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Bank</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this bank? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {currentBank && (
              <div className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Building className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{currentBank.name}</h3>
                    <p className="text-sm text-gray-500">
                      {countries.find((c) => c.code === currentBank.country)?.name || currentBank.country}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteBank}>
                Delete Bank
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
