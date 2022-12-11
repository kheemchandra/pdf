import Link from 'next/link'

export default function HomePage() {
    return <>
        <h1>This is Home page</h1>
        <Link href='/upload'>Change pdf to html</Link>
    </>
}