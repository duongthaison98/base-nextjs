"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { DateRange } from "react-day-picker"
import { useLanguage } from "@/lib/i18n/language-provider"
import { userService, type UserFormData } from "@/lib/api/services/user-service"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { defaultUserFormValues, userFormSchema, type UserFormValues } from "@/lib/validations/form-schema"

export function UserForm(): React.ReactElement {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [time, setTime] = useState<string>("12:00")

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultUserFormValues,
  })

  async function onSubmit(data: UserFormValues): Promise<void> {
    setIsSubmitting(true)

    try {
      // Prepare the data for the API
      const formData: UserFormData = {
        ...data,
        dateRange: dateRange
          ? {
              from: dateRange.from as Date,
              to: dateRange.to as Date | undefined,
            }
          : undefined,
        time,
      }

      // Send the data to the API
      await userService.updateUserProfile(formData)

      toast.success(t("form.success"), {
        description: t("form.successDescription"),
      })
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("Failed to submit form", {
        description: "Please try again later",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Enter your information below. All fields marked with * are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.name")} *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormDescription>Your full name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.email")} *</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" type="email" {...field} />
                    </FormControl>
                    <FormDescription>Your email address.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.role")} *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Your role in the organization.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>{t("form.language")}</FormLabel>
                <Select defaultValue="en">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Your preferred language.</FormDescription>
              </FormItem>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormItem>
                <FormLabel>{t("form.dateRange")}</FormLabel>
                <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
                <FormDescription>Select a date range for your event.</FormDescription>
              </FormItem>

              <FormItem>
                <FormLabel>{t("form.time")}</FormLabel>
                <TimePicker value={time} onChange={setTime} />
                <FormDescription>Select a time for your event.</FormDescription>
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.bio")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>A brief description about yourself. Max 160 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("form.notifications")}</FormLabel>
                    <FormDescription>Receive email notifications when there are updates.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner className="mr-2" size="sm" /> : null}
              {t("common.submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <p className="text-xs text-muted-foreground">
          By submitting this form, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  )
}
