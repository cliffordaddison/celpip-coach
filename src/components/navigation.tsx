'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, PenTool, Mic, BarChart3, Target, FileText, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/vocabulary', icon: BookOpen, label: 'Vocabulary' },
  { href: '/grammar', icon: Target, label: 'Grammar' },
  { href: '/practice', icon: PenTool, label: 'Practice' },
  { href: '/write', icon: PenTool, label: 'Write' },
  { href: '/speak', icon: Mic, label: 'Speak' },
  { href: '/mock-tests', icon: FileText, label: 'Tests' },
  { href: '/resources', icon: BookOpen, label: 'Resources' },
  { href: '/progress', icon: BarChart3, label: 'Progress' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors min-w-0',
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              )}
            >
              <item.icon className="w-4 h-4 mb-1" />
              <span className="text-xs font-medium truncate px-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
