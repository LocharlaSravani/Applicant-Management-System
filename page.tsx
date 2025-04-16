"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch } from "react-redux"
import { addApplicant } from "@/lib/redux/applicantSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

const applicantSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Please enter a valid date" }),
  graduate: z.boolean(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  course: z.string().min(1, { message: "Please select a course" }),
})

type ApplicantFormValues = z.infer<typeof applicantSchema>

export default function ApplicantForm() {
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user")
    if (!user || !JSON.parse(user).isAuthenticated) {
      router.push("/")
    }
  }, [router])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      firstName: "",
      dob: "",
      graduate: false,
      email: "",
      course: "",
    },
  })

  // For the checkbox since it needs special handling with react-hook-form
  const graduateValue = watch("graduate")

  const onSubmit = (data: ApplicantFormValues) => {
    // Add applicant to Redux store
    dispatch(
      addApplicant({
        id: Date.now().toString(),
        ...data,
        dob: format(new Date(data.dob), "yyyy-MM-dd"),
      }),
    )

    // Redirect to view data page
    router.push("/view-data")
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Applicant Form</CardTitle>
          <CardDescription>Enter applicant information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} placeholder="Enter first name" />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" {...register("dob")} />
              {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="graduate"
                checked={graduateValue}
                onCheckedChange={(checked) => {
                  setValue("graduate", checked as boolean)
                }}
              />
              <Label htmlFor="graduate">Graduate</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="Enter email address" />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select onValueChange={(value) => setValue("course", value)} defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                </SelectContent>
              </Select>
              {errors.course && <p className="text-sm text-red-500">{errors.course.message}</p>}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/home")}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
