import { DollarSign, Calendar, Repeat, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useRevenueMetrics, useRefundRate } from "@/hooks/useAdminAnalytics";
import { cn } from "@/lib/utils";

const RevenueCommandCenter = () => {
  const { data: revenue, isLoading: revenueLoading } = useRevenueMetrics();
  const { data: refundData, isLoading: refundLoading } = useRefundRate();

  if (revenueLoading || refundLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4 text-white">
          REVENUE COMMAND CENTER
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="w-10 h-10 bg-[#333] rounded-full mb-3"></div>
              <div className="h-12 bg-[#333] rounded mb-2"></div>
              <div className="h-4 bg-[#333] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-extrabold uppercase font-sans mb-4 text-white">
        REVENUE COMMAND CENTER
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today vs Yesterday */}
        <div className="stat-card transition-transform hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-lg bg-[#e64a19]/20 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-[#e64a19]" />
          </div>
          <div className="text-4xl font-extrabold font-sans text-white">
            ${revenue?.today.toFixed(2) || '0.00'}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">
            Today
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            {revenue && revenue.todayVsYesterday !== 0 && (
              <>
                {revenue.todayVsYesterday > 0 ? (
                  <TrendingUp className="w-3 h-3 text-[#ccff00]" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={revenue.todayVsYesterday > 0 ? "text-[#ccff00]" : "text-red-500"}>
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
        <div className="stat-card-lime transition-transform hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-lg bg-[#ccff00]/20 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-[#ccff00]" />
          </div>
          <div className="text-4xl font-extrabold font-sans text-white">
            ${revenue?.monthToDate.toFixed(2) || '0.00'}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">
            Month-to-Date
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            {revenue && revenue.monthVsLastMonth !== 0 && (
              <>
                {revenue.monthVsLastMonth > 0 ? (
                  <TrendingUp className="w-3 h-3 text-[#ccff00]" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={revenue.monthVsLastMonth > 0 ? "text-[#ccff00]" : "text-red-500"}>
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

        {/* One-Time Revenue */}
        <div className="stat-card transition-transform hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-lg bg-[#e64a19]/20 flex items-center justify-center mb-3">
            <Repeat className="w-5 h-5 text-[#e64a19]" />
          </div>
          <div className="text-4xl font-extrabold font-sans text-white">
            100%
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">
            One-Time Sales
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Recurring revenue: Coming soon
          </div>
        </div>

        {/* Refund Rate Alarm */}
        <div className={cn(
          "transition-all",
          refundData?.isAlarm
            ? "stat-card border-red-500/50 shadow-lg shadow-red-500/10"
            : "stat-card-lime"
        )}>
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
            refundData?.isAlarm ? "bg-red-500/20" : "bg-[#ccff00]/20"
          )}>
            <AlertTriangle className={cn(
              "w-5 h-5",
              refundData?.isAlarm ? "text-red-500" : "text-[#ccff00]"
            )} />
          </div>
          <div className="text-4xl font-extrabold font-sans text-white">
            {refundData?.rate.toFixed(1) || '0.0'}%
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">
            Refund Rate
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {refundData?.isAlarm && (
              <span className="font-bold text-red-500">ALARM: Above 5% threshold!</span>
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
