import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>The System</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to continue building consistency.</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input type="email" placeholder="you@example.com" />
          <Input type="password" placeholder="Password" />
          <Button>Sign in</Button>
        </CardContent>
      </Card>
    </main>
  );
}
