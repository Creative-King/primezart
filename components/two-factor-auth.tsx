"use client"

import { useState, useEffect } from "react"
import { QrCode, Copy, Check, Key, SmartphoneIcon, ShieldIcon, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TwoFactorAuthProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
}

export function TwoFactorAuthSetup({ open, onOpenChange, onComplete }: TwoFactorAuthProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [setupMethod, setSetupMethod] = useState<string>("app")
  const [verificationCode, setVerificationCode] = useState<string>("")
  const [secret, setSecret] = useState<string>("JBSWY3DPEHPK3PXP")
  const [copied, setCopied] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      // Reset the state when dialog is opened
      setCurrentStep(1)
      setVerificationCode("")
      setVerificationError(null)
      setCopied(false)
    }
  }, [open])

  const copySecretToClipboard = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerification = () => {
    setIsVerifying(true)
    setVerificationError(null)

    // In a real app, you would validate against an actual backend
    // Here we're just simulating the process with a timeout
    setTimeout(() => {
      // For demo purposes, let's consider 123456 a valid code
      if (verificationCode === "123456" || verificationCode === "654321") {
        setCurrentStep(3)
      } else {
        setVerificationError("Invalid verification code. Please try again.")
      }
      setIsVerifying(false)
    }, 1500)
  }

  const handleGenerateNewBackupCodes = () => {
    // In a real app, these would be generated securely on the server
    // For demo, we're just showing the UI flow
    alert("New backup codes would be generated here")
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account by enabling two-factor authentication.
          </DialogDescription>
        </DialogHeader>

        {currentStep === 1 && (
          <>
            <div className="py-4">
              <Tabs defaultValue={setupMethod} onValueChange={setSetupMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="app">Authentication App</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                </TabsList>

                <TabsContent value="app" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Use an Authentication App</CardTitle>
                      <CardDescription>
                        Scan the QR code below with apps like Google Authenticator, Microsoft Authenticator, or Authy.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center py-2">
                        <div className="bg-white p-4 rounded-md border">
                          <QrCode className="h-40 w-40" />
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground mb-2">Or enter this code manually in your app:</p>
                        <div className="flex items-center">
                          <code className="bg-gray-100 p-2 rounded text-sm flex-1 font-mono">{secret}</code>
                          <Button variant="outline" size="sm" className="ml-2" onClick={copySecretToClipboard}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sms" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Use SMS Verification</CardTitle>
                      <CardDescription>
                        We'll send a verification code to your phone each time you log in.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input
                          className="mt-1"
                          placeholder="Enter your phone number"
                          defaultValue="+1 (555) 123-4567"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Standard message rates may apply.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setCurrentStep(2)}>Continue</Button>
            </DialogFooter>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="py-4">
              <h3 className="text-lg font-medium mb-4">Verify Your Setup</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {setupMethod === "app"
                  ? "Enter the 6-digit code from your authentication app"
                  : "Enter the 6-digit code sent to your phone"}
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium">Verification Code</label>
                <Input
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, "")
                    setVerificationCode(value)
                    setVerificationError(null)
                  }}
                />

                {verificationError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{verificationError}</AlertDescription>
                  </Alert>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                  For this demo, enter "123456" to simulate a successful verification
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={handleVerification} disabled={verificationCode.length !== 6 || isVerifying}>
                {isVerifying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="py-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <ShieldIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <h3 className="text-lg font-medium text-center mb-2">Setup Complete!</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Two-factor authentication has been successfully enabled for your account.
              </p>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Backup Codes</CardTitle>
                  <CardDescription>
                    Save these backup codes in a secure place. You can use them to access your account if you lose your
                    authentication device.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-gray-100 p-2 rounded text-sm font-mono">ABCD-EFGH-1234</code>
                    <code className="bg-gray-100 p-2 rounded text-sm font-mono">IJKL-MNOP-5678</code>
                    <code className="bg-gray-100 p-2 rounded text-sm font-mono">QRST-UVWX-9012</code>
                    <code className="bg-gray-100 p-2 rounded text-sm font-mono">YZAB-CDEF-3456</code>
                    <code className="bg-gray-100 p-2 rounded text-sm font-mono">GHIJ-KLMN-7890</code>
                    <code className="bg-gray-100 p-2 rounded text-sm font-mono">OPQR-STUV-1234</code>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleGenerateNewBackupCodes}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New Codes
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <DialogFooter>
              <Button onClick={handleComplete}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Simple verification dialog for existing 2FA
export function TwoFactorVerification({
  open,
  onOpenChange,
  onVerified,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerified: () => void
}) {
  const [code, setCode] = useState("")
  const [method, setMethod] = useState("app")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = () => {
    setIsVerifying(true)
    setError(null)

    // Simulate verification process
    setTimeout(() => {
      if (code === "123456") {
        onVerified()
        onOpenChange(false)
      } else {
        setError("Invalid code. Please try again.")
      }
      setIsVerifying(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription>Enter the verification code to continue</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue={method} onValueChange={setMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="app">
                <SmartphoneIcon className="h-4 w-4 mr-2" />
                Authentication App
              </TabsTrigger>
              <TabsTrigger value="backup">
                <Key className="h-4 w-4 mr-2" />
                Backup Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="app" className="mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter the 6-digit code from your authentication app</label>
                <Input
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "")
                    setCode(value)
                    setError(null)
                  }}
                />

                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

                <p className="text-xs text-muted-foreground mt-1">
                  For this demo, enter "123456" to simulate successful verification
                </p>
              </div>
            </TabsContent>

            <TabsContent value="backup" className="mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter one of your backup codes</label>
                <Input
                  placeholder="XXXX-XXXX-XXXX"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    setError(null)
                  }}
                />

                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={
              (method === "app" && code.length !== 6) || (method === "backup" && code.length < 8) || isVerifying
            }
          >
            {isVerifying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
