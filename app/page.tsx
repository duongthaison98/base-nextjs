import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Next.js Project with TanStack & shadcn/ui
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  A starter template with Next.js, TanStack Table, TanStack Query, shadcn/ui, and Tailwind CSS.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/dashboard">
                  <Button>View Dashboard</Button>
                </Link>
                <Link href="/table-example">
                  <Button variant="outline">View Table Example</Button>
                </Link>
                <Link href="/form-example">
                  <Button variant="secondary">View Form Example</Button>
                </Link>
                <Link href="/realtime">
                  <Button variant="outline">Realtime Communication</Button>
                </Link>
                <Link href="/redux-example">
                  <Button variant="outline">Redux Example</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
