// @ts-nocheck
import { ComplaintForm } from '@/components/complaints/complaint-form'
import { Badge } from '@/components/ui/badge'

export default function ComplaintsPage() {
  return (
    <main className="min-h-screen pb-16 pt-20">
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-2 flex justify-center">
              <Badge className="px-3 py-1 text-sm font-medium">
                We Value Your Feedback
              </Badge>
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
              How Can We Improve?
            </h1>
            <p className="text-muted-foreground">
              We're committed to providing the best experience possible. 
              Please share your thoughts with us.
            </p>
          </div>
          
          <ComplaintForm />
        </div>
      </div>
    </main>
  )
}