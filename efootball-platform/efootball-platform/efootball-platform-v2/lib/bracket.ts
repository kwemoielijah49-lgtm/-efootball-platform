export function generateSingleElimBracket(teamIds: string[], tournamentId: string) {
  const size = Math.pow(2, Math.ceil(Math.log2(teamIds.length)))
  const padded = [...teamIds]
  while (padded.length < size) padded.push('BYE')

  const matches = []
  let round = 1
  let pairs = []

  for (let i = 0; i < padded.length; i += 2) {
    pairs.push({ a: padded[i], b: padded[i + 1], pos: i / 2 })
  }

  for (const pair of pairs) {
    matches.push({
      tournament_id: tournamentId,
      round,
      bracket_position: pair.pos,
      team_a_id: pair.a === 'BYE' ? null : pair.a,
      team_b_id: pair.b === 'BYE' ? null : pair.b,
      status: pair.b === 'BYE' ? 'confirmed' : 'scheduled',
      winner_id: pair.b === 'BYE' ? pair.a : null,
    })
  }

  const totalRounds = Math.log2(size)
  for (let r = 2; r <= totalRounds; r++) {
    const matchesInRound = size / Math.pow(2, r)
    for (let pos = 0; pos < matchesInRound; pos++) {
      matches.push({
        tournament_id: tournamentId,
        round: r,
        bracket_position: pos,
        team_a_id: null,
        team_b_id: null,
        status: 'scheduled',
        winner_id: null,
      })
    }
  }

  return matches
}

export function getRoundName(round: number, totalRounds: number) {
  const diff = totalRounds - round
  if (diff === 0) return 'Final'
  if (diff === 1) return 'Semi-Final'
  if (diff === 2) return 'Quarter-Final'
  return `Round ${round}`
}
