import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center">
            <div className="h-10 w-10 bg-muted animate-pulse rounded-md mr-2"></div>
            <div className="flex-1">
              <div className="h-8 w-3/4 bg-muted animate-pulse rounded-md"></div>
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md mt-2"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-muted animate-pulse rounded-md"
                ></div>
              ))}
            </div>

            <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>

            <div className="space-y-6 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-muted animate-pulse rounded-md"
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
