import { DollarSign, Calendar, Repeat, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useRevenueMetrics, useRefundRate } from "@/hooks/useAdminAnalytics";
import { cn } from "@/lib/utils";

const RevenueCommandCenter = () => {
  const { data: revenue, isLoading: revenueLoading } = useRevenueMetrics();
  const { data: refundData, isLoading: refundLoading } = useRefundRate();

  if (revenueLoading || refundLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4">
          REVENUE COMMAND CENTER
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-3xl p-6 animate-pulse">
              <div className="w-10 h-10 bg-foreground/10 rounded-full mb-3"></div>
              <div className="h-12 bg-foreground/10 rounded mb-2"></div>
              <div className="h-4 bg-foreground/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-extrabold uppercase font-sans mb-4">
        REVENUE COMMAND CENTER
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today vs Yesterday */}
        <div className="bg-vibrant-mint rounded-3xl p-6 transition-transform hover:scale-105">
          <DollarSign className="w-10 h-10 mb-3 text-foreground/80" />
          <div className="text-4xl font-extrabold font-sans">
            ${revenue?.today.toFixed(2) || '0.00'}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground/70 mt-1">
            Today
          </div>
          <div className="flex items-center gap-1 text-xs text-foreground/60 mt-2">
            {revenue && revenue.todayVsYesterday !== 0 && (
              <>
                {revenue.todayVsYesterday > 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span className={revenue.todayVsYesterday > 0 ? "text-green-600" : "text-red-600"}>
                  {revenue.todayVsYesterday > 0 ? '+' : ''}
                  {revenue.todayVsYesterday.toFixed(1)}% vs yesterday
                </span>
              </>
            )}
            {revenue && revenue.todayVsYesterday === 0 && (
              <span>Same as yesterday</span>
            )}
          </div>
        </div>

        {/* Month-to-Date vs Last Month */}
        <div className="bg-vibrant-purple rounded-3xl p-6 transition-transform hover:scale-105">
          <Calendar className="w-10 h-10 mb-3 text-foreground/80" />
          <div className="text-4xl font-extrabold font-sans">
            ${revenue?.monthToDate.toFixed(2) || '0.00'}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground/70 mt-1">
            Month-to-Date
          </div>
          <div className="flex items-center gap-1 text-xs text-foreground/60 mt-2">
            {revenue && revenue.monthVsLastMonth !== 0 && (
              <>
                {revenue.monthVsLastMonth > 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span className={revenue.monthVsLastMonth > 0 ? "text-green-600" : "text-red-600"}>
                  {revenue.monthVsLastMonth > 0 ? '+' : ''}
                  {revenue.monthVsLastMonth.toFixed(1)}% vs last month
                </span>
              </>
            )}
            {revenue && revenue.monthVsLastMonth === 0 && (
              <span>Same as last month</span>
            )}
          </div>
        </div>

        {/* One-Time Revenue (all revenue is one-time for now) */}
        <div className="bg-vibrant-yellow rounded-3xl p-6 transition-transform hover:scale-105">
          <Repeat className="w-10 h-10 mb-3 text-foreground/80" />
          <div className="text-4xl font-extrabold font-sans">
            100%
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground/70 mt-1">
            One-Time Sales
          </div>
          <div className="text-xs text-foreground/60 mt-2">
            Recurring revenue: Coming soon
          </div>
        </div>

        {/* Refund Rate Alarm */}
        <div className={cn(
          "rounded-3xl p-6 transition-all",
          refundData?.isAlarm
            ? "bg-vibrant-coral shadow-lg shadow-vibrant-coral/20 animate-pulse"
            : "bg-vibrant-mint"
        )}>
          <AlertTriangle className={cn(
            "w-10 h-10 mb-3",
            refundData?.isAlarm ? "text-red-700" : "text-foreground/80"
          )} />
          <div className="text-4xl font-extrabold font-sans">
            {refundData?.rate.toFixed(1) || '0.0'}%
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground/70 mt-1">
            Refund Rate
          </div>
          <div className="text-xs text-foreground/60 mt-2">
            {refundData?.isAlarm && (
              <span className="font-bold text-red-700">⚠️ ALARM: Above 5% threshold!</span>
            )}
            {!refundData?.isAlarm && (
              <span>{refundData?.refundedCount || 0} of {refundData?.totalCount || 0} orders (30 days)</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueCommandCenter;
