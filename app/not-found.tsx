import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Compass } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg border-0 bg-card">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Compass className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center">Hmm, Lost Together?</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We can&apos;t seem to find this page. Perhaps there was a typo in the URL, 
            or maybe we&apos;re both looking in the wrong place?
          </p>
          <p className="text-sm text-muted-foreground">
            Don&apos;t worry, even the best explorers take a wrong turn sometimes. Let&apos;s get you back on track!
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pb-6">
          <Button asChild size="lg" className="px-8 w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}