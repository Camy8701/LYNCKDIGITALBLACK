import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrders, useDownloadProduct } from "@/hooks/useOrders";
import Button from "@/components/Button";
import { OrderWithItems } from "@/types/dashboard";
import { ChevronDown, ChevronUp, Download, FileText, Package } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";

const OrderHistory = () => {
  const { data: orders = [], isLoading } = useOrders();
  const downloadProduct = useDownloadProduct();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleDownload = async (orderItemId: string) => {
    await downloadProduct.mutateAsync(orderItemId);
  };

  const generateReceipt = (order: OrderWithItems) => {
    const doc = new jsPDF();

    // Company Header
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('LYNCK DIGITAL', 20, 20);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Digital Products Store', 20, 28);
    doc.text('info@lynckstudio.pro', 20, 34);

    // Receipt Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('ORDER RECEIPT', 20, 50);

    // Order Details
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Order Number: ${order.order_number}`, 20, 60);
    doc.text(`Order Date: ${format(new Date(order.created_at), 'MMM dd, yyyy')}`, 20, 67);
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, 74);
    doc.text(`Payment Method: ${order.payment_method}`, 20, 81);

    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);

    // Items Header
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('ITEMS', 20, 100);

    // Items List
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    let yPos = 110;

    (order.order_items || []).forEach((item, index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(`${index + 1}. ${item.product_name}`, 20, yPos);
      doc.text(`Qty: ${item.quantity}`, 130, yPos);
      doc.text(`$${item.unit_price.toFixed(2)}`, 160, yPos);
      doc.text(`$${item.subtotal.toFixed(2)}`, 180, yPos, { align: 'right' });

      if (item.product_description) {
        yPos += 5;
        doc.setFontSize(8);
        doc.setTextColor(100);
        const descLines = doc.splitTextToSize(item.product_description, 160);
        doc.text(descLines.slice(0, 2), 25, yPos);
        doc.setTextColor(0);
        doc.setFontSize(10);
        yPos += (Math.min(descLines.length, 2) * 4);
      }

      yPos += 10;
    });

    // Totals
    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    doc.setFont(undefined, 'normal');
    doc.text('Subtotal:', 130, yPos);
    doc.text(`$${order.subtotal.toFixed(2)}`, 180, yPos, { align: 'right' });

    yPos += 7;
    doc.text('Tax:', 130, yPos);
    doc.text(`$${order.tax.toFixed(2)}`, 180, yPos, { align: 'right' });

    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', 130, yPos);
    doc.text(`$${order.total.toFixed(2)}`, 180, yPos, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text('Thank you for your purchase!', 105, 280, { align: 'center' });
    doc.text('For support, contact info@lynckstudio.pro', 105, 285, { align: 'center' });

    // Save PDF
    doc.save(`receipt-${order.order_number}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-foreground"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-vibrant-lavender rounded-3xl p-12 text-center">
        <Package className="w-20 h-20 text-foreground/20 mx-auto mb-6" />
        <h3 className="text-2xl md:text-3xl font-extrabold uppercase mb-4 font-sans">
          No orders yet
        </h3>
        <p className="text-base md:text-lg text-foreground/70 mb-8 font-serif max-w-md mx-auto">
          Start exploring our digital products collection and make your first purchase!
        </p>
        <Link to="/">
          <Button variant="filled" className="text-base py-4 px-8">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);
        const itemCount = order.order_items?.length || 0;

        return (
          <div
            key={order.id}
            className="bg-accent-orange/10 rounded-3xl overflow-hidden"
          >
            {/* Order Header */}
            <button
              onClick={() => toggleOrder(order.id)}
              className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-accent-orange/5 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-xl md:text-2xl font-extrabold font-sans">
                    {order.order_number}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      order.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : order.status === 'pending'
                        ? 'bg-yellow-500 text-foreground'
                        : order.status === 'failed'
                        ? 'bg-red-500 text-white'
                        : 'bg-foreground/20 text-foreground'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-foreground/60 font-serif">
                  {format(new Date(order.created_at), 'MMMM dd, yyyy')} •{' '}
                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-extrabold font-sans">
                    ${order.total.toFixed(2)}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-foreground/60" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-foreground/60" />
                )}
              </div>
            </button>

            {/* Order Items (Expanded) */}
            {isExpanded && (
              <div className="border-t-2 border-foreground/10 p-6 md:p-8 space-y-6">
                {/* Order Items List */}
                {(order.order_items || []).map((item) => (
                  <div
                    key={item.id}
                    className="bg-background/50 rounded-2xl p-6 flex flex-col md:flex-row gap-6"
                  >
                    {/* Product Image */}
                    {item.product_image_url && (
                      <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.product_image_url}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="text-xl md:text-2xl font-extrabold mb-2 font-sans">
                        {item.product_name}
                      </h4>
                      {item.product_description && (
                        <p className="text-sm text-foreground/70 mb-3 font-serif line-clamp-2">
                          {item.product_description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm font-serif text-foreground/60">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>${item.unit_price.toFixed(2)} each</span>
                      </div>

                      {/* Download Info */}
                      {order.status === 'completed' && (
                        <div className="mt-4 flex items-center gap-3">
                          <Button
                            variant="filled"
                            className="text-sm py-2 px-4 flex items-center gap-2"
                            onClick={() => handleDownload(item.id)}
                            disabled={
                              downloadProduct.isPending ||
                              item.download_count >= item.max_downloads
                            }
                          >
                            <Download className="w-4 h-4" />
                            {downloadProduct.isPending ? 'Downloading...' : 'Download'}
                          </Button>
                          <span className="text-xs font-bold text-foreground/60 font-sans">
                            Downloads: {item.download_count}/{item.max_downloads}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="text-xl md:text-2xl font-extrabold font-sans">
                        ${item.subtotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="bg-background/50 rounded-2xl p-6">
                  <div className="space-y-3 max-w-md ml-auto">
                    <div className="flex justify-between text-base font-serif">
                      <span>Subtotal:</span>
                      <span className="font-bold font-sans">${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-serif">
                      <span>Tax:</span>
                      <span className="font-bold font-sans">${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-foreground/10 pt-3 flex justify-between text-xl font-extrabold font-sans">
                      <span>Total:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="transparent"
                      className="text-sm py-2 px-4 flex items-center gap-2"
                      onClick={() => generateReceipt(order)}
                    >
                      <FileText className="w-4 h-4" />
                      Download Receipt
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderHistory;
