import type { Applicant } from "../redux/applicantSlice"

export const exportToCSV = (data: Applicant[], filename: string) => {
  // Create CSV header
  const headers = ["First Name", "Date of Birth", "Graduate", "Email", "Course"]

  // Convert data to CSV rows
  const rows = data.map((item) => [item.firstName, item.dob, item.graduate ? "Yes" : "No", item.email, item.course])

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const parseCSV = (csvText: string): Partial<Applicant>[] => {
  // Split the CSV text into lines
  const lines = csvText.split("\n")

  // Extract headers (first line)
  const headers = lines[0].split(",").map((header) => header.trim())

  // Map indices to field names
  const fieldIndices: Record<string, number> = {
    firstName: headers.findIndex((h) => h.toLowerCase().includes("first") && h.toLowerCase().includes("name")),
    dob: headers.findIndex((h) => h.toLowerCase().includes("birth") || h.toLowerCase().includes("dob")),
    graduate: headers.findIndex((h) => h.toLowerCase().includes("graduate")),
    email: headers.findIndex((h) => h.toLowerCase().includes("email")),
    course: headers.findIndex((h) => h.toLowerCase().includes("course")),
  }

  // Parse data rows (skip header)
  return lines
    .slice(1)
    .filter((line) => line.trim() !== "") // Skip empty lines
    .map((line) => {
      const values = line.split(",").map((value) => value.trim())

      // Create applicant object with mapped fields
      const applicant: Partial<Applicant> = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      }

      if (fieldIndices.firstName >= 0) {
        applicant.firstName = values[fieldIndices.firstName]
      }

      if (fieldIndices.dob >= 0) {
        applicant.dob = values[fieldIndices.dob]
      }

      if (fieldIndices.graduate >= 0) {
        const graduateValue = values[fieldIndices.graduate].toLowerCase()
        applicant.graduate = graduateValue === "yes" || graduateValue === "true" || graduateValue === "1"
      }

      if (fieldIndices.email >= 0) {
        applicant.email = values[fieldIndices.email]
      }

      if (fieldIndices.course >= 0) {
        applicant.course = values[fieldIndices.course]
      }

      return applicant
    })
}
