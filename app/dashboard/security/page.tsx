"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Shield,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  Users,
  Settings,
  Laptop,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TwoFactorAuthSetup } from "@/components/two-factor-auth"
import { AnalyticsFooter } from "@/components/analytics-footer"

export default function SecurityPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    transactionNotifications: true,
    deviceRestrictions: false,
    biometricLogin: true,
    autoLogout: 15,
    strongPasswordEnabled: true,
    thirdPartyAccessReview: false,
    restrictSensitiveOperations: true,
  })

  // Example active sessions
  const activeSessions = [
    {
      id: "session1",
      device: "MacBook Pro",
      browser: "Chrome",
      location: "New York, USA",
      ip: "192.168.1.1",
      time: "Now",
      active: true,
    },
    {
      id: "session2",
      device: "iPhone 15",
      browser: "Safari",
      location: "New York, USA",
      ip: "192.168.1.2",
      time: "1 hour ago",
      active: false,
    },
    {
      id: "session3",
      device: "Windows PC",
      browser: "Firefox",
      location: "Boston, USA",
      ip: "192.168.1.3",
      time: "Yesterday",
      active: false,
    },
  ]

  // Recent security events
  const securityEvents = [
    {
      id: "event1",
      type: "Login",
      device: "MacBook Pro (Chrome)",
      location: "New York, USA",
      time: "Today, 10:15 AM",
      status: "success",
    },
    {
      id: "event2",
      type: "Password Change",
      device: "MacBook Pro (Chrome)",
      location: "New York, USA",
      time: "Yesterday, 3:24 PM",
      status: "success",
    },
    {
      id: "event3",
      type: "Failed Login Attempt",
      device: "Unknown Device (Chrome)",
      location: "Lagos, Nigeria",
      time: "Oct 15, 2023, 2:37 AM",
      status: "failed",
    },
    {
      id: "event4",
      type: "International Transfer",
      device: "iPhone 15 (Safari)",
      location: "New York, USA",
      time: "Oct 12, 2023, 1:45 PM",
      status: "success",
    },
  ]

  // Calculate security score based on enabled security features
  const calculateSecurityScore = () => {
    let score = 0
    if (securitySettings.twoFactorEnabled) score += 30
    if (securitySettings.loginNotifications) score += 10
    if (securitySettings.transactionNotifications) score += 10
    if (securitySettings.deviceRestrictions) score += 15
    if (securitySettings.biometricLogin) score += 10
    if (securitySettings.strongPasswordEnabled) score += 15
    if (securitySettings.thirdPartyAccessReview) score += 5
    if (securitySettings.restrictSensitiveOperations) score += 5

    return score
  }

  const securityScore = calculateSecurityScore()

  // Toggle security setting
  const toggleSetting = (setting: keyof typeof securitySettings) => {
    setSecuritySettings({
      ...securitySettings,
      [setting]: !securitySettings[setting],
    })
  }

  // Handle 2FA success
  const handle2FASetupSuccess = () => {
    setSecuritySettings({
      ...securitySettings,
      twoFactorEnabled: true,
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Security Center</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Shield className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Laptop className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Security Score</CardTitle>
                <CardDescription>Your account security rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      {securityScore < 50
                        ? "Vulnerable"
                        : securityScore < 70
                          ? "Good"
                          : securityScore < 90
                            ? "Strong"
                            : "Excellent"}
                    </span>
                    <span className="text-sm font-medium">{securityScore}/100</span>
                  </div>
                  <Progress
                    value={securityScore}
                    className={`h-2 ${
                      securityScore < 50
                        ? "bg-red-100"
                        : securityScore < 70
                          ? "bg-amber-100"
                          : securityScore < 90
                            ? "bg-blue-100"
                            : "bg-green-100"
                    }`}
                  />
                  <div className="pt-2">
                    {securityScore < 70 ? (
                      <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>Enable two-factor authentication to improve your security.</AlertDescription>
                      </Alert>
                    ) : securityScore >= 90 ? (
                      <Alert className="bg-green-50 border-green-200 text-green-800">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>Excellent! Your account has maximum protection.</AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          Your account security is good. See recommendations for additional protection.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                <CardDescription>Protect your account with 2FA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-24">
                  {securitySettings.twoFactorEnabled ? (
                    <div className="text-center">
                      <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                      <p className="font-medium">Enabled</p>
                    </div>
                  ) : (
                    <Button onClick={() => setShowTwoFactorSetup(true)}>Enable 2FA</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Last security event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{securityEvents[0].type}</span>
                    <Badge
                      variant="outline"
                      className={
                        securityEvents[0].status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }
                    >
                      {securityEvents[0].status === "success" ? "Successful" : "Failed"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{securityEvents[0].device}</p>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{securityEvents[0].location}</span>
                    <span>{securityEvents[0].time}</span>
                  </div>
                </div>
                <Button variant="link" className="mt-2 h-auto p-0" onClick={() => setActiveTab("sessions")}>
                  View all activity
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
                <CardDescription>Steps to enhance your account security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!securitySettings.twoFactorEnabled && (
                    <div className="flex space-x-3 items-center p-3 border rounded-lg">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Smartphone className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Enable Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Button size="sm" onClick={() => setShowTwoFactorSetup(true)}>
                        Setup
                      </Button>
                    </div>
                  )}

                  {!securitySettings.deviceRestrictions && (
                    <div className="flex space-x-3 items-center p-3 border rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Laptop className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Limit Device Access</p>
                        <p className="text-sm text-muted-foreground">Restrict logins to trusted devices only</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => toggleSetting("deviceRestrictions")}>
                        Enable
                      </Button>
                    </div>
                  )}

                  {!securitySettings.thirdPartyAccessReview && (
                    <div className="flex space-x-3 items-center p-3 border rounded-lg">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Review Third-Party Access</p>
                        <p className="text-sm text-muted-foreground">Regularly review who has access to your account</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/dashboard/third-party-accounts")}
                      >
                        Review
                      </Button>
                    </div>
                  )}

                  <div className="flex space-x-3 items-center p-3 border rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full">
                      <KeyRound className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Update Password</p>
                      <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Change
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Activity Log</CardTitle>
                <CardDescription>Recent security-related events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{event.type}</span>
                        <Badge
                          variant="outline"
                          className={
                            event.status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          }
                        >
                          {event.status === "success" ? "Successful" : "Failed"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.device}</p>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{event.location}</span>
                        <span>{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="link" className="mx-auto">
                  View Full Activity Log
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Devices currently logged into your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        {session.device.includes("iPhone") || session.device.includes("Android") ? (
                          <Smartphone className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Laptop className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {session.device} • {session.browser}
                        </p>
                        <div className="flex space-x-2 text-sm text-muted-foreground">
                          <span>{session.location}</span>
                          <span>•</span>
                          <span>IP: {session.ip}</span>
                        </div>
                        <div className="text-xs mt-1">
                          {session.active ? (
                            <span className="text-green-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1"></div> Current session
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Last active: {session.time}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!session.active && (
                      <Button variant="outline" size="sm" className="text-red-600">
                        Terminate
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 border-t">
              <Button variant="outline" className="text-red-600">
                Logout All Other Devices
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Login Notifications</CardTitle>
                <CardDescription>Get alerted about new sign-ins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email alerts for new logins</p>
                    </div>
                    <Switch
                      checked={securitySettings.loginNotifications}
                      onCheckedChange={() => toggleSetting("loginNotifications")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive text messages for new logins</p>
                    </div>
                    <Switch checked={false} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Unrecognized Device Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get alerts when logging in from a new device</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Management</CardTitle>
                <CardDescription>Control which devices can access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Trusted Devices Only</Label>
                      <p className="text-sm text-muted-foreground">Only allow login from verified devices</p>
                    </div>
                    <Switch
                      checked={securitySettings.deviceRestrictions}
                      onCheckedChange={() => toggleSetting("deviceRestrictions")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Remember Devices</Label>
                      <p className="text-sm text-muted-foreground">Keep devices logged in for 30 days</p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Logout</Label>
                      <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select className="rounded border border-gray-300 p-1 text-sm">
                        <option value="5">5 minutes</option>
                        <option value="15" selected>
                          15 minutes
                        </option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Settings</CardTitle>
                <CardDescription>Manage how you sign in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require a verification code when signing in</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={() => {
                        if (!securitySettings.twoFactorEnabled) {
                          setShowTwoFactorSetup(true)
                        } else {
                          toggleSetting("twoFactorEnabled")
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Biometric Login</Label>
                      <p className="text-sm text-muted-foreground">
                        Use fingerprint or face recognition on supported devices
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.biometricLogin}
                      onCheckedChange={() => toggleSetting("biometricLogin")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Strong Password Requirements</Label>
                      <p className="text-sm text-muted-foreground">Enforce complex password rules</p>
                    </div>
                    <Switch
                      checked={securitySettings.strongPasswordEnabled}
                      onCheckedChange={() => toggleSetting("strongPasswordEnabled")}
                    />
                  </div>

                  <Button className="w-full mt-2">
                    <KeyRound className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Security</CardTitle>
                <CardDescription>Protect your financial transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Transaction Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get alerts for all account transactions</p>
                    </div>
                    <Switch
                      checked={securitySettings.transactionNotifications}
                      onCheckedChange={() => toggleSetting("transactionNotifications")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require 2FA for Large Transfers</Label>
                      <p className="text-sm text-muted-foreground">Additional verification for transfers over $1,000</p>
                    </div>
                    <Switch
                      checked={securitySettings.restrictSensitiveOperations}
                      onCheckedChange={() => toggleSetting("restrictSensitiveOperations")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>International Transfer Lock</Label>
                      <p className="text-sm text-muted-foreground">Require approval for international transfers</p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Third-Party Access Review</Label>
                      <p className="text-sm text-muted-foreground">
                        Periodically review third-party access to your account
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.thirdPartyAccessReview}
                      onCheckedChange={() => toggleSetting("thirdPartyAccessReview")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <TwoFactorAuthSetup
        open={showTwoFactorSetup}
        onOpenChange={setShowTwoFactorSetup}
        onComplete={handle2FASetupSuccess}
      />

      <AnalyticsFooter accountType="personal" />
    </div>
  )
}

