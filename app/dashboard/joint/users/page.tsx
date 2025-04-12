"use client"
import { Shield, AlertTriangle, Settings, Mail, Phone } from "lucide-react"
import { UserPlusIcon, UserMinusIcon, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import FloatingMenu from "@/components/floating-menu"

// Mock data for joint account users
// const mockUsers = [
//   {
//     id: "user1",
//     name: "Kayla Jones",
//     email: "kayla.jones@example.com",
//     role: "Primary",
//     status: "Active",
//     permissions: ["View", "Transfer", "Deposit", "Withdraw", "Manage Users"],
//     lastActivity: "2024-11-20T14:30:00",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "user2",
//     name: "Thomas Wilson",
//     email: "thomas.wilson@example.com",
//     role: "Co-owner",
//     status: "Active",
//     permissions: ["View", "Transfer", "Deposit", "Withdraw"],
//     lastActivity: "2024-11-19T09:15:00",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "user3",
//     name: "Rebecca Martinez",
//     email: "rebecca.martinez@example.com",
//     role: "Authorized User",
//     status: "Active",
//     permissions: ["View", "Transfer", "Deposit"],
//     lastActivity: "2024-11-18T16:45:00",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "user4",
//     name: "Michael Johnson",
//     email: "michael.johnson@example.com",
//     role: "Authorized User",
//     status: "Pending",
//     permissions: ["View"],
//     lastActivity: null,
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
// ]

// // Mock data for pending invitations
// const mockInvitations = [
//   {
//     id: "inv1",
//     email: "sarah.brown@example.com",
//     role: "Authorized User",
//     sentDate: "2024-11-19T10:30:00",
//     expiryDate: "2024-11-26T10:30:00",
//     status: "Pending",
//   },
//   {
//     id: "inv2",
//     email: "david.clark@example.com",
//     role: "Co-owner",
//     sentDate: "2024-11-18T14:15:00",
//     expiryDate: "2024-11-25T14:15:00",
//     status: "Pending",
//   },
// ]

// // Mock data for activity logs
// const mockActivityLogs = [
//   {
//     id: "log1",
//     user: "Kayla Jones",
//     action: "Added Rebecca Martinez as an Authorized User",
//     timestamp: "2024-11-15T09:30:00",
//   },
//   {
//     id: "log2",
//     user: "Thomas Wilson",
//     action: "Changed permissions for Rebecca Martinez",
//     timestamp: "2024-11-16T14:45:00",
//   },
//   {
//     id: "log3",
//     user: "Kayla Jones",
//     action: "Sent invitation to Michael Johnson",
//     timestamp: "2024-11-17T11:20:00",
//   },
//   {
//     id: "log4",
//     user: "System",
//     action: "Michael Johnson accepted invitation",
//     timestamp: "2024-11-18T16:30:00",
//   },
//   {
//     id: "log5",
//     user: "Kayla Jones",
//     action: "Sent invitation to Sarah Brown",
//     timestamp: "2024-11-19T10:30:00",
//   },
//   {
//     id: "log6",
//     user: "Thomas Wilson",
//     action: "Sent invitation to David Clark",
//     timestamp: "2024-11-18T14:15:00",
//   },
// ]

// export default function ManageJointAccountUsers() {
//   const router = useRouter()
//   const [users, setUsers] = useState(mockUsers)
//   const [invitations, setInvitations] = useState(mockInvitations)
//   const [activityLogs, setActivityLogs] = useState(mockActivityLogs)
//   const [isClient, setIsClient] = useState(false)
//   const [showAddUserDialog, setShowAddUserDialog] = useState(false)
//   const [showEditUserDialog, setShowEditUserDialog] = useState(false)
//   const [showRemoveUserDialog, setShowRemoveUserDialog] = useState(false)
//   const [selectedUser, setSelectedUser] = useState<any>(null)
//   const [showCancelInviteDialog, setShowCancelInviteDialog] = useState(false)
//   const [selectedInvitation, setSelectedInvitation] = useState<any>(null)
//   const [lastLogin, setLastLogin] = useState("Today, 09:15 AM")

//   // Form states for adding new user
//   const [newUserEmail, setNewUserEmail] = useState("")
//   const [newUserRole, setNewUserRole] = useState("Authorized User")
//   const [newUserPermissions, setNewUserPermissions] = useState<string[]>(["View"])

//   useEffect(() => {
//     setIsClient(true)

//     // Check if user is logged in
//     const isLoggedIn = localStorage.getItem("isLoggedIn")
//     if (!isLoggedIn) {
//       router.push("/login")
//     }

//     // Store account mode in localStorage
//     if (typeof window !== "undefined") {
//       localStorage.setItem("accountMode", "joint")
//     }
//   }, [router])

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return "N/A"
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
//   }

//   const formatTime = (dateString: string | null) => {
//     if (!dateString) return ""
//     const date = new Date(dateString)
//     return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
//   }

//   const formatDateTime = (dateString: string | null) => {
//     if (!dateString) return "N/A"
//     return `${formatDate(dateString)} at ${formatTime(dateString)}`
//   }

//   const handleAddUser = () => {
//     // In a real app, this would send an invitation to the email
//     const newInvitation = {
//       id: `inv${invitations.length + 1}`,
//       email: newUserEmail,
//       role: newUserRole,
//       sentDate: new Date().toISOString(),
//       expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
//       status: "Pending",
//     }

//     setInvitations([newInvitation, ...invitations])

//     // Add to activity logs
//     const newLog = {
//       id: `log${activityLogs.length + 1}`,
//       user: "Kayla Jones", // Current user
//       action: `Sent invitation to ${newUserEmail}`,
//       timestamp: new Date().toISOString(),
//     }
//     setActivityLogs([newLog, ...activityLogs])

//     // Reset form and close dialog
//     setNewUserEmail("")
//     setNewUserRole("Authorized User")
//     setNewUserPermissions(["View"])
//     setShowAddUserDialog(false)
//   }

//   const handleEditUser = () => {
//     if (!selectedUser) return

//     // Update user in the list
//     const updatedUsers = users.map((user) => {
//       if (user.id === selectedUser.id) {
//         return {
//           ...user,
//           role: selectedUser.role,
//           permissions: selectedUser.permissions,
//         }
//       }
//       return user
//     })

//     setUsers(updatedUsers)

//     // Add to activity logs
//     const newLog = {
//       id: `log${activityLogs.length + 1}`,
//       user: "Kayla Jones", // Current user
//       action: `Updated permissions for ${selectedUser.name}`,
//       timestamp: new Date().toISOString(),
//     }
//     setActivityLogs([newLog, ...activityLogs])

//     setShowEditUserDialog(false)
//   }

//   const handleRemoveUser = () => {
//     if (!selectedUser) return

//     // Remove user from the list
//     const updatedUsers = users.filter((user) => user.id !== selectedUser.id)
//     setUsers(updatedUsers)

//     // Add to activity logs
//     const newLog = {
//       id: `log${activityLogs.length + 1}`,
//       user: "Kayla Jones", // Current user
//       action: `Removed ${selectedUser.name} from the account`,
//       timestamp: new Date().toISOString(),
//     }
//     setActivityLogs([newLog, ...activityLogs])

//     setShowRemoveUserDialog(false)
//   }

//   const handleCancelInvitation = () => {
//     if (!selectedInvitation) return

//     // Remove invitation from the list
//     const updatedInvitations = invitations.filter((inv) => inv.id !== selectedInvitation.id)
//     setInvitations(updatedInvitations)

//     // Add to activity logs
//     const newLog = {
//       id: `log${activityLogs.length + 1}`,
//       user: "Kayla Jones", // Current user
//       action: `Cancelled invitation to ${selectedInvitation.email}`,
//       timestamp: new Date().toISOString(),
//     }
//     setActivityLogs([newLog, ...activityLogs])

//     setShowCancelInviteDialog(false)
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn")
//     router.push("/login")
//   }

//   if (!isClient) {
//     return null // Prevent hydration mismatch
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Top Navigation Bar */}
//       <div className="border-b border-gray-200 bg-white">
//         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//           <div className="flex items-center space-x-6">
//             <Link
//               href="/dashboard"
//               className="flex items-center text-gray-500 font-medium hover:text-blue-600 transition-colors"
//             >
//               <Users className="h-5 w-5 mr-2" />
//               <span>Personal</span>
//             </Link>
//             <Link
//               href="/dashboard/business"
//               className="flex items-center text-gray-500 font-medium hover:text-blue-600 transition-colors"
//             >
//               <Building2 className="h-5 w-5 mr-2" />
//               <span>Business</span>
//             </Link>
//             <Link href="/dashboard/joint" className="flex items-center text-indigo-600 font-medium">
//               <Users className="h-5 w-5 mr-2" />
//               <span>Joint</span>
//             </Link>
//             <Link
//               href="/dashboard/savings"
//               className="flex items-center text-gray-500 font-medium hover:text-blue-600 transition-colors"
//             >
//               <PiggyBank className="h-5 w-5 mr-2" />
//               <span>Savings</span>
//             </Link>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="text-sm text-gray-500">Last login: {lastLogin}</div>
//             <div className="h-4 w-px bg-gray-200 mx-2"></div>
//             <button
//               onClick={handleLogout}
//               className="text-gray-500 font-medium flex items-center hover:text-blue-600 transition-colors"
//             >
//               Sign Out <span className="ml-1">↗</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-4 md:p-8">
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <div className="flex items-center mb-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="mr-2 p-0 h-8 w-8"
//                 onClick={() => router.push("/dashboard/joint")}
//               >
//                 <ChevronLeft className="h-5 w-5" />
//               </Button>
//               <h1 className="text-2xl font-bold text-gray-900">Manage Account Users</h1>
//             </div>
//             <p className="text-gray-600">Control access and permissions for your joint account</p>
//           </div>
//           <Button onClick={() => setShowAddUserDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
//             <UserPlusIcon className="mr-2 h-4 w-4" /> Add User
//           </Button>
//         </div>

//         <Tabs defaultValue="users" className="space-y-6">
//           <TabsList className="bg-white border border-gray-200">
//             <TabsTrigger value="users" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
//               Users
//             </TabsTrigger>
//             <TabsTrigger
//               value="invitations"
//               className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
//             >
//               Pending Invitations
//             </TabsTrigger>
//             <TabsTrigger
//               value="activity"
//               className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
//             >
//               Activity Log
//             </TabsTrigger>
//           </TabsList>

//           {/* Users Tab */}
//           <TabsContent value="users">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Account Users</CardTitle>
//                 <CardDescription>People who have access to this joint account</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="text-left border-b border-gray-200">
//                         <th className="pb-3 font-medium text-gray-500 text-sm">User</th>
//                         <th className="pb-3 font-medium text-gray-500 text-sm">Role</th>
//                         <th className="pb-3 font-medium text-gray-500 text-sm">Status</th>
//                         <th className="pb-3 font-medium text-gray-500 text-sm">Permissions</th>
//                         <th className="pb-3 font-medium text-gray-500 text-sm">Last Activity</th>
//                         <th className="pb-3 font-medium text-gray-500 text-sm text-right">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {users.map((user) => (
//                         <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
//                           <td className="py-4">
//                             <div className="flex items-center">
//                               <Avatar className="h-8 w-8 mr-3">
//                                 <AvatarImage src={user.avatar} alt={user.name} />
//                                 <AvatarFallback className="bg-indigo-500 text-white">
//                                   {user.name
//                                     .split(" ")
//                                     .map((n) => n[0])
//                                     .join("")}
//                                 </AvatarFallback>
//                               </Avatar>
//                               <div>
//                                 <p className="font-medium">{user.name}</p>
//                                 <p className="text-xs text-gray-500">{user.email}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="py-4">
//                             <Badge
//                               className={
//                                 user.role === "Primary"
//                                   ? "bg-indigo-100 text-indigo-800"
//                                   : user.role === "Co-owner"
//                                     ? "bg-blue-100 text-blue-800"
//                                     : "bg-gray-100 text-gray-800"
//                               }
//                             >
//                               {user.role}
//                             </Badge>
//                           </td>
//                           <td className="py-4">
//                             <Badge
//                               className={
//                                 user.status === "Active"
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-yellow-100 text-yellow-800"
//                               }
//                             >
//                               {user.status}
//                             </Badge>
//                           </td>
//                           <td className="py-4">
//                             <div className="flex flex-wrap gap-1">
//                               {user.permissions.slice(0, 2).map((permission, index) => (
//                                 <Badge key={index} variant="outline" className="bg-gray-50">
//                                   {permission}
//                                 </Badge>
//                               ))}
//                               {user.permissions.length > 2 && (
//                                 <Badge variant="outline" className="bg-gray-50">
//                                   +{user.permissions.length - 2} more
//                                 </Badge>
//                               )}
//                             </div>
//                           </td>
//                           <td className="py-4 text-sm text-gray-500">
//                             {user.lastActivity ? formatDateTime(user.lastActivity) : "Never"}
//                           </td>
//                           <td className="py-4 text-right">
//                             <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                                   <MoreHorizontal className="h-4 w-4" />
//                                 </Button>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent align="end">
//                                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                 <DropdownMenuSeparator />
//                                 {user.role !== "Primary" && (
//                                   <>
//                                     <DropdownMenuItem
//                                       onClick={() => {
//                                         setSelectedUser(user)
//                                         setShowEditUserDialog(true)
//                                       }}
//                                     >
//                                       <Edit className="h-4 w-4 mr-2" />
//                                       Edit Permissions
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                       onClick={() => {
//                                         setSelectedUser(user)
//                                         setShowRemoveUserDialog(true)
//                                       }}
//                                       className="text-red-600"
//                                     >
//                                       <UserMinusIcon className="h-4 w-4 mr-2" />
//                                       Remove User
//                                     </DropdownMenuItem>
//                                   </>
//                                 )}
//                                 {user.role === "Primary" && (
//                                   <DropdownMenuItem disabled>
//                                     <Shield className="h-4 w-4 mr-2" />
//                                     Primary Account Owner
//                                   </DropdownMenuItem>
//                                 )}
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </CardContent>
//               <CardFooter className="bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
//                 <p>
//                   The Primary account owner has full control over the account. Co-owners can manage most aspects of the
//                   account. Authorized users have limited access based on their permissions.
//                 </p>
//               </CardFooter>
//             </Card>
//           </TabsContent>

//           {/* Pending Invitations Tab */}
//           <TabsContent value="invitations">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Pending Invitations</CardTitle>
//                 <CardDescription>Invitations that have been sent but not yet accepted</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {invitations.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="text-left border-b border-gray-200">
//                           <th className="pb-3 font-medium text-gray-500 text-sm">Email</th>
//                           <th className="pb-3 font-medium text-gray-500 text-sm">Role</th>
//                           <th className="pb-3 font-medium text-gray-500 text-sm">Sent Date</th>
//                           <th className="pb-3 font-medium text-gray-500 text-sm">Expires</th>
//                           <th className="pb-3 font-medium text-gray-500 text-sm">Status</th>
//                           <th className="pb-3 font-medium text-gray-500 text-sm text-right">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {invitations.map((invitation) => (
//                           <tr key={invitation.id} className="border-b border-gray-200 hover:bg-gray-50">
//                             <td className="py-4 font-medium">{invitation.email}</td>
//                             <td className="py-4">
//                               <Badge
//                                 className={
//                                   invitation.role === "Co-owner"
//                                     ? "bg-blue-100 text-blue-800"
//                                     : "bg-gray-100 text-gray-800"
//                                 }
//                               >
//                                 {invitation.role}
//                               </Badge>
//                             </td>
//                             <td className="py-4 text-sm text-gray-500">{formatDateTime(invitation.sentDate)}</td>
//                             <td className="py-4 text-sm text-gray-500">{formatDate(invitation.expiryDate)}</td>
//                             <td className="py-4">
//                               <Badge className="bg-yellow-100 text-yellow-800">{invitation.status}</Badge>
//                             </td>
//                             <td className="py-4 text-right">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="text-red-600 border-red-200 hover:bg-red-50"
//                                 onClick={() => {
//                                   setSelectedInvitation(invitation)
//                                   setShowCancelInviteDialog(true)
//                                 }}
//                               >
//                                 Cancel
//                               </Button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">No pending invitations</p>
//                   </div>
//                 )}
//               </CardContent>
//               <CardFooter className="bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
//                 <p>Invitations expire after 7 days. You can resend an invitation if it expires.</p>
//               </CardFooter>
//             </Card>
//           </TabsContent>

//           {/* Activity Log Tab */}
//           <TabsContent value="activity">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Activity Log</CardTitle>
//                 <CardDescription>Recent user management activities for this account</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {activityLogs.map((log) => (
//                     <div key={log.id} className="flex items-start border-b border-gray-100 pb-4">
//                       <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
//                         <Users className="h-5 w-5 text-gray-600" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-medium">{log.action}</p>
//                         <div className="flex items-center text-sm text-gray-500 mt-1">
//                           <span className="font-medium text-gray-700">{log.user}</span>
//                           <span className="mx-2">•</span>
//                           <span>{formatDateTime(log.timestamp)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Add User Dialog */}
//       <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add New User</DialogTitle>
//             <DialogDescription>Send an invitation to add a new user to this account.</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email Address</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter email address"
//                 value={newUserEmail}
//                 onChange={(e) => setNewUserEmail(e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Role</Label>
//               <RadioGroup value={newUserRole} onValueChange={setNewUserRole}>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="Co-owner" id="co-owner" />
//                   <Label htmlFor="co-owner">Co-owner</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="Authorized User" id="authorized-user" />
//                   <Label htmlFor="authorized-user">Authorized User</Label>
//                 </div>
//               </RadioGroup>
//               <p className="text-xs text-gray-500 mt-1">
//                 {newUserRole === "Co-owner"
//                   ? "Co-owners have full access to the account except for removing the primary owner."
//                   : "Authorized users have limited access based on the permissions you set."}
//               </p>
//             </div>
//             {newUserRole === "Authorized User" && (
//               <div className="space-y-2">
//                 <Label>Permissions</Label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="view"
//                       checked={newUserPermissions.includes("View")}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setNewUserPermissions([...newUserPermissions, "View"])
//                         } else {
//                           setNewUserPermissions(newUserPermissions.filter((p) => p !== "View"))
//                         }
//                       }}
//                       className="rounded border-gray-300"
//                     />
//                     <Label htmlFor="view">View Account</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="transfer"
//                       checked={newUserPermissions.includes("Transfer")}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setNewUserPermissions([...newUserPermissions, "Transfer"])
//                         } else {
//                           setNewUserPermissions(newUserPermissions.filter((p) => p !== "Transfer"))
//                         }
//                       }}
//                       className="rounded border-gray-300"
//                     />
//                     <Label htmlFor="transfer">Make Transfers</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="deposit"
//                       checked={newUserPermissions.includes("Deposit")}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setNewUserPermissions([...newUserPermissions, "Deposit"])
//                         } else {
//                           setNewUserPermissions(newUserPermissions.filter((p) => p !== "Deposit"))
//                         }
//                       }}
//                       className="rounded border-gray-300"
//                     />
//                     <Label htmlFor="deposit">Make Deposits</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="withdraw"
//                       checked={newUserPermissions.includes("Withdraw")}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setNewUserPermissions([...newUserPermissions, "Withdraw"])
//                         } else {
//                           setNewUserPermissions(newUserPermissions.filter((p) => p !== "Withdraw"))
//                         }
//                       }}
//                       className="rounded border-gray-300"
//                     />
//                     <Label htmlFor="withdraw">Make Withdrawals</Label>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddUser} disabled={!newUserEmail}>
//               Send Invitation
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Edit User Dialog */}
//       {selectedUser && (
//         <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Edit User Permissions</DialogTitle>
//               <DialogDescription>Update role and permissions for {selectedUser.name}</DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <div className="flex items-center">
//                 <Avatar className="h-10 w-10 mr-3">
//                   <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
//                   <AvatarFallback className="bg-indigo-500 text- alt={selectedUser.name} />
;<AvatarFallback className="bg-indigo-500 text-white">
  {selectedUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")}
</AvatarFallback>
</Avatar>
                <div>
                  <p className="font-medium">
{
  selectedUser.name
}
</p>
;<p className="text-xs text-gray-500">{selectedUser.email}</p>
</div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value=
{
  selectedUser.role
}
onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value }
)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Co-owner">Co-owner</SelectItem>
                    <SelectItem value="Authorized User">Authorized User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
{
  selectedUser.role === "Authorized User" && (
    <div className="space-y-2">
      <Label>Permissions</Label>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="edit-view"
            checked={selectedUser.permissions.includes("View")}
            onChange={(e) => {
              const newPermissions = e.target.checked
                ? [...selectedUser.permissions, "View"]
                : selectedUser.permissions.filter((p) => p !== "View")
              setSelectedUser({ ...selectedUser, permissions: newPermissions })
            }}
            className="rounded border-gray-300"
          />
          <Label htmlFor="edit-view">View Account</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="edit-transfer"
            checked={selectedUser.permissions.includes("Transfer")}
            onChange={(e) => {
              const newPermissions = e.target.checked
                ? [...selectedUser.permissions, "Transfer"]
                : selectedUser.permissions.filter((p) => p !== "Transfer")
              setSelectedUser({ ...selectedUser, permissions: newPermissions })
            }}
            className="rounded border-gray-300"
          />
          <Label htmlFor="edit-transfer">Make Transfers</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="edit-deposit"
            checked={selectedUser.permissions.includes("Deposit")}
            onChange={(e) => {
              const newPermissions = e.target.checked
                ? [...selectedUser.permissions, "Deposit"]
                : selectedUser.permissions.filter((p) => p !== "Deposit")
              setSelectedUser({ ...selectedUser, permissions: newPermissions })
            }}
            className="rounded border-gray-300"
          />
          <Label htmlFor="edit-deposit">Make Deposits</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="edit-withdraw"
            checked={selectedUser.permissions.includes("Withdraw")}
            onChange={(e) => {
              const newPermissions = e.target.checked
                ? [...selectedUser.permissions, "Withdraw"]
                : selectedUser.permissions.filter((p) => p !== "Withdraw")
              setSelectedUser({ ...selectedUser, permissions: newPermissions })
            }}
            className="rounded border-gray-300"
          />
          <Label htmlFor="edit-withdraw">Make Withdrawals</Label>
        </div>
      </div>
    </div>
  )
}
</div>
            <DialogFooter>
              <Button variant="outline" onClick=
{
  ;() => setShowEditUserDialog(false)
}
>
                Cancel
              </Button>
              <Button onClick=
{
  handleEditUser
}
>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

{
  /* Remove User Dialog */
}
{
  selectedUser && (
    <Dialog open={showRemoveUserDialog} onOpenChange={setShowRemoveUserDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
          <DialogDescription>Are you sure you want to remove {selectedUser.name} from this account?</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action cannot be undone. The user will lose all access to this account immediately.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowRemoveUserDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRemoveUser}>
            Remove User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

{
  /* Cancel Invitation Dialog */
}
{
  selectedInvitation && (
    <Dialog open={showCancelInviteDialog} onOpenChange={setShowCancelInviteDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Invitation</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel the invitation sent to {selectedInvitation.email}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCancelInviteDialog(false)}>
            No, Keep It
          </Button>
          <Button variant="destructive" onClick={handleCancelInvitation}>
            Yes, Cancel Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

{
  /* Floating Menu */
}
;<FloatingMenu />
</div>
  )
}

import { Card as CardComponent, CardContent as CardContentComponent } from "@/components/ui/card"
import {
  Avatar as AvatarComponent,
  AvatarFallback as AvatarFallbackComponent,
  AvatarImage as AvatarImageComponent,
} from "@/components/ui/avatar"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Button as ButtonComponent } from "@/components/ui/button"
import Link from "next/link"
import { CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

export default function ManageUsersPage() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      role: "Primary Owner",
      permissions: ["Full Access", "Withdrawal", "Transfer", "View Statements"],
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 987-6543",
      role: "Co-Owner",
      permissions: ["Full Access", "Withdrawal", "Transfer", "View Statements"],
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    {
      id: 3,
      name: "Robert Smith",
      email: "robert.smith@example.com",
      phone: "+1 (555) 456-7890",
      role: "Co-Owner",
      permissions: ["Limited Access", "View Only", "No Withdrawals"],
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RS",
    },
  ]

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <ButtonComponent variant="ghost" size="icon" asChild>
          <Link href="/dashboard/joint">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </ButtonComponent>
        <h1 className="text-2xl font-bold tracking-tight">Manage Account Users</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <p className="text-muted-foreground">Manage all users who have access to this joint account.</p>
        </div>
        <div className="flex gap-2">
          <ButtonComponent asChild>
            <Link href="/dashboard/joint/add-owner">
              <UserPlusIcon className="mr-2 h-4 w-4" />
              Add New Owner
            </Link>
          </ButtonComponent>
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <CardComponent key={user.id} className="overflow-hidden">
            <CardContentComponent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="bg-primary/10 p-6 flex flex-col items-center justify-center md:w-1/4">
                  <AvatarComponent className="h-20 w-20 mb-2">
                    <AvatarImageComponent src={user.avatar} alt={user.name} />
                    <AvatarFallbackComponent>{user.initials}</AvatarFallbackComponent>
                  </AvatarComponent>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <BadgeComponent variant={user.role === "Primary Owner" ? "default" : "outline"} className="mt-1">
                    {user.role}
                  </BadgeComponent>
                </div>

                <div className="p-6 md:w-3/4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Permissions</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((permission, index) => (
                          <BadgeComponent key={index} variant="secondary" className="text-xs">
                            {permission}
                          </BadgeComponent>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 justify-end">
                    {user.role !== "Primary Owner" && (
                      <ButtonComponent variant="destructive" size="sm">
                        <UserMinusIcon className="mr-2 h-4 w-4" />
                        Remove
                      </ButtonComponent>
                    )}
                    <ButtonComponent variant="outline" size="sm">
                      <Shield className="mr-2 h-4 w-4" />
                      Permissions
                    </ButtonComponent>
                    <ButtonComponent variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </ButtonComponent>
                  </div>
                </div>
              </div>
            </CardContentComponent>
          </CardComponent>
        ))}
      </div>

      <CardComponent className="mt-6">
        <CardHeader>
          <CardTitle>Account Access History</CardTitle>
          <CardDescription>Recent account access by all users</CardDescription>
        </CardHeader>
        <CardContentComponent>
          <div className="space-y-4">
            {[
              { user: "John Doe", action: "Logged in", time: "Today, 10:23 AM" },
              { user: "Jane Doe", action: "Transferred $500", time: "Yesterday, 3:45 PM" },
              { user: "Robert Smith", action: "Viewed statements", time: "Jan 15, 2023, 2:30 PM" },
              { user: "John Doe", action: "Updated contact info", time: "Jan 12, 2023, 11:15 AM" },
              { user: "Jane Doe", action: "Added beneficiary", time: "Jan 10, 2023, 9:00 AM" },
            ].map((activity, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-sm">{activity.user}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContentComponent>
        <CardFooter>
          <ButtonComponent variant="outline" size="sm" className="w-full">
            View Complete Access Log
          </ButtonComponent>
        </CardFooter>
      </CardComponent>
    </div>
  )
}
