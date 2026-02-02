import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// This is a Server Component
export default async function Home() {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get("auth_token");

  if (authToken) {
    // If logged in, immediately redirect to the dashboard.
    // This is more efficient as it happens on the server.
    redirect("/dashboard");
  } else {
    // If not logged in, redirect to the login page.
    redirect("/login");
  }

  // This part will never be reached because of the redirects,
  // but it's good practice to have a return statement.
  return null;
}
