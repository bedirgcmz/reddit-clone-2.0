// ProfilePage.tsx
import { auth } from '@/lib/auth' // auth.ts modülünü server-side'dan import edin
import UserPost from './UserPosts'

const ProfilePage = async () => {
  // Kullanıcıyı auth'tan alıyoruz
  const user = await auth.getUser()

  if (!user) {
    return <p>You must be logged in to view this page.</p>
  }

  // Kullanıcıyı başarıyla aldıysak, userId'yi props olarak geçiyoruz
  return (
    <div>
      <h1>Profile Page</h1>
      <UserPost userId={user.id} />
    </div>
  )
}

export default ProfilePage
