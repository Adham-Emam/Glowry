import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { PackageSearch } from 'lucide-react'

export default function EmptyProducts() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageSearch className="text-muted-foreground w-full" />
        </EmptyMedia>
        <EmptyTitle>No products found</EmptyTitle>
        <EmptyDescription>
          No products found, stay tuned for upcoming products.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
