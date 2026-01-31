'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { FolderKanban, Plus } from 'lucide-react'
import Header from '@/components/layout/Header'
import ProjectCard from '@/components/ui/ProjectCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import { DribbbleProject } from '@/types/dribbble'

export default function ProjectsPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<DribbbleProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 12

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/dribbble/projects?page=${page}&per_page=${perPage}`
      )
      if (!res.ok) throw new Error('Failed to fetch projects')
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, perPage])

  useEffect(() => {
    if (session?.accessToken) {
      fetchProjects()
    }
  }, [session, fetchProjects])

  return (
    <div>
      <Header
        title="Projects"
        subtitle="Organize your shots into projects"
      />

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>

          <a
            href="https://dribbble.com/projects/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </a>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 px-4 py-2 bg-dribbble-pink text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="w-8 h-8" />}
            title="No projects yet"
            description="Create projects to organize your shots into collections."
            action={
              <a
                href="https://dribbble.com/projects/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </a>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && projects.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={5}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
