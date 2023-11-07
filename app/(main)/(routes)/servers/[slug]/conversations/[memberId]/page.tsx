export default function Page({ params }: { params: { memberId: string } }) {
    return <div>Conversation {params.memberId} page</div>
}
