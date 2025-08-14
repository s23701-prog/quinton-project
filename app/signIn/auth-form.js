// app/signIn/auth-form.js
'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { signup, login } from '@/actions/auth-actions';

export default function AuthForm({ mode }) {
  // Choose the correct server action:
  const action = mode === 'login' ? login : signup;

  // useFormState expects a function (prevState, formData)
  const [formState, formAction] = useFormState(action, {});

  return (
    <form id="auth-form" action={formAction}>
      <p style={{textAlign:'center'}}>Sign in to continue your journey</p>
      <div>
        <img src="/auth-icon.jpg" alt="A lock icon" />
      </div>
      {mode === 'signup' && (
        <p>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" />
        </p>
      )}
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {formState.errors && (
        <ul id="form-errors">
          {Object.entries(formState.errors).map(([field, msg]) => (
            <li key={field}>{msg}</li>
          ))}
        </ul>
      )}
      <p>
        <button type="submit">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </p>
      <p>
        {mode === 'login' ? (
          <Link href="/signIn?mode=signup">Create an account</Link>
        ) : (
          <Link href="/signIn?mode=login">Login with existing account</Link>
        )}
      </p>
    </form>
  );
}
