import Link from 'next/link'
import { StaggerItem } from '@/components/motion'
import SmartImage from './SmartImage'

export default function TeamCard({
  href: to,
  name,
  title,
  photo,
  expertise,
}: {
  href: string
  name: string
  title: string
  photo: { src: string | null; alt: string }
  expertise: string[]
}) {
  return (
    <StaggerItem as="li" className="group">
      <Link href={to} className="block h-full">
        <div className="overflow-hidden border border-paper-line bg-white transition-[border-color,box-shadow] duration-300 group-hover:border-navy-200 group-hover:shadow-lift">
          <SmartImage
            src={photo.src}
            alt={photo.alt || name}
            ratio="aspect-[4/5]"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="p-6">
            <h3 className="font-serif text-lg text-navy-900">{name}</h3>
            {title ? (
              <p className="mt-1 text-[0.82rem] uppercase tracking-wider text-graphite-500">
                {title}
              </p>
            ) : null}
            {expertise.length > 0 ? (
              <ul className="mt-4 space-y-1">
                {expertise.slice(0, 3).map((item) => (
                  <li key={item} className="text-sm text-graphite-600">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Link>
    </StaggerItem>
  )
}
