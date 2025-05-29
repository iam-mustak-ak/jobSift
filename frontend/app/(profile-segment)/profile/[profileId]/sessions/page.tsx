import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash } from "lucide-react";

const Page = () => {
    return (
        <Card className="max-w-4/12">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Sessions</CardTitle>
                    <Button variant="destructive">Delete All</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="grid gap-2">
                        <p className="text-sm font-medium">Chrome on Windows</p>
                        <p className="text-xs text-muted-foreground">
                            <span className="font-sem">Client Version:</span>
                            17.0.963.79{" "}
                        </p>
                        <p className="text-xs text-primary">Current Session</p>
                    </div>
                    <Button variant="destructive">
                        <Trash />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Page;
