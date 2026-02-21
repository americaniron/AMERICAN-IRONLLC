import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Send, CheckCircle2 } from "lucide-react";

const quoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  shipTo: z.string().optional(),
  notes: z.string().optional(),
  items: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export default function QuoteRequest() {
  const { toast } = useToast();

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      shipTo: "",
      notes: "",
      items: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      return apiRequest("POST", "/api/quotes", data);
    },
    onSuccess: () => {
      toast({ title: "Quote Request Sent", description: "We'll respond within one business day." });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    },
  });

  return (
    <div>
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-parts.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight" data-testid="text-quote-title">
            Request Parts Quote
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Send part numbers, quantities, and delivery details for a comprehensive quote.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">What to Include</h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Part numbers and quantities",
                  "Machine model/serial (if available)",
                  "Shipping destination (city/state/country)",
                  "Preferred delivery time",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Card className="mt-6 p-5 border-card-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Need help?</div>
                    <div className="text-xs text-muted-foreground">Contact our specialists</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Call +1 (850) 777-3797 or email info@americanironus.com for immediate assistance.
                </p>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="p-6 border-card-border">
                <h2 className="text-lg font-bold mb-6">Send Quote Request</h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} data-testid="input-quote-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@company.com" {...field} data-testid="input-quote-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone / WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (xxx) xxx-xxxx" {...field} data-testid="input-quote-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ship To (City/State/Country)</FormLabel>
                          <FormControl>
                            <Input placeholder="Tampa, FL, USA" {...field} data-testid="input-quote-shipto" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="items"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Part Numbers & Quantities</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. 5P-8500 x2, 1R-0750 x1"
                              className="resize-none"
                              rows={3}
                              {...field}
                              data-testid="input-quote-items"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional details..."
                              className="resize-none"
                              rows={3}
                              {...field}
                              data-testid="input-quote-notes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-accent text-accent-foreground gap-2"
                      size="lg"
                      disabled={mutation.isPending}
                      data-testid="button-submit-quote"
                    >
                      {mutation.isPending ? "Sending..." : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Quote Request
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
