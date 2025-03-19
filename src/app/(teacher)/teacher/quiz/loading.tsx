import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="h-8 w-1/3 bg-muted animate-pulse rounded-md"></div>
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded-md"></div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
            <div className="h-10 w-40 bg-muted animate-pulse rounded-md"></div>
          </div>
          <div className="rounded-md border">
            <div className="h-64 w-full bg-muted animate-pulse rounded-md"></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-6 w-1/2 bg-muted animate-pulse rounded-md"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded-md"></div>
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
