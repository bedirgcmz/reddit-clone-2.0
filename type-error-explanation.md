# TypeScript Error: Property 'username' does not exist on type 'ObjectId'

Bu hata, MongoDB ObjectId türü ile ilgili bir TypeScript tip uyumsuzluğundan kaynaklanıyor. Hatanın nedenleri ve çözümü şu şekilde:

## Hatanın Nedeni

1. Frontend bileşenlerinde (`home-posts.tsx` ve `[id]/page.tsx`) post.author.username şeklinde erişim yapılıyor:
   ```typescript
   r/{author.username}
   ```

2. Ancak MongoDB'de post.author alanı muhtemelen sadece bir ObjectId referansı olarak saklanıyor ve direkt olarak username bilgisini içermiyor.

## Çözüm Yolları

1. Backend tarafında post verilerini getirirken population işlemi yapılmalı:
   ```typescript
   // MongoDB/Mongoose query'de
   await Post.findById(id).populate('author', 'username')
   ```

2. Tip tanımlamalarında author alanının doğru şekilde tanımlanması:
   ```typescript
   type Post = {
     author: {
       id: string;
       username: string;
     };
     // diğer alanlar...
   }
   ```

3. API response'larında author bilgisinin tam olarak dönülmesi

Bu sorunu çözmek için backend'de populate işleminin doğru yapıldığından ve frontend tip tanımlamalarının backend'den dönen veri yapısıyla eşleştiğinden emin olunmalıdır.