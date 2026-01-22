import { getOrders } from '@/supabase/orders'
import { Package, Clock, CheckCircle2, Truck } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import type { Order, OrderItem } from '@/types/order'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import EmptyComponent from '@/components/ui/EmptyComponent'

const statusIcons: Record<string, any> = {
  pending: <Clock className="text-amber-500" size={18} />,
  shipped: <Truck className="text-blue-500" size={18} />,
  delivered: <CheckCircle2 className="text-emerald-500" size={18} />,
}

export default async function OrdersPage() {
  const { data: orders, error } = await getOrders()

  console.log(orders)

  if (error)
    return (
      <div className="container py-20 text-center">Error loading orders.</div>
    )
  if (!orders || orders.length === 0) {
    return (
      <>
        <EmptyComponent
          title="No Orders Yet"
          message="You haven't placed any orders yet. Browse products and shop to see your orders here."
        />
        <Button className="block w-fit mx-auto" asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </>
    )
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <h1 className="text-3xl font-bold">Order History</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-card border rounded-3xl overflow-hidden shadow-sm"
          >
            {/* Order Header */}
            <div className="p-6 border-b bg-muted/30 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Order ID
                </p>
                <p className="font-mono text-sm">
                  #ORD-{order.id.toString().padStart(5, '0')}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Date
                </p>
                <p className="text-sm">
                  {format(new Date(order.created_at), 'PPP')}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Status
                </p>
                <div className="flex items-center gap-2 text-sm font-medium capitalize">
                  {statusIcons[order.status]} {order.status}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Total
                </p>
                <p className="font-bold text-primary">
                  {order.total_price.toFixed(2)} LE
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 space-y-4">
              {order.order_items.map((item: OrderItem) => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.products?.product_images?.[0]?.display_url ? (
                    <Image
                      src={item.products.product_images[0].display_url}
                      alt={item.products.name}
                      width={100}
                      height={100}
                      className="w-16 h-16 bg-muted rounded-xl shrink-0"
                    />
                  ) : (
                    <Package className="w-full h-full p-4 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.products?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} x {item.price_at_purchase}LE
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
