'use client'
import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("https://dynamiccalendarapi.onrender.com/auth/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userName,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check specifically for duplicate username error
        if (response.status === 409 || data.message?.includes("already exists") || data.message?.includes("duplicate")) {
          throw new Error("Username already exists. Please choose a different username.")
        }
        throw new Error(data.message || "Signup failed")
      }

      // Redirect to login page
      router.push("/?registered=success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-brand-highlight">
          Create your Dynamic Calendar account
        </h1>
        <p className="text-balance text-sm text-brand-highlight">
          Fill in the details below to create your account
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="userName" className="text-brand-highlight">
            Username
          </Label>
          <Input
            id="userName"
            type="text"
            placeholder="Enter your username"
            className="text-brand-highlight"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-brand-highlight">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            required
            className="text-brand-highlight"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword" className="text-brand-highlight">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            className="text-brand-highlight"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </div>
      <div className="text-center text-sm text-brand-highlight">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}