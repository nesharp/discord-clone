import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="mx-auto w-fit mt-20">
            <SignUp afterSignUpUrl={'/'} />
        </div>
    )
}
