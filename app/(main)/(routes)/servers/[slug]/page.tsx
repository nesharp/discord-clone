export default ({ params }: { params: { slug: string } }) => {
    return <div>Server: {params.slug}</div>
}
