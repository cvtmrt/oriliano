/**
 * Yönetici şifresi için bcrypt karması üretir.
 *
 *   npm run hash -- "sifreniz"
 *
 * Çıktıyı Railway'de ADMIN_PASSWORD_HASH ortam değişkenine yapıştırın.
 * Şifrenin kendisi hiçbir yere kaydedilmez.
 */
import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('Kullanım: npm run hash -- "sifreniz"')
  process.exit(1)
}

if (password.length < 10) {
  console.error('Şifre en az 10 karakter olmalı.')
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 12)

console.log('')
console.log('ADMIN_PASSWORD_HASH=' + hash)
console.log('')
console.log('Bu satırı Railway → Variables bölümüne ekleyin.')
