import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Mail, RefreshCw, Users } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  source: string | null;
}

const NewsletterSubscribers = () => {
  const [exporting, setExporting] = useState(false);

  const { data: subscribers = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-newsletter-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      return data as Subscriber[];
    },
  });

  const activeSubscribers = subscribers.filter((s) => s.is_active);

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const headers = ["Email", "Subscribed At", "Active", "Source"];
      const csvContent = [
        headers.join(","),
        ...subscribers.map((s) =>
          [
            s.email,
            format(new Date(s.subscribed_at), "yyyy-MM-dd HH:mm:ss"),
            s.is_active ? "Yes" : "No",
            s.source || "N/A",
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Subscribers exported successfully!");
    } catch (error) {
      toast.error("Failed to export subscribers");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-vibrant-mint rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Total Subscribers
            </span>
          </div>
          <p className="text-4xl font-extrabold">{subscribers.length}</p>
        </div>
        <div className="bg-vibrant-lavender rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Active
            </span>
          </div>
          <p className="text-4xl font-extrabold">{activeSubscribers.length}</p>
        </div>
        <div className="bg-vibrant-yellow rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Inactive
            </span>
          </div>
          <p className="text-4xl font-extrabold">
            {subscribers.length - activeSubscribers.length}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
        <button
          onClick={handleExportCSV}
          disabled={exporting || subscribers.length === 0}
          className="px-4 py-2 bg-vibrant-coral rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Subscribers Table */}
      {isLoading ? (
        <div className="text-center py-12 font-serif text-foreground/60">
          Loading subscribers...
        </div>
      ) : subscribers.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 text-center border border-foreground/10">
          <Mail className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
          <p className="font-serif text-foreground/60">
            No subscribers yet. Share your blog to start collecting leads!
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-foreground/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-foreground/5">
                <tr>
                  <th className="text-left px-6 py-4 font-bold uppercase text-sm tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 font-bold uppercase text-sm tracking-wider">
                    Subscribed
                  </th>
                  <th className="text-left px-6 py-4 font-bold uppercase text-sm tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 font-bold uppercase text-sm tracking-wider">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber.id}
                    className="hover:bg-foreground/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{subscriber.email}</td>
                    <td className="px-6 py-4 text-foreground/70">
                      {format(new Date(subscriber.subscribed_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          subscriber.is_active
                            ? "bg-vibrant-mint"
                            : "bg-foreground/20"
                        }`}
                      >
                        {subscriber.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/70 capitalize">
                      {subscriber.source || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterSubscribers;
