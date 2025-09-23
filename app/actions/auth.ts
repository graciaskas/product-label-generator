"use server";

import { SignupFormSchema, FormState } from '@/lib/definitions'
import { createSession } from '@/app/lib/session'
import { deleteSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
 
export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  // Call the provider or db to create a user...

  // Current steps:
  // 4. Create user session
  await createSession(user.id)
  // 5. Redirect user
  redirect('/web')
}


 
export async function logout() {
  await deleteSession()
  redirect('/login')
}