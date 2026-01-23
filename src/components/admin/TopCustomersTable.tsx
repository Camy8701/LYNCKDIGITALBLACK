import { Crown, Mail, Gift } from "lucide-react";
import { useTopCustomers } from "@/hooks/useAdminAnalytics";
import { toast } from "sonner";

const TopCustomersTable = () => {
  const { data: customers, isLoading } = useTopCustomers(10);

  const handleThankYou = (email: string, name: string | null) => {
    toast.success(`Thank you email sent to ${name || email}`);
  };

  const handleUpsell = (email: string, name: string | null) => {
    toast.success(`Upsell offer sent to ${name || email}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4 text-white">
          TOP CUSTOMERS (WHALE TRACKER)
        </h2>
        <div className="stat-card animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-[#333] rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4 text-white">
          TOP CUSTOMERS (WHALE TRACKER)
        </h2>
        <div className="stat-card text-center py-8">
          <Crown className="w-16 h-16 mx-auto mb-4 text-[#333]" />
          <h3 className="text-xl font-bold font-sans mb-2 text-white">No Customers Yet</h3>
          <p className="text-muted-foreground font-serif">
            Your top spending customers will appear here
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Crown className="w-8 h-8 text-[#e64a19]" />
        <h2 className="text-2xl font-extrabold uppercase font-sans text-white">
          TOP CUSTOMERS (WHALE TRACKER)
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block stat-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#222]">
              <th className="text-left text-xs font-bold uppercase p-3 text-muted-foreground">
                #
              </th>
              <th className="text-left text-xs font-bold uppercase p-3 text-muted-foreground">
                Customer
              </th>
              <th className="text-left text-xs font-bold uppercase p-3 text-muted-foreground">
                Orders
              </th>
              <th className="text-left text-xs font-bold uppercase p-3 text-muted-foreground">
                Total Spent
              </th>
              <th className="text-left text-xs font-bold uppercase p-3 text-muted-foreground">
                Last Purchase
              </th>
              <th className="text-left text-xs font-bold uppercase p-3 text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                key={customer.id}
                className="border-b border-[#222]/50 hover:bg-[#222]/30 transition-colors"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Crown className="w-4 h-4 text-[#e64a19]" />}
                    <span className="text-sm font-bold font-sans text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="font-bold text-sm font-sans text-white">
                    {customer.fullName || 'Anonymous'}
                  </div>
                  <div className="text-xs text-muted-foreground">{customer.email}</div>
                </td>
                <td className="p-3">
                  <span className="font-bold font-sans text-[#e64a19]">
                    {customer.totalPurchases}
                  </span>
                </td>
                <td className="p-3">
                  <span className="font-bold font-sans text-[#ccff00] text-lg">
                    ${customer.totalSpent.toFixed(2)}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(customer.lastPurchaseDate)}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleThankYou(customer.email, customer.fullName)}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#333] text-white hover:border-[#ccff00] hover:text-[#ccff00] transition-colors font-bold uppercase flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      Thank You
                    </button>
                    <button
                      onClick={() => handleUpsell(customer.email, customer.fullName)}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#e64a19] text-white hover:bg-[#e64a19]/80 transition-colors font-bold uppercase flex items-center gap-1"
                    >
                      <Gift className="w-3 h-3" />
                      Upsell
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {customers.map((customer, index) => (
          <div
            key={customer.id}
            className="stat-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {index === 0 && <Crown className="w-4 h-4 text-[#e64a19]" />}
                  <span className="font-bold text-sm font-sans text-white">
                    {customer.fullName || 'Anonymous'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">{customer.email}</div>
              </div>
              <div className="text-right">
                <div className="font-bold font-sans text-[#ccff00] text-xl">
                  ${customer.totalSpent.toFixed(0)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-[#0a0a0a]/50 border border-[#222] rounded-xl p-2">
                <div className="text-xs text-muted-foreground uppercase font-bold">Orders</div>
                <div className="text-lg font-extrabold font-sans text-[#e64a19]">
                  {customer.totalPurchases}
                </div>
              </div>
              <div className="bg-[#0a0a0a]/50 border border-[#222] rounded-xl p-2">
                <div className="text-xs text-muted-foreground uppercase font-bold">Last Purchase</div>
                <div className="text-xs font-bold text-white">
                  {formatDate(customer.lastPurchaseDate)}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleThankYou(customer.email, customer.fullName)}
                className="flex-1 text-xs py-2 px-3 rounded-full border border-[#333] text-white hover:border-[#ccff00] hover:text-[#ccff00] transition-colors font-bold uppercase"
              >
                <Mail className="w-3 h-3 inline mr-1" />
                Thank You
              </button>
              <button
                onClick={() => handleUpsell(customer.email, customer.fullName)}
                className="flex-1 text-xs py-2 px-3 rounded-full bg-[#e64a19] text-white hover:bg-[#e64a19]/80 transition-colors font-bold uppercase"
              >
                <Gift className="w-3 h-3 inline mr-1" />
                Upsell
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCustomersTable;
