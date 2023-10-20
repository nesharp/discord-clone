const Page =  ({ params }: { params: { slug: string } }) => {
    return <div>Server: {params.slug}</div>
}
export default Page