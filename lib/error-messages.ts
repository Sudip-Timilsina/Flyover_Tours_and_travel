import { ZodError } from "zod";

/**
 * Convert technical Zod validation errors to friendly, non-technical messages
 */
export function formatValidationError(error: any): string {
  // If it's a Zod error with issues
  if (error instanceof ZodError || (error.issues && Array.isArray(error.issues))) {
    const issues = error.issues || [];
    if (issues.length === 0) return "Please check your input and try again";

    const issue = issues[0];
    const fieldName = formatFieldName(issue.path?.[0] as string);

    // Map error codes to friendly messages
    switch (issue.code) {
      case "too_small":
        if (issue.type === "string") {
          return `${fieldName} must be at least ${issue.minimum} characters`;
        }
        return `${fieldName} is required`;

      case "too_big":
        if (issue.type === "string") {
          return `${fieldName} cannot exceed ${issue.maximum} characters`;
        }
        return `${fieldName} is too large`;

      case "invalid_type":
        return `${fieldName} must be a valid ${issue.expected}`;

      case "invalid_email":
        return "Please enter a valid email address";

      case "invalid_enum":
        return `Please select a valid option for ${fieldName}`;

      case "invalid_string":
        if (issue.validation === "email") {
          return "Please enter a valid email address";
        }
        return `${fieldName} is not valid`;

      default:
        return issue.message || "Please check your input and try again";
    }
  }

  // For other errors
  return error?.message || "Something went wrong. Please try again.";
}

/**
 * Convert snake_case or camelCase field names to readable format
 * e.g., "tourTitle" -> "Tour Title", "start_date" -> "Start Date"
 */
function formatFieldName(field: string): string {
  if (!field) return "This field";

  return field
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}

/**
 * Format API error responses to user-friendly messages
 */
export function formatApiError(error: string | null | undefined): string {
  if (!error) return "Something went wrong. Please try again.";

  const errorMap: Record<string, string> = {
    "Unauthorized": "You don't have permission to do this. Please log in.",
    "Not found": "We couldn't find what you're looking for.",
    "Invalid request": "Please check your information and try again.",
    "Server error": "Our server is having trouble. Please try again later.",
    "Database error": "We're having trouble saving your information. Please try again.",
    "Failed to save": "We couldn't save your information. Please check the details and try again.",
  };

  // Check for partial matches
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // If no match found, return the original error but make it more readable
  return error.replace(/^Error: /, "").replace(/error/gi, "issue");
}
