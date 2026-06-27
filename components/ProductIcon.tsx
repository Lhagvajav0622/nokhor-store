'use client'

import {
  Cat,
  Dog,
  Rabbit,
  Fish,
  Bird,
  PawPrint,
  Package,
} from '@phosphor-icons/react'

type Props = {
  name: string
  size?: number
  className?: string
  weight?: 'fill' | 'regular' | 'bold'
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; weight?: 'fill' | 'regular' | 'bold' }>> = {
  Cat,
  Dog,
  Rabbit,
  Fish,
  Bird,
  PawPrint,
  Package,
}

export default function ProductIcon({ name, size = 64, className, weight = 'fill' }: Props) {
  const Icon = ICON_MAP[name] || Package
  return <Icon size={size} className={className} weight={weight} />
}
