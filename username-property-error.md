# Property 'username' does not exist on type 'ObjectId' Hatası

Bu hata, MongoDB'nin ilişkisel verileri nasıl sakladığı ile TypeScript'in tip sisteminin etkileşiminden kaynaklanmaktadır. İşte detaylı açıklama:

## Hatanın Sebebi

1. MongoDB'de yorum (comment) verileri şu şekilde saklanır:
   ```typescript
   {
     content: "yorum metni",
     author: "507f1f77bcf86cd799439011" // Bu bir ObjectId
   }
   ```

2. Varsayılan durumda, `comment.author` bir ObjectId'dir ve username gibi özelliklere sahip değildir.

## Çözüm

1. `TPopulatedComment` tipini tanımlayarak populate edilmiş veriler için özel bir tip oluşturduk:
   ```typescript
   type TPopulatedComment = Omit<TComment, 'author'> & {
     author: Pick<TUser, '_id' | 'username'>;
   };
   ```

2. Mongoose populate işlemini bu tip ile birlikte kullanıyoruz:
   ```typescript
   const post = await Post.findById(postId).populate<{ comments: TPopulatedComment[] }>({
     path: "comments.author",
     select: "username",
   });
   ```

## Nasıl Çalışır?

1. `populate()` işlemi çalıştığında, MongoDB ObjectId'yi kullanarak User koleksiyonundan ilgili kullanıcı bilgilerini getirir.
2. `TPopulatedComment` tipi sayesinde TypeScript, populate edilmiş verilerde `username` özelliğinin var olduğunu bilir.
3. Bu sayede `comment.author.username` şeklinde erişim yapabiliriz ve TypeScript hata vermez.

Böylece hem tip güvenliği sağlanmış hem de MongoDB'nin ilişkisel veri yapısı doğru şekilde modellenmiş olur.