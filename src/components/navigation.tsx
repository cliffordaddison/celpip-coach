'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, BookOpen, PenTool, Mic, BarChart3, Target, FileText } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/vocabulary', icon: BookOpen, label: 'Vocabulary' },
  { href: '/grammar', icon: Target, label: 'Grammar' },
  { href: '/write', icon: PenTool, label: 'Write' },
  { href: '/speak', icon: Mic, label: 'Speak' },
  { href: '/mock-tests', icon: FileText, label: 'Tests' },
  { href: '/progress', icon: BarChart3, label: 'Progress' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors min-w-0',
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium truncate max-w-16">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
