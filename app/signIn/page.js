import AuthForm from '@/app/signIn/auth-form';

export default async function UserAuth({ searchParams }) {
  const formMode = searchParams.mode || 'signup';
  return <AuthForm mode={formMode}/>;
}
