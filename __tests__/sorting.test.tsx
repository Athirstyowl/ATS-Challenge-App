import { render, screen } from '@testing-library/react'
import { sortCandidates } from '../lib/utils'

describe('Candidate Sorting', () => {
  const mockCandidates = [
    { id: 5, experience: 2, skills: ['React', 'JavaScript'] },
    { id: 12, experience: 5, skills: ['React', 'TypeScript', 'Cypress'] },
  ]

  it('should sort candidates by experience in descending order', () => {
    const sortedCandidates = sortCandidates(mockCandidates, 'experience', 'desc')
    expect(sortedCandidates[0].id).toBe(12)
    expect(sortedCandidates[1].id).toBe(5)
  })

  it('should filter candidates by React and Cypress skills', () => {
    const filteredCandidates = mockCandidates.filter(candidate => 
      candidate.skills.includes('React') && 
      candidate.skills.includes('Cypress')
    )
    expect(filteredCandidates[0].id).toBe(12)
  })
}) 