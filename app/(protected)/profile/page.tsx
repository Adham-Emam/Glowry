import { Metadata } from 'next'
import ProfileComponent from './components/ProfileComponent'

export const metadata: Metadata = {
  title: 'Glowry | Profile',
}

export default function ProfilePage() {
  return <ProfileComponent />
}
