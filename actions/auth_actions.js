'use server';
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";
import bcrypt from 'bcrypt';
import { CreateAuthSession } from "@/lib/auth";

export async function signup(prevState, formData ) {
    const email = formData.get('email');
    const password = formData.get('password');

    let errors = {};
    if (!email.includes('@')) {
        errors.email = 'Please enter a valid email address.';
    }

    if (password.trim().length < 8) {
        errors.password = 'Password must be at least 8 characters.';
    }

    if (Object.keys(errors).length > 0) {
        return {
            errors,
        };
    }

    // Store in the database (create new user)
    const hashedPassword = await bcrypt.hash(password, 10);  // Salt rounds added here
    try {
       const id = createUser(email, hashedPassword);
      await CreateAuthSession();
       redirect('/training');
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return {
                errors: {
                    email: 'Email already exists for the account.',
                },
            };
        }
        throw error;
    }
    


}
