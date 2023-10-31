import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='mx-auto w-fit mt-20'>
            <SignIn afterSignInUrl={'/'} />
        </div>
    )
}
