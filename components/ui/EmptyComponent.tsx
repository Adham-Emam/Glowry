import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { PackageSearch } from 'lucide-react'

export default function EmptyComponent({title, message,}:{title:string, message:string}) {
  return (
    <Empty className='mt-25'>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageSearch className="text-muted-foreground w-full" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {message}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
