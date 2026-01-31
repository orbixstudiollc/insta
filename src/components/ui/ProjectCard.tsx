'use client'

import Link from 'next/link'
import { FolderKanban, Image as ImageIcon } from 'lucide-react'
import { DribbbleProject } from '@/types/dribbble'
import { formatDistanceToNow } from 'date-fns'

interface ProjectCardProps {
  project: DribbbleProject
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-dribbble-pink/30 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-dribbble-pink/10 transition-colors">
          <FolderKanban className="w-6 h-6 text-gray-600 group-hover:text-dribbble-pink transition-colors" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-dribbble-pink transition-colors truncate">
            {project.name}
          </h3>

          {project.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {project.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              {project.shots_count} shots
            </span>
            <span className="text-gray-300">|</span>
            <span>
              Updated{' '}
              {formatDistanceToNow(new Date(project.updated_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
