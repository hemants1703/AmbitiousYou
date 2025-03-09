import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";

export default function Billing() {
  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>PRO Plan</CardTitle>
                  <CardDescription>$29/month, billed monthly</CardDescription>
                </div>
                <Badge>Current Plan</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Includes:</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      <span>Unlimited projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      <span>Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      <span>Custom integrations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Usage this month:</h3>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span>Projects</span>
                      <span>7 / Unlimited</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API calls</span>
                      <span>12,354 / 100,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage</span>
                      <span>3.2GB / 10GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button className="flex-1">Change Plan</Button>
                <Button variant="outline" className="flex-1">Cancel Subscription</Button>
              </div>
            </CardFooter>
          </Card>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>$9/month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4" />
                  <span>5 projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4" />
                  <span>Basic analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4" />
                  <span>Email support</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Downgrade</Button>
              </CardFooter>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle>PRO</CardTitle>
                <CardDescription>$29/month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  <span>Unlimited projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled className="w-full">Current Plan</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>$99/month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4" />
                  <span>Everything in PRO</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4" />
                  <span>Custom solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4" />
                  <span>Dedicated support</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Upgrade</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-md">
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Badge>Default</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Add Payment Method</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-muted-foreground">john.doe@example.com</p>
              </div>
              <div>
                <p className="font-medium">Billing Address</p>
                <p className="text-muted-foreground">
                  123 Main St<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Edit Billing Information</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your recent invoices and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>May 1, 2023</TableCell>
                    <TableCell>PRO Plan - Monthly</TableCell>
                    <TableCell>$29.00</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">Download</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Apr 1, 2023</TableCell>
                    <TableCell>PRO Plan - Monthly</TableCell>
                    <TableCell>$29.00</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">Download</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mar 1, 2023</TableCell>
                    <TableCell>PRO Plan - Monthly</TableCell>
                    <TableCell>$29.00</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">Download</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}