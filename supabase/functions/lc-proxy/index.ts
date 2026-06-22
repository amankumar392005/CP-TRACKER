

// // supabase/functions/lc-proxy/index.ts
// // Fetches real LeetCode data via public GraphQL API

// import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// const CORS = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// }

// const QUERY = `
// query getUserProfile($username: String!) {
//   matchedUser(username: $username) {
//     username
//     profile { realName userAvatar ranking countryName }
//     submitStats {
//       acSubmissionNum { difficulty count submissions }
//     }
//     tagProblemCounts {
//       advanced      { tagName problemsSolved }
//       intermediate  { tagName problemsSolved }
//       fundamental   { tagName problemsSolved }
//     }
//     languageProblemCount { languageName problemsSolved }
//   }
//   userContestRanking(username: $username) {
//     rating globalRanking totalParticipants topPercentage attendedContestsCount
//   }
//   userContestRankingHistory(username: $username) {
//     attended rating ranking
//     contest { title startTime }
//   }
// }
// `

// serve(async (req) => {
//   if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

//   try {
//     const url    = new URL(req.url)
//     const handle = url.searchParams.get('handle')
//     if (!handle) return json({ error: 'handle is required' }, 400)

//     const res = await fetch('https://leetcode.com/graphql', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Referer': 'https://leetcode.com',
//         'User-Agent': 'Mozilla/5.0 (compatible; CPTracker/1.0)',
//       },
//       body: JSON.stringify({ query: QUERY, variables: { username: handle } }),
//     })

//     if (!res.ok) return json({ error: `LC HTTP ${res.status}` }, 502)

//     const body = await res.json()
//     const mu   = body?.data?.matchedUser
//     if (!mu) return json({ error: 'LeetCode user not found' }, 404)

//     const cr      = body?.data?.userContestRanking
//     const history = body?.data?.userContestRankingHistory ?? []

//     // Solved counts
//     const ac = mu.submitStats?.acSubmissionNum ?? []
//     const total  = ac.find((s: any) => s.difficulty === 'All')?.count      ?? 0
//     const easy   = ac.find((s: any) => s.difficulty === 'Easy')?.count     ?? 0
//     const medium = ac.find((s: any) => s.difficulty === 'Medium')?.count   ?? 0
//     const hard   = ac.find((s: any) => s.difficulty === 'Hard')?.count     ?? 0
//     const totalSubs = ac.find((s: any) => s.difficulty === 'All')?.submissions ?? 1

//     // Tag distribution
//     const tagDist: Record<string, number> = {}
//     for (const grp of [mu.tagProblemCounts?.advanced, mu.tagProblemCounts?.intermediate, mu.tagProblemCounts?.fundamental]) {
//       for (const t of grp ?? []) {
//         if (t.problemsSolved > 0) tagDist[t.tagName] = (tagDist[t.tagName] ?? 0) + t.problemsSolved
//       }
//     }

//     // Language stats
//     const langStats: Record<string, number> = {}
//     for (const l of mu.languageProblemCount ?? []) {
//       langStats[l.languageName] = l.problemsSolved
//     }

//     // Rating history
//     const ratingHistory = history
//       .filter((h: any) => h.attended)
//       .map((h: any) => ({
//         date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 7),
//         rating: Math.round(h.rating),
//         contestName: h.contest.title,
//         rank: h.ranking,
//       }))
//       .slice(-40)

//     // Recent contests with delta
//     const sortedH = [...history].filter((h: any) => h.attended)
//       .sort((a: any, b: any) => b.contest.startTime - a.contest.startTime)
//       .slice(0, 10)
//     const contests = sortedH.map((h: any, i: number) => {
//       const prev = sortedH[i + 1]
//       return {
//         name: h.contest.title,
//         date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
//         rank: h.ranking,
//         delta: prev ? Math.round(h.rating - prev.rating) : 0,
//       }
//     })

//     const maxRating = ratingHistory.length
//       ? Math.max(...ratingHistory.map((h: any) => h.rating))
//       : cr?.rating ?? 0

//     return json({
//       handle, username: mu.profile?.realName ?? handle,
//       avatar: mu.profile?.userAvatar ?? '',
//       ranking: mu.profile?.ranking ?? 0,
//       contestRating: cr ? Math.round(cr.rating) : 0,
//       maxRating: Math.round(maxRating),
//       totalSolved: total, easySolved: easy, mediumSolved: medium, hardSolved: hard,
//       totalEasy: 803, totalMedium: 1685, totalHard: 712,
//       acceptanceRate: Math.round((total / totalSubs) * 10000) / 100,
//       streak: 0, totalContests: cr?.attendedContestsCount ?? 0,
//       globalRanking: cr?.globalRanking ?? 0,
//       tagDistribution: tagDist, languageStats: langStats,
//       ratingHistory, contests,
//     })
//   } catch (e) {
//     return json({ error: String(e) }, 500)
//   }
// })

// function json(d: unknown, status = 200) {
//   return new Response(JSON.stringify(d), {
//     status, headers: { ...CORS, 'Content-Type': 'application/json' }
//   })
// }



// // supabase/functions/lc-proxy/index.ts
// // Fetches real LeetCode data via public GraphQL API

// import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// const CORS = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// }

// // Mimic an authentic browser configuration to bypass Cloudflare protection
// const LC_HEADERS = {
//   'Content-Type': 'application/json',
//   'Referer': 'https://leetcode.com',
//   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
// }

// const QUERY = `
// query getUserProfile($username: String!) {
//   matchedUser(username: $username) {
//     username
//     profile { realName userAvatar ranking countryName }
//     submitStats {
//       acSubmissionNum { difficulty count submissions }
//     }
//     tagProblemCounts {
//       advanced      { tagName problemsSolved }
//       intermediate  { tagName problemsSolved }
//       fundamental   { tagName problemsSolved }
//     }
//     languageProblemCount { languageName problemsSolved }
//   }
//   userContestRanking(username: $username) {
//     rating globalRanking totalParticipants topPercentage attendedContestsCount
//   }
//   userContestRankingHistory(username: $username) {
//     attended rating ranking
//     contest { title startTime }
//   }
// }
// `

// serve(async (req) => {
//   if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

//   try {
//     const url = new URL(req.url)
//     const handle = url.searchParams.get('handle')
//     if (!handle) return json({ error: 'handle is required' }, 400)

//     const res = await fetch('https://leetcode.com/graphql', {
//       method: 'POST',
//       headers: LC_HEADERS,
//       body: JSON.stringify({ query: QUERY, variables: { username: handle } }),
//     })

//     if (!res.ok) return json({ error: `LC HTTP Error: status ${res.status}` }, 502)

//     const body = await res.json()
    
//     // Safely check for GraphQL errors array
//     if (body.errors) {
//       return json({ error: `LC GraphQL Error: ${body.errors[0]?.message || 'Unknown source error'}` }, 400)
//     }

//     const mu = body?.data?.matchedUser
//     if (!mu) return json({ error: 'LeetCode user not found' }, 404)

//     const cr      = body?.data?.userContestRanking
//     const history = body?.data?.userContestRankingHistory ?? []

//     // Solved counts
//     const ac = mu.submitStats?.acSubmissionNum ?? []
//     const total  = ac.find((s: any) => s.difficulty === 'All')?.count      ?? 0
//     const easy   = ac.find((s: any) => s.difficulty === 'Easy')?.count     ?? 0
//     const medium = ac.find((s: any) => s.difficulty === 'Medium')?.count   ?? 0
//     const hard   = ac.find((s: any) => s.difficulty === 'Hard')?.count     ?? 0
//     const totalSubs = ac.find((s: any) => s.difficulty === 'All')?.submissions ?? 1

//     // Tag distribution
//     const tagDist: Record<string, number> = {}
//     if (mu.tagProblemCounts) {
//       for (const grp of [mu.tagProblemCounts.advanced, mu.tagProblemCounts.intermediate, mu.tagProblemCounts.fundamental]) {
//         for (const t of grp ?? []) {
//           if (t.problemsSolved > 0) tagDist[t.tagName] = (tagDist[t.tagName] ?? 0) + t.problemsSolved
//         }
//       }
//     }

//     // Language stats
//     const langStats: Record<string, number> = {}
//     for (const l of mu.languageProblemCount ?? []) {
//       langStats[l.languageName] = l.problemsSolved
//     }

//     // Rating history
//     const ratingHistory = history
//       .filter((h: any) => h.attended)
//       .map((h: any) => ({
//         date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 7),
//         rating: Math.round(h.rating),
//         contestName: h.contest.title,
//         rank: h.ranking,
//       }))
//       .slice(-40)

//     // Recent contests with delta
//     const sortedH = [...history].filter((h: any) => h.attended)
//       .sort((a: any, b: any) => b.contest.startTime - a.contest.startTime)
//       .slice(0, 10)
      
//     const contests = sortedH.map((h: any, i: number) => {
//       const prev = sortedH[i + 1]
//       return {
//         name: h.contest.title,
//         date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
//         rank: h.ranking,
//         delta: prev ? Math.round(h.rating - prev.rating) : 0,
//       }
//     })

//     const maxRating = ratingHistory.length
//       ? Math.max(...ratingHistory.map((h: any) => h.rating))
//       : cr?.rating ?? 0

//     return json({
//       handle, username: mu.profile?.realName || handle,
//       avatar: mu.profile?.userAvatar ?? '',
//       ranking: mu.profile?.ranking ?? 0,
//       contestRating: cr ? Math.round(cr.rating) : 0,
//       maxRating: Math.round(maxRating),
//       totalSolved: total, easySolved: easy, mediumSolved: medium, hardSolved: hard,
//       totalEasy: 803, totalMedium: 1685, totalHard: 712,
//       acceptanceRate: Math.round((total / totalSubs) * 10000) / 100,
//       streak: 0, totalContests: cr?.attendedContestsCount ?? 0,
//       globalRanking: cr?.globalRanking ?? 0,
//       tagDistribution: tagDist, languageStats: langStats,
//       ratingHistory, contests,
//     })
//   } catch (e) {
//     return json({ error: String(e) }, 500)
//   }
// })

// function json(d: unknown, status = 200) {
//   return new Response(JSON.stringify(d), {
//     status, headers: { ...CORS, 'Content-Type': 'application/json' }
//   })
// }