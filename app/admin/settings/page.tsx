"use client"

import { useState } from "react"
import { SettingsIcon, Bell, Shield, Mail, Moon, Sun, Smartphone, Save } from "lucide-react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminSettings() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [emailSettings, setEmailSettings] = useState({
    welcomeEmail: true,
    transactionAlerts: true,
    marketingEmails: false,
    securityAlerts: true,
  })
  const [notificationSettings, setNotificationSettings] = useState({
    newUsers: true,
    newTransactions: true,
    systemAlerts: true,
    soundEnabled: true,
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: "30",
    ipRestriction: false,
    passwordExpiry: "90",
  })

  const handleSaveSettings = (settingType: string) => {
    toast({
      title: "Settings Saved",
      description: `Your ${settingType} settings have been updated successfully.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your admin dashboard preferences and configurations.</p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>
                Manage your dashboard appearance and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="w-24"
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="w-24"
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                    className="w-24"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="w-full md:w-[240px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone" className="w-full md:w-[240px]">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                    <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Dashboard Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics" className="cursor-pointer">Show analytics on dashboard</Label>
                    <Switch id="analytics" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recent-users" className="cursor-pointer">Show recent users on dashboard</Label>
                    <Switch id="recent-users" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recent-transactions" className="cursor-pointer">Show recent transactions on dashboard</Label>
                    <Switch id="recent-transactions" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("general")}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure which notifications you receive and how
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Dashboard Notifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-users" className="cursor-pointer">New user registrations</Label>
                    <Switch 
                      id="new-users" 
                      checked={notificationSettings.newUsers}
                      onCheckedChange={(checked: boolean) => ...}
                        setNotificationSettings({...notificationSettings, newUsers: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-transactions" className="cursor-pointer">New transactions</Label>
                    <Switch 
                      id="new-transactions" 
                      checked={notificationSettings.newTransactions}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, newTransactions: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-alerts" className="cursor-pointer">System alerts</Label>
                    <Switch 
                      id="system-alerts" 
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, systemAlerts: checked})
                      }
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Sound Notifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound-enabled" className="cursor-pointer">Enable notification sounds</Label>
                    <Switch 
                      id="sound-enabled" 
                      checked={notificationSettings.soundEnabled}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, soundEnabled: checked})
                      }
                    />
                  </div>
                </div>
                
                {notificationSettings.soundEnabled && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="notification-volume">Notification Volume</Label>
                    <Input 
                      id="notification-volume" 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="50" 
                      className="w-full md:w-[240px]" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground w-full md:w-[240px]">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Mobile Notifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications" className="cursor-pointer">Enable push notifications</Label>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="mobile-number">Mobile Number</Label>
                  <Input 
                    id="mobile-number" 
                    placeholder="Enter mobile number for SMS alerts" 
                    className="mt-1 w-full md:w-[240px]" 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("notification")}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security options for the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Authentication</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor" className="cursor-pointer">Two-factor authentication</Label>
                    <Switch 
                      id="two-factor" 
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                      }
                    />
                  </div>
                </div>
                
                {securitySettings.twoFactorAuth && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Two-Factor Authentication Methods</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="sms" name="2fa-method" defaultChecked />
                        <Label htmlFor="sms">SMS</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="app" name="2fa-method" />
                        <Label htmlFor="app">Authenticator App</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="email" name="2fa-method" />
                        <Label htmlFor="email">Email</Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Session Management</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Select 
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) => 
                        setSecuritySettings({...securitySettings, sessionTimeout: value})
                      }
                    >
                      <SelectTrigger id="session-timeout" className="w-full md:w-[240px] mt-1">
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ip-restriction" className="cursor-pointer">IP address restriction</Label>
                    <Switch 
                      id="ip-restriction" 
                      checked={securitySettings.ipRestriction}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, ipRestriction: checked})
                      }
                    />
                  </div>
                  
                  {securitySettings.ipRestriction && (
                    <div className="mt-2">
                      <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                      <Input 
                        id="allowed-ips" 
                        placeholder="Enter comma-separated IP addresses" 
                        className="mt-1" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: 192.168.1.1, 10.0.0.1
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Password Policy</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                    <Select 
                      value={securitySettings.passwordExpiry}
                      onValueChange={(value) => 
                        setSecuritySettings({...securitySettings, passwordExpiry: value})
                      }
                    >
                      <SelectTrigger id="password-expiry" className="w-full md:w-[240px] mt-1">
                        <SelectValue placeholder="Select expiry period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">365 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="min-length" className="cursor-pointer">Minimum password length: 8 characters</Label>
                      <Switch id="min-length" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="special-chars" className="cursor-pointer">Require special characters</Label>
                      <Switch id="special-chars" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="numbers" className="cursor-pointer">Require numbers</Label>
                      <Switch id="numbers" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="uppercase" className="cursor-pointer">Require uppercase letters</Label>
                      <Switch id="uppercase" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("security")}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Configure email notifications and templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Email Notifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="welcome-email" className="cursor-pointer">Welcome email to new users</Label>
                    <Switch 
                      id="welcome-email" 
                      checked={emailSettings.welcomeEmail}
                      onCheckedChange={(checked) => 
                        setEmailSettings({...emailSettings, welcomeEmail: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="transaction-alerts" className="cursor-pointer">Transaction alerts</Label>
                    <Switch 
                      id="transaction-alerts" 
                      checked={emailSettings.transactionAlerts}
                      onCheckedChange={(checked) => 
                        setEmailSettings({...emailSettings, transactionAlerts: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing-emails" className="cursor-pointer">Marketing emails</Label>
                    <Switch 
                      id="marketing-emails" 
                      checked={emailSettings.marketingEmails}
                      onCheckedChange={(checked) => 
                        setEmailSettings({...emailSettings, marketingEmails: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="security-alerts" className="cursor-pointer">Security alerts</Label>
                    <Switch 
                      id="security-alerts" 
                      checked={emailSettings.securityAlerts}
                      onCheckedChange={(checked) => 
                        setEmailSettings({...emailSettings, securityAlerts: checked})
                      }
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>SMTP Configuration</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input id="smtp-server" placeholder="smtp.example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="smtp-port">SMTP  />
                  </div>
                  <div>
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" placeholder="587" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="smtp-username">SMTP Username</Label>
                    <Input id="smtp-username" placeholder="username@example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input id="smtp-password" type="password" placeholder="••••••••" className="mt-1" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smtp-ssl" className="cursor-pointer">Use SSL/TLS</Label>
                    <Switch id="smtp-ssl" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Email Templates</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email-template">Select Template to Edit</Label>
                    <Select defaultValue="welcome">
                      <SelectTrigger id="email-template" className="w-full mt-1">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome Email</SelectItem>
                        <SelectItem value="password-reset">Password Reset</SelectItem>
                        <SelectItem value="account-approval">Account Approval</SelectItem>
                        <SelectItem value="transaction-alert">Transaction Alert</SelectItem>
                        <SelectItem value="security-alert">Security Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="email-subject">Email Subject</Label>
                    <Input id="email-subject" placeholder="Welcome to Sky Premium Banking" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="email-body">Email Body</Label>
                    <textarea
                      id="email-body"
                      className="w-full min-h-[200px] p-3 border rounded-md mt-1"
                      placeholder="Dear {{name}}, Welcome to Sky Premium Banking..."
                    ></textarea>
                    <p className="text-xs text-muted-foreground mt-1">
                      You can use variables like {{name}}, {{email}}, etc.
                    </p>
                  </div>
                  
                  <Button variant="outline" className="mt-2">
                    Preview Template
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("email")}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
