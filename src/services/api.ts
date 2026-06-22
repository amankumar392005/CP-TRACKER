import { supabase } from '../lib/supabase'
import { GoogleGenAI } from "@google/genai";
// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════
export interface CFData {
  handle: string; rating: number; maxRating: number
  rank: string; maxRank: string; totalSolved: number
  streakDays: number; contribution: number; friendCount: number
  country: string; organization: string; avatar: string
  ratingHistory: Array<{
    date: string; fullDate: string; rating: number; oldRating: number
    contest: string; rank: number; delta: number
  }>
  tagDistribution: Record<string, number>
  difficultyDist: Record<string, number>
  weeklyStats: {
    solvedThisWeek: number; activeDays: number
    submissionsThisWeek: number; avgPerDay: number
  }
  contests: Array<{
    name: string; date: string; rank: number
    delta: number; newRating: number; oldRating: number
  }>
}

export interface LCData {
  handle: string; username: string; avatar: string
  ranking: number; contestRating: number; maxRating: number
  totalSolved: number; easySolved: number; mediumSolved: number; hardSolved: number
  totalEasy: number; totalMedium: number; totalHard: number
  acceptanceRate: number; streak: number; totalContests: number; globalRanking: number
  tagDistribution: Record<string, number>
  languageStats: Record<string, number>
  ratingHistory: Array<{
    date: string; fullDate: string; rating: number
    contestName: string; rank: number; delta: number
  }>
  weeklyStats: { solvedThisWeek: number; activeDays: number; avgPerDay: number }
  contests: Array<{ name: string; date: string; rank: number; delta: number; rating: number }>
}

export interface AIResult {
  daily_problem_sheet: Array<{
    platform: string; problem_name: string; url: string
    focus_tag: string; estimated_difficulty: string
  }>
  weak_topic_analysis: string
  weekly_roadmap: Array<{ day: number; topic: string; resource_focus: string }>
}

export interface Note {
  id: string; title: string; content: string
  platform: 'CF' | 'LC' | 'BOTH'; tags: string[]
  url: string; bookmarked: boolean; created_at: string
}

export interface Goal {
  id: string; title: string; platform: 'CF' | 'LC' | 'BOTH'
  target: number; current: number; deadline: string
  color: string; achieved: boolean; created_at: string
}

// ═══════════════════════════════════════════════════════════════════════════
// CODEFORCES — direct browser fetch (CF API has open CORS)
// ═══════════════════════════════════════════════════════════════════════════
export async function fetchCFData(handle: string): Promise<CFData> {
  const base = 'https://codeforces.com/api'
  const [uRes, rRes, sRes] = await Promise.all([
    fetch(`${base}/user.info?handles=${encodeURIComponent(handle)}`),
    fetch(`${base}/user.rating?handle=${encodeURIComponent(handle)}`),
    fetch(`${base}/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`),
  ])
  const [uData, rData, sData] = await Promise.all([uRes.json(), rRes.json(), sRes.json()])

  if (uData.status !== 'OK') throw new Error(uData.comment ?? 'Codeforces user not found.')
  const u = uData.result[0]

  const ratingHistory = (rData.status === 'OK' ? rData.result : []).map((r: any) => ({
    fullDate: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
    date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 7),
    rating: r.newRating, oldRating: r.oldRating,
    delta: r.newRating - r.oldRating,
    contest: r.contestName, rank: r.rank,
  }))

  const contests = (rData.status === 'OK' ? rData.result : [])
    .slice(-20).reverse().map((r: any) => ({
      name: r.contestName,
      date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
      rank: r.rank, delta: r.newRating - r.oldRating,
      newRating: r.newRating, oldRating: r.oldRating,
    }))

  const subs = sData.status === 'OK' ? sData.result : []
  const acProbs = new Set<string>()
  const tagCount: Record<string, number> = {}
  const diffCount: Record<string, number> = {}
  const submDays = new Set<string>()
  const now = Date.now()
  const weekMs = 7 * 24 * 3600 * 1000
  let weekSolved = 0, weekSubs = 0
  const weekDays = new Set<string>()

  for (const sub of subs) {
    const ts = sub.creationTimeSeconds * 1000
    const day = new Date(ts).toISOString().slice(0, 10)
    submDays.add(day)
    if (now - ts < weekMs) { weekSubs++; weekDays.add(day) }
    if (sub.verdict !== 'OK') continue
    const key = `${sub.problem.contestId}-${sub.problem.index}`
    if (acProbs.has(key)) continue
    acProbs.add(key)
    if (now - ts < weekMs) weekSolved++
    for (const tag of sub.problem.tags ?? []) tagCount[tag] = (tagCount[tag] ?? 0) + 1
    const r = sub.problem.rating ?? 0
    if (r > 0) {
      const b = `${Math.floor(r / 200) * 200}-${Math.floor(r / 200) * 200 + 199}`
      diffCount[b] = (diffCount[b] ?? 0) + 1
    }
  }

  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i)
    if (submDays.has(d.toISOString().slice(0, 10))) streak++
    else if (i > 0) break
  }

  return {
    handle: u.handle, rating: u.rating ?? 0, maxRating: u.maxRating ?? 0,
    rank: u.rank ?? 'unrated', maxRank: u.maxRank ?? 'unrated',
    totalSolved: acProbs.size, streakDays: streak,
    contribution: u.contribution ?? 0, friendCount: u.friendOfCount ?? 0,
    country: u.country ?? '', organization: u.organization ?? '',
    avatar: u.titlePhoto ?? '',
    ratingHistory, tagDistribution: tagCount, difficultyDist: diffCount, contests,
    weeklyStats: {
      solvedThisWeek: weekSolved, activeDays: weekDays.size,
      submissionsThisWeek: weekSubs,
      avgPerDay: Math.round((weekSolved / 7) * 10) / 10,
    },
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// LEETCODE — tries multiple CORS proxies
// ═══════════════════════════════════════════════════════════════════════════
const LC_GQL = `query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile { realName userAvatar ranking countryName }
    submitStats {
      acSubmissionNum { difficulty count submissions }
      totalSubmissionNum { difficulty count submissions }
    }
    tagProblemCounts {
      advanced      { tagName tagSlug problemsSolved }
      intermediate  { tagName tagSlug problemsSolved }
      fundamental   { tagName tagSlug problemsSolved }
    }
    languageProblemCount { languageName problemsSolved }
  }
  allQuestionsCount { difficulty count }
  userContestRanking(username: $username) {
    rating globalRanking attendedContestsCount
  }
  userContestRankingHistory(username: $username) {
    attended rating ranking
    contest { title startTime }
  }
}`

export async function fetchLCData(handle: string): Promise<LCData> {
  const body = JSON.stringify({ query: LC_GQL, variables: { username: handle } })
  const proxies = [
    () => fetch('https://corsproxy.io/?' + encodeURIComponent('https://leetcode.com/graphql'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
    }),
    () => fetch('https://api.allorigins.win/post?url=' + encodeURIComponent('https://leetcode.com/graphql'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
    }),
    () => fetch('https://thingproxy.freeboard.io/fetch/https://leetcode.com/graphql', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
    }),
  ]

  let raw: any = null
  for (const proxy of proxies) {
    try {
      const r = await proxy()
      if (!r.ok) continue
      const data = await r.json()
      raw = data?.contents ? (() => { try { return JSON.parse(data.contents) } catch { return null } })() : data
      if (raw?.data?.matchedUser) break
      raw = null
    } catch { continue }
  }

  if (!raw?.data?.matchedUser) throw new Error('LeetCode user not found or API unreachable.')

  const mu = raw.data.matchedUser
  const cr = raw.data.userContestRanking
  const history = raw.data.userContestRankingHistory ?? []

  const ac = mu.submitStats?.acSubmissionNum ?? []
  const total  = ac.find((s: any) => s.difficulty === 'All')?.count    ?? 0
  const easy   = ac.find((s: any) => s.difficulty === 'Easy')?.count   ?? 0
  const medium = ac.find((s: any) => s.difficulty === 'Medium')?.count ?? 0
  const hard   = ac.find((s: any) => s.difficulty === 'Hard')?.count   ?? 0
  const totalSubs = ac.find((s: any) => s.difficulty === 'All')?.submissions ?? 1

  const tagDist: Record<string, number> = {}
  for (const grp of [mu.tagProblemCounts?.advanced, mu.tagProblemCounts?.intermediate, mu.tagProblemCounts?.fundamental]) {
    for (const t of grp ?? []) if (t.problemsSolved > 0) tagDist[t.tagName] = (tagDist[t.tagName] ?? 0) + t.problemsSolved
  }

  const langStats: Record<string, number> = {}
  for (const l of mu.languageProblemCount ?? []) langStats[l.languageName] = l.problemsSolved

  const attended = history.filter((h: any) => h.attended)
    .sort((a: any, b: any) => a.contest.startTime - b.contest.startTime)

  const ratingHistory = attended.map((h: any, i: number) => {
    const prev = attended[i - 1]
    return {
      fullDate: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
      date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 7),
      rating: Math.round(h.rating),
      delta: prev ? Math.round(h.rating - prev.rating) : 0,
      contestName: h.contest.title, rank: h.ranking,
    }
  })

  const contests = [...attended].reverse().slice(0, 20).map((h: any, i: number, arr: any[]) => ({
    name: h.contest.title,
    date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
    rank: h.ranking, rating: Math.round(h.rating),
    delta: arr[i + 1] ? Math.round(h.rating - arr[i + 1].rating) : 0,
  }))

  return {
    handle, username: mu.profile?.realName ?? handle,
    avatar: mu.profile?.userAvatar ?? '', ranking: mu.profile?.ranking ?? 0,
    contestRating: cr ? Math.round(cr.rating) : 0,
    maxRating: ratingHistory.length ? Math.max(...ratingHistory.map(h => h.rating)) : 0,
    totalSolved: total, easySolved: easy, mediumSolved: medium, hardSolved: hard,
    totalEasy:   raw.data?.allQuestionsCount?.find((q: any) => q.difficulty === 'Easy')?.count   ?? 803,
    totalMedium: raw.data?.allQuestionsCount?.find((q: any) => q.difficulty === 'Medium')?.count ?? 1685,
    totalHard:   raw.data?.allQuestionsCount?.find((q: any) => q.difficulty === 'Hard')?.count   ?? 712,
    acceptanceRate: totalSubs > 0 ? Math.round((total / totalSubs) * 10000) / 100 : 0,
    streak: 0, totalContests: cr?.attendedContestsCount ?? 0,
    globalRanking: cr?.globalRanking ?? 0,
    tagDistribution: tagDist, languageStats: langStats, ratingHistory, contests,
    weeklyStats: { solvedThisWeek: 0, activeDays: 0, avgPerDay: 0 },
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// AI COACH — Gemini with correct model names + API versions
// ═══════════════════════════════════════════════════════════════════════════
// export async function generateAIPlan(payload: {
//   cfHandle?: string; lcHandle?: string
//   cfRating?: number; cfMaxRating?: number; lcContestRating?: number
//   cfTagDistribution?: Record<string, number>
//   lcTagDistribution?: Record<string, number>
//   cfTotalSolved?: number; lcTotalSolved?: number
//   cfWeeklySolved?: number; lcEasy?: number; lcMedium?: number; lcHard?: number
//   cfRecentContests?: Array<{ name: string; delta: number; rank: number }>
//   cfDifficultyDist?: Record<string, number>
// }): Promise<AIResult> {
//   const KEY = import.meta.env.VITE_GEMINI_API_KEY
//   if (!KEY || KEY === 'your_gemini_key_here') {
//     throw new Error('VITE_GEMINI_API_KEY not set. Add it to your .env file and restart npm run dev. Get a free key at aistudio.google.com')
//   }

//   const {
//     cfHandle = '', lcHandle = '', cfRating = 0, cfMaxRating = 0,
//     lcContestRating = 0, cfTagDistribution = {}, lcTagDistribution = {},
//     cfTotalSolved = 0, lcTotalSolved = 0, cfWeeklySolved = 0,
//     lcEasy = 0, lcMedium = 0, lcHard = 0,
//     cfRecentContests = [], cfDifficultyDist = {},
//   } = payload

//   const allTags: Record<string, number> = {}
//   for (const [k, v] of Object.entries(cfTagDistribution)) allTags[k] = (allTags[k] ?? 0) + v
//   for (const [k, v] of Object.entries(lcTagDistribution)) allTags[k] = (allTags[k] ?? 0) + v
//   const sorted = Object.entries(allTags).sort(([, a], [, b]) => a - b)
//   const weakTopics  = sorted.slice(0, 6).map(([t, c]) => `${t}(${c} solved)`)
//   const strongTopics = sorted.slice(-4).reverse().map(([t, c]) => `${t}(${c} solved)`)
//   const recentCF = cfRecentContests.slice(0, 5)
//     .map(c => `${c.name}: rank ${c.rank}, delta ${c.delta > 0 ? '+' : ''}${c.delta}`).join(' | ')
//   const diffSummary = Object.entries(cfDifficultyDist)
//     .sort(([a], [b]) => parseInt(a) - parseInt(b))
//     .map(([r, c]) => `${r}:${c}`).join(', ')

//   const prompt = `You are an expert competitive programming coach. Generate a personalized 1-week study plan based on this user's REAL data.

// USER STATS:
// - Codeforces: handle=${cfHandle || 'none'}, rating=${cfRating} (peak ${cfMaxRating}), solved=${cfTotalSolved}, this_week=${cfWeeklySolved}
// - LeetCode: handle=${lcHandle || 'none'}, rating=${lcContestRating}, solved=${lcTotalSolved} (E=${lcEasy} M=${lcMedium} H=${lcHard})
// - CF difficulty: ${diffSummary || 'unknown'}
// - Weakest topics: ${weakTopics.join(', ') || 'unknown'}
// - Strongest topics: ${strongTopics.join(', ') || 'unknown'}
// - Recent CF contests: ${recentCF || 'none'}

// Return ONLY a valid JSON object. No markdown. No backticks. No extra text. Just raw JSON:

// {"daily_problem_sheet":[{"platform":"Codeforces","problem_name":"Problem Title","url":"https://codeforces.com/problemset/problem/1234/A","focus_tag":"dp","estimated_difficulty":"1400"},{"platform":"LeetCode","problem_name":"Problem Title","url":"https://leetcode.com/problems/problem-slug/","focus_tag":"graphs","estimated_difficulty":"Medium"}],"weak_topic_analysis":"2-3 sentences about weak areas with specific numbers.","weekly_roadmap":[{"day":1,"topic":"Topic Name","resource_focus":"What to study and practice today."}]}

// Rules:
// - daily_problem_sheet: exactly 7 problems targeting the weakest topics
// - weekly_roadmap: exactly 7 entries, day 1 to 7
// - Use real problem URLs
// - difficulty for CF: number like "1400", for LC: "Easy", "Medium", or "Hard"`

//   // Correct model names with correct API versions
//   // v1beta supports newer models, v1 supports stable 1.5 models
//   const candidates = [
//     { model: 'gemini-2.0-flash-exp',  ver: 'v1beta' },
//     { model: 'gemini-2.0-flash',      ver: 'v1beta' },
//     { model: 'gemini-1.5-flash',      ver: 'v1beta' },
//     { model: 'gemini-1.5-flash-8b',   ver: 'v1beta' },
//     { model: 'gemini-1.5-flash',      ver: 'v1'     },
//     { model: 'gemini-1.5-flash-8b',   ver: 'v1'     },
//   ]

//   let lastErr = ''

//   for (const { model, ver } of candidates) {
//     try {
//       const url = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${KEY}`
//       const res = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//           generationConfig: {
//             temperature: 0.3,
//             maxOutputTokens: 4096,
//             responseMimeType: 'application/json',
//           },
//         }),
//       })

//       if (!res.ok) {
//         const errBody = await res.text()
//         lastErr = `${model}(${ver}): HTTP ${res.status}`
//         // 404 = model not found, try next
//         if (res.status === 404) continue
//         // 400 = bad request / model not supported
//         if (res.status === 400) continue
//         // 403 = invalid key, no point trying others
//         if (res.status === 403) {
//           throw new Error(`API key rejected (403). Make sure VITE_GEMINI_API_KEY is valid. Get one free at aistudio.google.com/app/apikey`)
//         }
//         // 429 = rate limit, try next model
//         if (res.status === 429) continue
//         continue
//       }

//       const data = await res.json()

//       // Extract text from response
//       const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
//       if (!text) { lastErr = `${model}(${ver}): empty text in response`; continue }

//       // Clean any accidental markdown fences
//       const cleaned = text
//         .replace(/^```json\s*/i, '')
//         .replace(/^```\s*/i, '')
//         .replace(/```\s*$/i, '')
//         .trim()

//       // Parse JSON
//       let parsed: any
//       try {
//         parsed = JSON.parse(cleaned)
//       } catch {
//         // Try to find JSON object inside text
//         const jsonMatch = cleaned.match(/\{[\s\S]+\}/)
//         if (!jsonMatch) { lastErr = `${model}(${ver}): no JSON found`; continue }
//         try { parsed = JSON.parse(jsonMatch[0]) }
//         catch { lastErr = `${model}(${ver}): JSON parse error`; continue }
//       }

//       // Validate structure
//       if (!Array.isArray(parsed?.daily_problem_sheet)) {
//         lastErr = `${model}(${ver}): missing daily_problem_sheet`; continue
//       }
//       if (!Array.isArray(parsed?.weekly_roadmap)) {
//         lastErr = `${model}(${ver}): missing weekly_roadmap`; continue
//       }

//       // Success
//       return parsed as AIResult

//     } catch (e: any) {
//       if (e.message.includes('API key rejected') || e.message.includes('403')) throw e
//       lastErr = `${model}: ${e.message}`
//     }
//   }

//   throw new Error(
//     `AI Coach failed after trying all models. Last error: ${lastErr}. ` +
//     `Check: 1) VITE_GEMINI_API_KEY is correct in .env  2) Restart npm run dev after editing .env  3) Get a key at aistudio.google.com/app/apikey`
//   )
// }
export async function generateAIPlan(payload: {
  cfHandle?: string
  lcHandle?: string
  cfRating?: number
  cfMaxRating?: number
  lcContestRating?: number
  cfTagDistribution?: Record<string, number>
  lcTagDistribution?: Record<string, number>
  cfTotalSolved?: number
  lcTotalSolved?: number
  cfWeeklySolved?: number
  lcEasy?: number
  lcMedium?: number
  lcHard?: number
  cfRecentContests?: Array<{ name: string; delta: number; rank: number }>
  cfDifficultyDist?: Record<string, number>
}): Promise<AIResult> {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY

  if (!KEY) {
    throw new Error(
      'VITE_GEMINI_API_KEY not found. Add it to your .env file.'
    )
  }

  const {
    cfHandle = '',
    lcHandle = '',
    cfRating = 0,
    cfMaxRating = 0,
    lcContestRating = 0,
    cfTagDistribution = {},
    lcTagDistribution = {},
    cfTotalSolved = 0,
    lcTotalSolved = 0,
    cfWeeklySolved = 0,
    lcEasy = 0,
    lcMedium = 0,
    lcHard = 0,
    cfRecentContests = [],
    cfDifficultyDist = {},
  } = payload

  const allTags: Record<string, number> = {}

  for (const [k, v] of Object.entries(cfTagDistribution))
    allTags[k] = (allTags[k] ?? 0) + v

  for (const [k, v] of Object.entries(lcTagDistribution))
    allTags[k] = (allTags[k] ?? 0) + v

  const sorted = Object.entries(allTags).sort(([, a], [, b]) => a - b)

  const weakTopics = sorted
    .slice(0, 6)
    .map(([t, c]) => `${t}(${c} solved)`)

  const strongTopics = sorted
    .slice(-4)
    .reverse()
    .map(([t, c]) => `${t}(${c} solved)`)

  const recentCF = cfRecentContests
    .slice(0, 5)
    .map(
      (c) =>
        `${c.name}: rank ${c.rank}, delta ${
          c.delta > 0 ? '+' : ''
        }${c.delta}`
    )
    .join(' | ')

  const diffSummary = Object.entries(cfDifficultyDist)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([r, c]) => `${r}:${c}`)
    .join(', ')

  const prompt = `You are an expert competitive programming coach.

USER STATS:
- Codeforces: handle=${cfHandle || 'none'}, rating=${cfRating} (peak ${cfMaxRating}), solved=${cfTotalSolved}, this_week=${cfWeeklySolved}
- LeetCode: handle=${lcHandle || 'none'}, rating=${lcContestRating}, solved=${lcTotalSolved} (E=${lcEasy} M=${lcMedium} H=${lcHard})
- CF difficulty: ${diffSummary || 'unknown'}
- Weakest topics: ${weakTopics.join(', ') || 'unknown'}
- Strongest topics: ${strongTopics.join(', ') || 'unknown'}
- Recent CF contests: ${recentCF || 'none'}

Return ONLY valid JSON:

{
  "daily_problem_sheet":[
    {
      "platform":"Codeforces",
      "problem_name":"Problem",
      "url":"https://codeforces.com/problemset/problem/1/A",
      "focus_tag":"math",
      "estimated_difficulty":"800"
    }
  ],
  "weak_topic_analysis":"analysis",
  "weekly_roadmap":[
    {
      "day":1,
      "topic":"topic",
      "resource_focus":"focus"
    }
  ]
}

Rules:
- exactly 7 problems
- exactly 7 roadmap entries
- valid JSON only
- no markdown
- no explanations outside JSON`

  try {
    const { GoogleGenAI } = await import('@google/genai')

    const ai = new GoogleGenAI({
      apiKey: KEY,
    })

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    const text = response.text?.trim()

    if (!text) {
      throw new Error('Empty response from Gemini')
    }

    const cleaned = text
      .replace(/^```json/i, '')
      .replace(/^```/i, '')
      .replace(/```$/i, '')
      .trim()

    let parsed: any

    try {
      parsed = JSON.parse(cleaned)
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/)

      if (!match) {
        throw new Error('No JSON found in Gemini response')
      }

      parsed = JSON.parse(match[0])
    }

    if (!Array.isArray(parsed.daily_problem_sheet)) {
      throw new Error('Missing daily_problem_sheet')
    }

    if (!Array.isArray(parsed.weekly_roadmap)) {
      throw new Error('Missing weekly_roadmap')
    }

    return parsed as AIResult
  } catch (e: any) {
    throw new Error(`Gemini Error: ${e.message}`)
  }
}
// ═══════════════════════════════════════════════════════════════════════════
// DATABASE HELPERS
// ═══════════════════════════════════════════════════════════════════════════
export async function saveCFData(userId: string, d: CFData) {
  const { error } = await supabase.from('cf_data').upsert({
    user_id: userId, handle: d.handle, rating: d.rating, max_rating: d.maxRating,
    rank: d.rank, max_rank: d.maxRank, total_solved: d.totalSolved, streak_days: d.streakDays,
    contribution: d.contribution, friend_count: d.friendCount, country: d.country,
    organization: d.organization, avatar: d.avatar, rating_history: d.ratingHistory,
    tag_dist: d.tagDistribution, difficulty_dist: d.difficultyDist, contests: d.contests,
    cached_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })
  if (error) throw error
}

export async function loadCFData(userId: string): Promise<CFData | null> {
  const { data } = await supabase.from('cf_data').select('*').eq('user_id', userId).single()
  if (!data) return null
  return {
    handle: data.handle, rating: data.rating, maxRating: data.max_rating,
    rank: data.rank, maxRank: data.max_rank, totalSolved: data.total_solved,
    streakDays: data.streak_days, contribution: data.contribution, friendCount: data.friend_count,
    country: data.country, organization: data.organization, avatar: data.avatar,
    ratingHistory: data.rating_history ?? [], tagDistribution: data.tag_dist ?? {},
    difficultyDist: data.difficulty_dist ?? {}, contests: data.contests ?? [],
    weeklyStats: { solvedThisWeek: 0, activeDays: 0, submissionsThisWeek: 0, avgPerDay: 0 },
  }
}

export async function saveLCData(userId: string, d: LCData) {
  const { error } = await supabase.from('lc_data').upsert({
    user_id: userId, handle: d.handle, real_name: d.username, avatar: d.avatar,
    ranking: d.ranking, contest_rating: d.contestRating, max_rating: d.maxRating,
    total_solved: d.totalSolved, easy_solved: d.easySolved, medium_solved: d.mediumSolved,
    hard_solved: d.hardSolved, total_easy: d.totalEasy, total_medium: d.totalMedium,
    total_hard: d.totalHard, acceptance_rate: d.acceptanceRate, streak: d.streak,
    total_contests: d.totalContests, global_ranking: d.globalRanking,
    tag_dist: d.tagDistribution, rating_history: d.ratingHistory,
    contests: d.contests, cached_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })
  if (error) throw error
}

export async function loadLCData(userId: string): Promise<LCData | null> {
  const { data } = await supabase.from('lc_data').select('*').eq('user_id', userId).single()
  if (!data) return null
  return {
    handle: data.handle, username: data.real_name, avatar: data.avatar,
    ranking: data.ranking, contestRating: data.contest_rating, maxRating: data.max_rating,
    totalSolved: data.total_solved, easySolved: data.easy_solved, mediumSolved: data.medium_solved,
    hardSolved: data.hard_solved, totalEasy: data.total_easy, totalMedium: data.total_medium,
    totalHard: data.total_hard, acceptanceRate: data.acceptance_rate, streak: data.streak,
    totalContests: data.total_contests, globalRanking: data.global_ranking,
    tagDistribution: data.tag_dist ?? {}, languageStats: {},
    ratingHistory: data.rating_history ?? [], contests: data.contests ?? [],
    weeklyStats: { solvedThisWeek: 0, activeDays: 0, avgPerDay: 0 },
  }
}

export async function getNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error; return (data ?? []) as Note[]
}
export async function createNote(userId: string, note: Omit<Note, 'id' | 'created_at'>): Promise<Note> {
  const { data, error } = await supabase.from('notes').insert({ ...note, user_id: userId }).select().single()
  if (error) throw error; return data as Note
}
export async function updateNote(id: string, updates: Partial<Note>): Promise<void> {
  const { error } = await supabase.from('notes').update(updates).eq('id', id); if (error) throw error
}
export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id); if (error) throw error
}

export async function getGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error; return (data ?? []) as Goal[]
}
export async function createGoal(userId: string, goal: Omit<Goal, 'id' | 'created_at'>): Promise<Goal> {
  const { data, error } = await supabase.from('goals').insert({ ...goal, user_id: userId }).select().single()
  if (error) throw error; return data as Goal
}
export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
  const { error } = await supabase.from('goals').update(updates).eq('id', id); if (error) throw error
}
export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from('goals').delete().eq('id', id); if (error) throw error
}

export async function saveAISession(userId: string, result: AIResult): Promise<void> {
  await supabase.from('ai_sessions').insert({
    user_id: userId, roadmap: result.weekly_roadmap,
    problems: result.daily_problem_sheet, weak_analysis: result.weak_topic_analysis,
  })
}
export async function getLatestAISession(userId: string): Promise<AIResult | null> {
  const { data } = await supabase.from('ai_sessions').select('*')
    .eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
  if (!data) return null
  return { weekly_roadmap: data.roadmap, daily_problem_sheet: data.problems, weak_topic_analysis: data.weak_analysis }
}


// // import { supabase } from '../lib/supabase'

// // // ════════════════════════════════════════════════════════════════════════════
// // // CODEFORCES — calls CF public API directly from browser (no edge function)
// // // CF API is CORS-open, works perfectly in browser
// // // ════════════════════════════════════════════════════════════════════════════
// // export interface CFData {
// //   handle: string; rating: number; maxRating: number
// //   rank: string; maxRank: string; totalSolved: number
// //   streakDays: number; contribution: number; friendCount: number
// //   country: string; organization: string; avatar: string
// //   ratingHistory: Array<{ date: string; rating: number; contest: string; rank: number }>
// //   tagDistribution: Record<string, number>
// //   difficultyDist: Record<string, number>
// //   contests: Array<{ name: string; date: string; rank: number; delta: number; newRating: number; solved: string }>
// // }

// // export async function fetchCFData(handle: string): Promise<CFData> {
// //   const base = 'https://codeforces.com/api'

// //   const [uRes, rRes, sRes] = await Promise.all([
// //     fetch(`${base}/user.info?handles=${handle}`),
// //     fetch(`${base}/user.rating?handle=${handle}`),
// //     fetch(`${base}/user.status?handle=${handle}&from=1&count=10000`),
// //   ])

// //   const [uData, rData, sData] = await Promise.all([uRes.json(), rRes.json(), sRes.json()])

// //   if (uData.status !== 'OK') {
// //     throw new Error(uData.comment ?? 'Codeforces user not found. Check the handle.')
// //   }

// //   const u = uData.result[0]

// //   const ratingHistory = (rData.status === 'OK' ? rData.result : [])
// //     .map((r: any) => ({
// //       date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 7),
// //       rating: r.newRating, contest: r.contestName, rank: r.rank,
// //     })).slice(-40)

// //   const contests = (rData.status === 'OK' ? rData.result : [])
// //     .slice(-10).reverse()
// //     .map((r: any) => ({
// //       name: r.contestName,
// //       date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
// //       rank: r.rank, delta: r.newRating - r.oldRating, newRating: r.newRating, solved: '',
// //     }))

// //   const subs = sData.status === 'OK' ? sData.result : []
// //   const acProbs = new Set<string>()
// //   const tagCount: Record<string, number> = {}
// //   const diffCount: Record<string, number> = {}
// //   const submDays = new Set<string>()

// //   for (const sub of subs) {
// //     submDays.add(new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10))
// //     if (sub.verdict !== 'OK') continue
// //     const key = `${sub.problem.contestId}-${sub.problem.index}`
// //     if (acProbs.has(key)) continue
// //     acProbs.add(key)
// //     for (const tag of sub.problem.tags ?? []) tagCount[tag] = (tagCount[tag] ?? 0) + 1
// //     const r = sub.problem.rating ?? 0
// //     if (r > 0) {
// //       const b = `${Math.floor(r / 200) * 200}-${Math.floor(r / 200) * 200 + 199}`
// //       diffCount[b] = (diffCount[b] ?? 0) + 1
// //     }
// //   }

// //   let streak = 0
// //   const today = new Date()
// //   for (let i = 0; i < 365; i++) {
// //     const d = new Date(today); d.setDate(d.getDate() - i)
// //     if (submDays.has(d.toISOString().slice(0, 10))) streak++
// //     else if (i > 0) break
// //   }

// //   return {
// //     handle: u.handle, rating: u.rating ?? 0, maxRating: u.maxRating ?? 0,
// //     rank: u.rank ?? 'unrated', maxRank: u.maxRank ?? 'unrated',
// //     totalSolved: acProbs.size, streakDays: streak,
// //     contribution: u.contribution ?? 0, friendCount: u.friendOfCount ?? 0,
// //     country: u.country ?? '', organization: u.organization ?? '',
// //     avatar: u.titlePhoto ?? '',
// //     ratingHistory, tagDistribution: tagCount, difficultyDist: diffCount, contests,
// //   }
// // }

// // // ════════════════════════════════════════════════════════════════════════════
// // // LEETCODE — uses corsproxy.io to bypass CORS on LC GraphQL endpoint
// // // ════════════════════════════════════════════════════════════════════════════
// // export interface LCData {
// //   handle: string; username: string; avatar: string
// //   ranking: number; contestRating: number; maxRating: number
// //   totalSolved: number; easySolved: number; mediumSolved: number; hardSolved: number
// //   totalEasy: number; totalMedium: number; totalHard: number
// //   acceptanceRate: number; streak: number; totalContests: number; globalRanking: number
// //   tagDistribution: Record<string, number>
// //   languageStats: Record<string, number>
// //   ratingHistory: Array<{ date: string; rating: number; contestName: string; rank: number }>
// //   contests: Array<{ name: string; date: string; rank: number; delta: number }>
// // }

// // const LC_GQL = `query getUserProfile($username: String!) {
// //   matchedUser(username: $username) {
// //     username
// //     profile { realName userAvatar ranking countryName }
// //     submitStats { acSubmissionNum { difficulty count submissions } }
// //     tagProblemCounts {
// //       advanced      { tagName problemsSolved }
// //       intermediate  { tagName problemsSolved }
// //       fundamental   { tagName problemsSolved }
// //     }
// //     languageProblemCount { languageName problemsSolved }
// //   }
// //   userContestRanking(username: $username) {
// //     rating globalRanking attendedContestsCount
// //   }
// //   userContestRankingHistory(username: $username) {
// //     attended rating ranking
// //     contest { title startTime }
// //   }
// // }`

// // export async function fetchLCData(handle: string): Promise<LCData> {
// //   // corsproxy.io forwards POST requests with correct headers — free, reliable
// //   const res = await fetch(
// //     'https://corsproxy.io/?' + encodeURIComponent('https://leetcode.com/graphql'),
// //     {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ query: LC_GQL, variables: { username: handle } }),
// //     }
// //   )

// //   if (!res.ok) throw new Error(`LeetCode API unreachable (HTTP ${res.status}). Try again in 30s.`)

// //   const raw = await res.json()
// //   const mu = raw?.data?.matchedUser
// //   if (!mu) throw new Error('LeetCode user not found. Check the username (case-sensitive).')

// //   const cr = raw?.data?.userContestRanking
// //   const history = raw?.data?.userContestRankingHistory ?? []

// //   const ac = mu.submitStats?.acSubmissionNum ?? []
// //   const total  = ac.find((s: any) => s.difficulty === 'All')?.count      ?? 0
// //   const easy   = ac.find((s: any) => s.difficulty === 'Easy')?.count     ?? 0
// //   const medium = ac.find((s: any) => s.difficulty === 'Medium')?.count   ?? 0
// //   const hard   = ac.find((s: any) => s.difficulty === 'Hard')?.count     ?? 0
// //   const totalSubs = ac.find((s: any) => s.difficulty === 'All')?.submissions ?? 1

// //   const tagDist: Record<string, number> = {}
// //   for (const grp of [mu.tagProblemCounts?.advanced, mu.tagProblemCounts?.intermediate, mu.tagProblemCounts?.fundamental]) {
// //     for (const t of grp ?? []) if (t.problemsSolved > 0) tagDist[t.tagName] = (tagDist[t.tagName] ?? 0) + t.problemsSolved
// //   }

// //   const langStats: Record<string, number> = {}
// //   for (const l of mu.languageProblemCount ?? []) langStats[l.languageName] = l.problemsSolved

// //   const ratingHistory = history
// //     .filter((h: any) => h.attended)
// //     .map((h: any) => ({ date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 7), rating: Math.round(h.rating), contestName: h.contest.title, rank: h.ranking }))
// //     .slice(-40)

// //   const sortedH = [...history].filter((h: any) => h.attended).sort((a: any, b: any) => b.contest.startTime - a.contest.startTime).slice(0, 10)
// //   const contests = sortedH.map((h: any, i: number) => ({
// //     name: h.contest.title,
// //     date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
// //     rank: h.ranking,
// //     delta: sortedH[i + 1] ? Math.round(h.rating - sortedH[i + 1].rating) : 0,
// //   }))

// //   return {
// //     handle, username: mu.profile?.realName ?? handle,
// //     avatar: mu.profile?.userAvatar ?? '',
// //     ranking: mu.profile?.ranking ?? 0,
// //     contestRating: cr ? Math.round(cr.rating) : 0,
// //     maxRating: ratingHistory.length ? Math.max(...ratingHistory.map((h: any) => h.rating)) : 0,
// //     totalSolved: total, easySolved: easy, mediumSolved: medium, hardSolved: hard,
// //     totalEasy: 803, totalMedium: 1685, totalHard: 712,
// //     acceptanceRate: Math.round((total / totalSubs) * 10000) / 100,
// //     streak: 0, totalContests: cr?.attendedContestsCount ?? 0,
// //     globalRanking: cr?.globalRanking ?? 0,
// //     tagDistribution: tagDist, languageStats: langStats, ratingHistory, contests,
// //   }
// // }

// // // ════════════════════════════════════════════════════════════════════════════
// // // AI COACH — calls Gemini 1.5 Flash directly (needs VITE_GEMINI_API_KEY in .env)
// // // ════════════════════════════════════════════════════════════════════════════
// // export interface AIResult {
// //   daily_problem_sheet: Array<{ platform: string; problem_name: string; url: string; focus_tag: string; estimated_difficulty: string }>
// //   weak_topic_analysis: string
// //   weekly_roadmap: Array<{ day: number; topic: string; resource_focus: string }>
// // }

// // export async function generateAIPlan(payload: {
// //   cfHandle?: string; lcHandle?: string; cfRating?: number; lcContestRating?: number
// //   cfTagDistribution?: Record<string, number>; lcTagDistribution?: Record<string, number>
// //   cfTotalSolved?: number; lcTotalSolved?: number; lcEasy?: number; lcMedium?: number; lcHard?: number
// // }): Promise<AIResult> {
// //   const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
// //   if (!GEMINI_KEY) throw new Error('Add VITE_GEMINI_API_KEY=your_key to your .env file, then restart npm run dev')

// //   const { cfHandle='', lcHandle='', cfRating=0, lcContestRating=0,
// //     cfTagDistribution={}, lcTagDistribution={}, cfTotalSolved=0, lcTotalSolved=0,
// //     lcEasy=0, lcMedium=0, lcHard=0 } = payload

// //   const allTags: Record<string, number> = {}
// //   for (const [k, v] of Object.entries(cfTagDistribution)) allTags[k] = (allTags[k] ?? 0) + v
// //   for (const [k, v] of Object.entries(lcTagDistribution)) allTags[k] = (allTags[k] ?? 0) + v
// //   const weakTags = Object.entries(allTags).sort(([,a],[,b])=>a-b).slice(0,8).map(([t,c])=>`${t}(${c})`).join(', ')

// //   const prompt = `You are an elite competitive programming coach. Generate a personalized 1-week study plan.

// // USER: CF=${cfHandle||'none'} rating=${cfRating} solved=${cfTotalSolved} | LC=${lcHandle||'none'} rating=${lcContestRating} solved=${lcTotalSolved}(E=${lcEasy},M=${lcMedium},H=${lcHard})
// // WEAK TOPICS: ${weakTags||'unknown'}

// // Return ONLY valid JSON, absolutely no markdown or backticks:
// // {"daily_problem_sheet":[{"platform":"Codeforces or LeetCode","problem_name":"title","url":"direct URL","focus_tag":"one tag","estimated_difficulty":"Easy/Medium/Hard or 1400"}],"weak_topic_analysis":"2-3 sentences","weekly_roadmap":[{"day":1,"topic":"name","resource_focus":"what to do"}]}

// // Rules: exactly 7 problems, exactly 7 roadmap days, real working URLs only.`

// //   const res = await fetch(
// //     `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
// //     { method: 'POST', headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 2048 } }) }
// //   )
// //   if (!res.ok) throw new Error(`Gemini error: ${await res.text()}`)
// //   const gData = await res.json()
// //   const raw = gData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
// //   try { return JSON.parse(raw.replace(/```json|```/g, '').trim()) }
// //   catch { throw new Error('AI returned invalid JSON. Try again.') }
// // }

// // // ════════════════════════════════════════════════════════════════════════════
// // // DATABASE HELPERS
// // // ════════════════════════════════════════════════════════════════════════════
// // export async function saveCFData(userId: string, d: CFData) {
// //   const { error } = await supabase.from('cf_data').upsert({
// //     user_id: userId, handle: d.handle, rating: d.rating, max_rating: d.maxRating,
// //     rank: d.rank, max_rank: d.maxRank, total_solved: d.totalSolved, streak_days: d.streakDays,
// //     contribution: d.contribution, friend_count: d.friendCount, country: d.country,
// //     organization: d.organization, avatar: d.avatar, rating_history: d.ratingHistory,
// //     tag_dist: d.tagDistribution, difficulty_dist: d.difficultyDist, contests: d.contests,
// //     cached_at: new Date().toISOString()
// //   }, { onConflict: 'user_id' })
// //   if (error) throw error
// // }

// // export async function loadCFData(userId: string): Promise<CFData | null> {
// //   const { data } = await supabase.from('cf_data').select('*').eq('user_id', userId).single()
// //   if (!data) return null
// //   return {
// //     handle: data.handle, rating: data.rating, maxRating: data.max_rating,
// //     rank: data.rank, maxRank: data.max_rank, totalSolved: data.total_solved,
// //     streakDays: data.streak_days, contribution: data.contribution, friendCount: data.friend_count,
// //     country: data.country, organization: data.organization, avatar: data.avatar,
// //     ratingHistory: data.rating_history ?? [], tagDistribution: data.tag_dist ?? {},
// //     difficultyDist: data.difficulty_dist ?? {}, contests: data.contests ?? [],
// //   }
// // }

// // export async function saveLCData(userId: string, d: LCData) {
// //   const { error } = await supabase.from('lc_data').upsert({
// //     user_id: userId, handle: d.handle, real_name: d.username, avatar: d.avatar,
// //     ranking: d.ranking, contest_rating: d.contestRating, max_rating: d.maxRating,
// //     total_solved: d.totalSolved, easy_solved: d.easySolved, medium_solved: d.mediumSolved,
// //     hard_solved: d.hardSolved, total_easy: d.totalEasy, total_medium: d.totalMedium,
// //     total_hard: d.totalHard, acceptance_rate: d.acceptanceRate, streak: d.streak,
// //     total_contests: d.totalContests, global_ranking: d.globalRanking,
// //     tag_dist: d.tagDistribution, rating_history: d.ratingHistory,
// //     contests: d.contests, cached_at: new Date().toISOString()
// //   }, { onConflict: 'user_id' })
// //   if (error) throw error
// // }

// // export async function loadLCData(userId: string): Promise<LCData | null> {
// //   const { data } = await supabase.from('lc_data').select('*').eq('user_id', userId).single()
// //   if (!data) return null
// //   return {
// //     handle: data.handle, username: data.real_name, avatar: data.avatar,
// //     ranking: data.ranking, contestRating: data.contest_rating, maxRating: data.max_rating,
// //     totalSolved: data.total_solved, easySolved: data.easy_solved, mediumSolved: data.medium_solved,
// //     hardSolved: data.hard_solved, totalEasy: data.total_easy, totalMedium: data.total_medium,
// //     totalHard: data.total_hard, acceptanceRate: data.acceptance_rate, streak: data.streak,
// //     totalContests: data.total_contests, globalRanking: data.global_ranking,
// //     tagDistribution: data.tag_dist ?? {}, languageStats: {},
// //     ratingHistory: data.rating_history ?? [], contests: data.contests ?? [],
// //   }
// // }

// // export interface Note {
// //   id: string; title: string; content: string
// //   platform: 'CF' | 'LC' | 'BOTH'; tags: string[]
// //   url: string; bookmarked: boolean; created_at: string
// // }
// // export async function getNotes(userId: string): Promise<Note[]> {
// //   const { data, error } = await supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
// //   if (error) throw error
// //   return (data ?? []) as Note[]
// // }
// // export async function createNote(userId: string, note: Omit<Note, 'id' | 'created_at'>): Promise<Note> {
// //   const { data, error } = await supabase.from('notes').insert({ ...note, user_id: userId }).select().single()
// //   if (error) throw error
// //   return data as Note
// // }
// // export async function updateNote(id: string, updates: Partial<Note>): Promise<void> {
// //   const { error } = await supabase.from('notes').update(updates).eq('id', id)
// //   if (error) throw error
// // }
// // export async function deleteNote(id: string): Promise<void> {
// //   const { error } = await supabase.from('notes').delete().eq('id', id)
// //   if (error) throw error
// // }

// // export interface Goal {
// //   id: string; title: string; platform: 'CF' | 'LC' | 'BOTH'
// //   target: number; current: number; deadline: string
// //   color: string; achieved: boolean; created_at: string
// // }
// // export async function getGoals(userId: string): Promise<Goal[]> {
// //   const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false })
// //   if (error) throw error
// //   return (data ?? []) as Goal[]
// // }
// // export async function createGoal(userId: string, goal: Omit<Goal, 'id' | 'created_at'>): Promise<Goal> {
// //   const { data, error } = await supabase.from('goals').insert({ ...goal, user_id: userId }).select().single()
// //   if (error) throw error
// //   return data as Goal
// // }
// // export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
// //   const { error } = await supabase.from('goals').update(updates).eq('id', id)
// //   if (error) throw error
// // }
// // export async function deleteGoal(id: string): Promise<void> {
// //   const { error } = await supabase.from('goals').delete().eq('id', id)
// //   if (error) throw error
// // }

// // export async function saveAISession(userId: string, result: AIResult): Promise<void> {
// //   await supabase.from('ai_sessions').insert({
// //     user_id: userId, roadmap: result.weekly_roadmap,
// //     problems: result.daily_problem_sheet, weak_analysis: result.weak_topic_analysis,
// //   })
// // }
// // export async function getLatestAISession(userId: string): Promise<AIResult | null> {
// //   const { data } = await supabase.from('ai_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
// //   if (!data) return null
// //   return { weekly_roadmap: data.roadmap, daily_problem_sheet: data.problems, weak_topic_analysis: data.weak_analysis }
// // }

// // import { supabase } from '../lib/supabase'

// // // ════════════════════════════════════════════════════════════════════════════
// // // CODEFORCES — calls CF public API directly from browser (no edge function)
// // // CF API is CORS-open, works perfectly in browser
// // // ════════════════════════════════════════════════════════════════════════════
// // export interface CFData {
// //   handle: string; rating: number; maxRating: number
// //   rank: string; maxRank: string; totalSolved: number
// //   streakDays: number; contribution: number; friendCount: number
// //   country: string; organization: string; avatar: string
// //   ratingHistory: Array<{ date: string; rating: number; contest: string; rank: number }>
// //   tagDistribution: Record<string, number>
// //   difficultyDist: Record<string, number>
// //   contests: Array<{ name: string; date: string; rank: number; delta: number; newRating: number; solved: string }>
// // }

// // export async function fetchCFData(handle: string): Promise<CFData> {
// //   const base = 'https://codeforces.com/api'

// //   const [uRes, rRes, sRes] = await Promise.all([
// //     fetch(`${base}/user.info?handles=${handle}`),
// //     fetch(`${base}/user.rating?handle=${handle}`),
// //     fetch(`${base}/user.status?handle=${handle}&from=1&count=10000`),
// //   ])

// //   const [uData, rData, sData] = await Promise.all([uRes.json(), rRes.json(), sRes.json()])

// //   if (uData.status !== 'OK') {
// //     throw new Error(uData.comment ?? 'Codeforces user not found. Check the handle.')
// //   }

// //   const u = uData.result[0]

// //   const ratingHistory = (rData.status === 'OK' ? rData.result : [])
// //     .map((r: any) => ({
// //       date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 7),
// //       rating: r.newRating, contest: r.contestName, rank: r.rank,
// //     })).slice(-40)

// //   const contests = (rData.status === 'OK' ? rData.result : [])
// //     .slice(-10).reverse()
// //     .map((r: any) => ({
// //       name: r.contestName,
// //       date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
// //       rank: r.rank, delta: r.newRating - r.oldRating, newRating: r.newRating, solved: '',
// //     }))

// //   const subs = sData.status === 'OK' ? sData.result : []
// //   const acProbs = new Set<string>()
// //   const tagCount: Record<string, number> = {}
// //   const diffCount: Record<string, number> = {}
// //   const submDays = new Set<string>()

// //   for (const sub of subs) {
// //     submDays.add(new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10))
// //     if (sub.verdict !== 'OK') continue
// //     const key = `${sub.problem.contestId}-${sub.problem.index}`
// //     if (acProbs.has(key)) continue
// //     acProbs.add(key)
// //     for (const tag of sub.problem.tags ?? []) tagCount[tag] = (tagCount[tag] ?? 0) + 1
// //     const r = sub.problem.rating ?? 0
// //     if (r > 0) {
// //       const b = `${Math.floor(r / 200) * 200}-${Math.floor(r / 200) * 200 + 199}`
// //       diffCount[b] = (diffCount[b] ?? 0) + 1
// //     }
// //   }

// //   let streak = 0
// //   const today = new Date()
// //   for (let i = 0; i < 365; i++) {
// //     const d = new Date(today); d.setDate(d.getDate() - i)
// //     if (submDays.has(d.toISOString().slice(0, 10))) streak++
// //     else if (i > 0) break
// //   }

// //   return {
// //     handle: u.handle, rating: u.rating ?? 0, maxRating: u.maxRating ?? 0,
// //     rank: u.rank ?? 'unrated', maxRank: u.maxRank ?? 'unrated',
// //     totalSolved: acProbs.size, streakDays: streak,
// //     contribution: u.contribution ?? 0, friendCount: u.friendOfCount ?? 0,
// //     country: u.country ?? '', organization: u.organization ?? '',
// //     avatar: u.titlePhoto ?? '',
// //     ratingHistory, tagDistribution: tagCount, difficultyDist: diffCount, contests,
// //   }
// // }

// // // ════════════════════════════════════════════════════════════════════════════
// // // LEETCODE — tries 3 CORS proxies in order, auto-fallback
// // // ════════════════════════════════════════════════════════════════════════════
// // export interface LCData {
// //   handle: string; username: string; avatar: string
// //   ranking: number; contestRating: number; maxRating: number
// //   totalSolved: number; easySolved: number; mediumSolved: number; hardSolved: number
// //   totalEasy: number; totalMedium: number; totalHard: number
// //   acceptanceRate: number; streak: number; totalContests: number; globalRanking: number
// //   tagDistribution: Record<string, number>
// //   languageStats: Record<string, number>
// //   ratingHistory: Array<{ date: string; rating: number; contestName: string; rank: number }>
// //   contests: Array<{ name: string; date: string; rank: number; delta: number }>
// // }

// // const LC_GQL = `query getUserProfile($username: String!) {
// //   matchedUser(username: $username) {
// //     username
// //     profile { realName userAvatar ranking countryName }
// //     submitStats { acSubmissionNum { difficulty count submissions } }
// //     tagProblemCounts {
// //       advanced      { tagName problemsSolved }
// //       intermediate  { tagName problemsSolved }
// //       fundamental   { tagName problemsSolved }
// //     }
// //     languageProblemCount { languageName problemsSolved }
// //   }
// //   userContestRanking(username: $username) {
// //     rating globalRanking attendedContestsCount
// //   }
// //   userContestRankingHistory(username: $username) {
// //     attended rating ranking
// //     contest { title startTime }
// //   }
// // }`

// // export async function fetchLCData(handle: string): Promise<LCData> {
// //   const lcBody = JSON.stringify({ query: LC_GQL, variables: { username: handle } })

// //   // Try 3 proxies in order — whichever works first wins
// //   const proxies = [
// //     () => fetch('https://corsproxy.io/?' + encodeURIComponent('https://leetcode.com/graphql'), {
// //       method: 'POST', headers: { 'Content-Type': 'application/json' }, body: lcBody,
// //     }),
// //     () => fetch('https://api.allorigins.win/post?url=' + encodeURIComponent('https://leetcode.com/graphql'), {
// //       method: 'POST', headers: { 'Content-Type': 'application/json' }, body: lcBody,
// //     }),
// //     () => fetch('https://proxy.cors.sh/https://leetcode.com/graphql', {
// //       method: 'POST', headers: { 'Content-Type': 'application/json', 'x-cors-api-key': 'temp_' + Date.now() }, body: lcBody,
// //     }),
// //   ]

// //   let raw: any = null
// //   for (const proxy of proxies) {
// //     try {
// //       const r = await proxy()
// //       if (!r.ok) continue
// //       const data = await r.json()
// //       // allorigins wraps response in { contents: "..." }
// //       if (data?.contents) {
// //         try { raw = JSON.parse(data.contents) } catch { continue }
// //       } else {
// //         raw = data
// //       }
// //       if (raw?.data?.matchedUser) break
// //     } catch { continue }
// //   }

// //   if (!raw) throw new Error('LeetCode API unreachable. All proxies failed. Try again in 30 seconds.')
// //   const mu = raw?.data?.matchedUser
// //   if (!mu) throw new Error('LeetCode user not found. Check the username (case-sensitive).')

// //   const cr = raw?.data?.userContestRanking
// //   const history = raw?.data?.userContestRankingHistory ?? []

// //   const ac = mu.submitStats?.acSubmissionNum ?? []
// //   const total  = ac.find((s: any) => s.difficulty === 'All')?.count      ?? 0
// //   const easy   = ac.find((s: any) => s.difficulty === 'Easy')?.count     ?? 0
// //   const medium = ac.find((s: any) => s.difficulty === 'Medium')?.count   ?? 0
// //   const hard   = ac.find((s: any) => s.difficulty === 'Hard')?.count     ?? 0
// //   const totalSubs = ac.find((s: any) => s.difficulty === 'All')?.submissions ?? 1

// //   const tagDist: Record<string, number> = {}
// //   for (const grp of [mu.tagProblemCounts?.advanced, mu.tagProblemCounts?.intermediate, mu.tagProblemCounts?.fundamental]) {
// //     for (const t of grp ?? []) {
// //       if (t.problemsSolved > 0) tagDist[t.tagName] = (tagDist[t.tagName] ?? 0) + t.problemsSolved
// //     }
// //   }

// //   const langStats: Record<string, number> = {}
// //   for (const l of mu.languageProblemCount ?? []) langStats[l.languageName] = l.problemsSolved

// //   const ratingHistory = history
// //     .filter((h: any) => h.attended)
// //     .map((h: any) => ({
// //       date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 7),
// //       rating: Math.round(h.rating),
// //       contestName: h.contest.title,
// //       rank: h.ranking,
// //     }))
// //     .slice(-40)

// //   const sortedH = [...history]
// //     .filter((h: any) => h.attended)
// //     .sort((a: any, b: any) => b.contest.startTime - a.contest.startTime)
// //     .slice(0, 10)

// //   const contests = sortedH.map((h: any, i: number) => ({
// //     name: h.contest.title,
// //     date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
// //     rank: h.ranking,
// //     delta: sortedH[i + 1] ? Math.round(h.rating - sortedH[i + 1].rating) : 0,
// //   }))

// //   return {
// //     handle,
// //     username: mu.profile?.realName ?? handle,
// //     avatar: mu.profile?.userAvatar ?? '',
// //     ranking: mu.profile?.ranking ?? 0,
// //     contestRating: cr ? Math.round(cr.rating) : 0,
// //     maxRating: ratingHistory.length ? Math.max(...ratingHistory.map((h: any) => h.rating)) : 0,
// //     totalSolved: total, easySolved: easy, mediumSolved: medium, hardSolved: hard,
// //     totalEasy: 803, totalMedium: 1685, totalHard: 712,
// //     acceptanceRate: Math.round((total / totalSubs) * 10000) / 100,
// //     streak: 0,
// //     totalContests: cr?.attendedContestsCount ?? 0,
// //     globalRanking: cr?.globalRanking ?? 0,
// //     tagDistribution: tagDist, languageStats: langStats, ratingHistory, contests,
// //   }
// // }

// // // ════════════════════════════════════════════════════════════════════════════
// // // AI COACH — calls Gemini directly, tries 4 models in order
// // // ════════════════════════════════════════════════════════════════════════════
// // export interface AIResult {
// //   daily_problem_sheet: Array<{
// //     platform: string; problem_name: string; url: string
// //     focus_tag: string; estimated_difficulty: string
// //   }>
// //   weak_topic_analysis: string
// //   weekly_roadmap: Array<{ day: number; topic: string; resource_focus: string }>
// // }

// // export async function generateAIPlan(payload: {
// //   cfHandle?: string; lcHandle?: string
// //   cfRating?: number; lcContestRating?: number
// //   cfTagDistribution?: Record<string, number>
// //   lcTagDistribution?: Record<string, number>
// //   cfTotalSolved?: number; lcTotalSolved?: number
// //   lcEasy?: number; lcMedium?: number; lcHard?: number
// // }): Promise<AIResult> {
// //   const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
// //   if (!GEMINI_KEY) throw new Error('Add VITE_GEMINI_API_KEY=your_key to your .env file, then restart npm run dev')

// //   const {
// //     cfHandle = '', lcHandle = '', cfRating = 0, lcContestRating = 0,
// //     cfTagDistribution = {}, lcTagDistribution = {},
// //     cfTotalSolved = 0, lcTotalSolved = 0,
// //     lcEasy = 0, lcMedium = 0, lcHard = 0,
// //   } = payload

// //   const allTags: Record<string, number> = {}
// //   for (const [k, v] of Object.entries(cfTagDistribution)) allTags[k] = (allTags[k] ?? 0) + v
// //   for (const [k, v] of Object.entries(lcTagDistribution)) allTags[k] = (allTags[k] ?? 0) + v
// //   const weakTags = Object.entries(allTags)
// //     .sort(([, a], [, b]) => a - b)
// //     .slice(0, 8)
// //     .map(([t, c]) => `${t}(${c})`)
// //     .join(', ')

// //   const prompt = `You are an elite competitive programming coach. Generate a personalized 1-week study plan.

// // USER: CF=${cfHandle || 'none'} rating=${cfRating} solved=${cfTotalSolved} | LC=${lcHandle || 'none'} rating=${lcContestRating} solved=${lcTotalSolved}(E=${lcEasy},M=${lcMedium},H=${lcHard})
// // WEAK TOPICS: ${weakTags || 'unknown'}

// // Return ONLY valid JSON, absolutely no markdown or backticks:
// // {"daily_problem_sheet":[{"platform":"Codeforces or LeetCode","problem_name":"title","url":"direct URL","focus_tag":"one tag","estimated_difficulty":"Easy/Medium/Hard or 1400"}],"weak_topic_analysis":"2-3 sentences","weekly_roadmap":[{"day":1,"topic":"name","resource_focus":"what to do"}]}

// // Rules: exactly 7 problems, exactly 7 roadmap days, real working URLs only.`

// //   // Try Gemini models in order until one works
// //   const models = [
// //     'gemini-2.0-flash',
// //     'gemini-1.5-flash',
// //     'gemini-1.5-flash-latest',
// //     'gemini-pro',
// //   ]

// //   let res: Response | null = null
// //   let lastErr = ''

// //   for (const model of models) {
// //     try {
// //       const r = await fetch(
// //         `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
// //         {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify({
// //             contents: [{ parts: [{ text: prompt }] }],
// //             generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
// //           }),
// //         }
// //       )
// //       if (r.ok) { res = r; break }
// //       const errText = await r.text()
// //       lastErr = `${model}: ${errText}`
// //     } catch (e: any) {
// //       lastErr = e.message
// //     }
// //   }

// //   if (!res) throw new Error(`All Gemini models failed. Last error: ${lastErr}`)

// //   const gData = await res.json()
// //   const raw = gData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

// //   try {
// //     return JSON.parse(raw.replace(/```json|```/g, '').trim())
// //   } catch {
// //     throw new Error('AI returned invalid JSON. Try again.')
// //   }
// // }

// // // ════════════════════════════════════════════════════════════════════════════
// // // DATABASE HELPERS
// // // ════════════════════════════════════════════════════════════════════════════
// // export async function saveCFData(userId: string, d: CFData) {
// //   const { error } = await supabase.from('cf_data').upsert({
// //     user_id: userId, handle: d.handle, rating: d.rating, max_rating: d.maxRating,
// //     rank: d.rank, max_rank: d.maxRank, total_solved: d.totalSolved, streak_days: d.streakDays,
// //     contribution: d.contribution, friend_count: d.friendCount, country: d.country,
// //     organization: d.organization, avatar: d.avatar, rating_history: d.ratingHistory,
// //     tag_dist: d.tagDistribution, difficulty_dist: d.difficultyDist, contests: d.contests,
// //     cached_at: new Date().toISOString(),
// //   }, { onConflict: 'user_id' })
// //   if (error) throw error
// // }

// // export async function loadCFData(userId: string): Promise<CFData | null> {
// //   const { data } = await supabase.from('cf_data').select('*').eq('user_id', userId).single()
// //   if (!data) return null
// //   return {
// //     handle: data.handle, rating: data.rating, maxRating: data.max_rating,
// //     rank: data.rank, maxRank: data.max_rank, totalSolved: data.total_solved,
// //     streakDays: data.streak_days, contribution: data.contribution, friendCount: data.friend_count,
// //     country: data.country, organization: data.organization, avatar: data.avatar,
// //     ratingHistory: data.rating_history ?? [], tagDistribution: data.tag_dist ?? {},
// //     difficultyDist: data.difficulty_dist ?? {}, contests: data.contests ?? [],
// //   }
// // }

// // export async function saveLCData(userId: string, d: LCData) {
// //   const { error } = await supabase.from('lc_data').upsert({
// //     user_id: userId, handle: d.handle, real_name: d.username, avatar: d.avatar,
// //     ranking: d.ranking, contest_rating: d.contestRating, max_rating: d.maxRating,
// //     total_solved: d.totalSolved, easy_solved: d.easySolved, medium_solved: d.mediumSolved,
// //     hard_solved: d.hardSolved, total_easy: d.totalEasy, total_medium: d.totalMedium,
// //     total_hard: d.totalHard, acceptance_rate: d.acceptanceRate, streak: d.streak,
// //     total_contests: d.totalContests, global_ranking: d.globalRanking,
// //     tag_dist: d.tagDistribution, rating_history: d.ratingHistory,
// //     contests: d.contests, cached_at: new Date().toISOString(),
// //   }, { onConflict: 'user_id' })
// //   if (error) throw error
// // }

// // export async function loadLCData(userId: string): Promise<LCData | null> {
// //   const { data } = await supabase.from('lc_data').select('*').eq('user_id', userId).single()
// //   if (!data) return null
// //   return {
// //     handle: data.handle, username: data.real_name, avatar: data.avatar,
// //     ranking: data.ranking, contestRating: data.contest_rating, maxRating: data.max_rating,
// //     totalSolved: data.total_solved, easySolved: data.easy_solved, mediumSolved: data.medium_solved,
// //     hardSolved: data.hard_solved, totalEasy: data.total_easy, totalMedium: data.total_medium,
// //     totalHard: data.total_hard, acceptanceRate: data.acceptance_rate, streak: data.streak,
// //     totalContests: data.total_contests, globalRanking: data.global_ranking,
// //     tagDistribution: data.tag_dist ?? {}, languageStats: {},
// //     ratingHistory: data.rating_history ?? [], contests: data.contests ?? [],
// //   }
// // }

// // export interface Note {
// //   id: string; title: string; content: string
// //   platform: 'CF' | 'LC' | 'BOTH'; tags: string[]
// //   url: string; bookmarked: boolean; created_at: string
// // }
// // export async function getNotes(userId: string): Promise<Note[]> {
// //   const { data, error } = await supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
// //   if (error) throw error
// //   return (data ?? []) as Note[]
// // }
// // export async function createNote(userId: string, note: Omit<Note, 'id' | 'created_at'>): Promise<Note> {
// //   const { data, error } = await supabase.from('notes').insert({ ...note, user_id: userId }).select().single()
// //   if (error) throw error
// //   return data as Note
// // }
// // export async function updateNote(id: string, updates: Partial<Note>): Promise<void> {
// //   const { error } = await supabase.from('notes').update(updates).eq('id', id)
// //   if (error) throw error
// // }
// // export async function deleteNote(id: string): Promise<void> {
// //   const { error } = await supabase.from('notes').delete().eq('id', id)
// //   if (error) throw error
// // }

// // export interface Goal {
// //   id: string; title: string; platform: 'CF' | 'LC' | 'BOTH'
// //   target: number; current: number; deadline: string
// //   color: string; achieved: boolean; created_at: string
// // }
// // export async function getGoals(userId: string): Promise<Goal[]> {
// //   const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false })
// //   if (error) throw error
// //   return (data ?? []) as Goal[]
// // }
// // export async function createGoal(userId: string, goal: Omit<Goal, 'id' | 'created_at'>): Promise<Goal> {
// //   const { data, error } = await supabase.from('goals').insert({ ...goal, user_id: userId }).select().single()
// //   if (error) throw error
// //   return data as Goal
// // }
// // export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
// //   const { error } = await supabase.from('goals').update(updates).eq('id', id)
// //   if (error) throw error
// // }
// // export async function deleteGoal(id: string): Promise<void> {
// //   const { error } = await supabase.from('goals').delete().eq('id', id)
// //   if (error) throw error
// // }

// // export async function saveAISession(userId: string, result: AIResult): Promise<void> {
// //   await supabase.from('ai_sessions').insert({
// //     user_id: userId, roadmap: result.weekly_roadmap,
// //     problems: result.daily_problem_sheet, weak_analysis: result.weak_topic_analysis,
// //   })
// // }
// // export async function getLatestAISession(userId: string): Promise<AIResult | null> {
// //   const { data } = await supabase.from('ai_sessions').select('*')
// //     .eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
// //   if (!data) return null
// //   return {
// //     weekly_roadmap: data.roadmap,
// //     daily_problem_sheet: data.problems,
// //     weak_topic_analysis: data.weak_analysis,
// //   }
// // }



// // import { supabase } from '../lib/supabase'

// // // ═══════════════════════════════════════════════════════════════════════════
// // // TYPES
// // // ═══════════════════════════════════════════════════════════════════════════
// // export interface CFData {
// //   handle: string; rating: number; maxRating: number
// //   rank: string; maxRank: string; totalSolved: number
// //   streakDays: number; contribution: number; friendCount: number
// //   country: string; organization: string; avatar: string
// //   ratingHistory: Array<{
// //     date: string; fullDate: string; rating: number; oldRating: number
// //     contest: string; rank: number; delta: number
// //   }>
// //   tagDistribution: Record<string, number>
// //   difficultyDist: Record<string, number>
// //   weeklyStats: {
// //     solvedThisWeek: number; activeDays: number
// //     submissionsThisWeek: number; avgPerDay: number
// //   }
// //   contests: Array<{
// //     name: string; date: string; rank: number
// //     delta: number; newRating: number; oldRating: number
// //   }>
// // }

// // export interface LCData {
// //   handle: string; username: string; avatar: string
// //   ranking: number; contestRating: number; maxRating: number
// //   totalSolved: number; easySolved: number; mediumSolved: number; hardSolved: number
// //   totalEasy: number; totalMedium: number; totalHard: number
// //   acceptanceRate: number; streak: number; totalContests: number; globalRanking: number
// //   tagDistribution: Record<string, number>
// //   languageStats: Record<string, number>
// //   ratingHistory: Array<{
// //     date: string; fullDate: string; rating: number
// //     contestName: string; rank: number; delta: number
// //   }>
// //   weeklyStats: {
// //     solvedThisWeek: number; activeDays: number; avgPerDay: number
// //   }
// //   contests: Array<{ name: string; date: string; rank: number; delta: number; rating: number }>
// // }

// // // ═══════════════════════════════════════════════════════════════════════════
// // // CODEFORCES — direct browser fetch, CF API has open CORS
// // // ═══════════════════════════════════════════════════════════════════════════
// // export async function fetchCFData(handle: string): Promise<CFData> {
// //   const base = 'https://codeforces.com/api'
// //   const [uRes, rRes, sRes] = await Promise.all([
// //     fetch(`${base}/user.info?handles=${encodeURIComponent(handle)}`),
// //     fetch(`${base}/user.rating?handle=${encodeURIComponent(handle)}`),
// //     fetch(`${base}/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`),
// //   ])
// //   const [uData, rData, sData] = await Promise.all([uRes.json(), rRes.json(), sRes.json()])

// //   if (uData.status !== 'OK') throw new Error(uData.comment ?? 'Codeforces user not found.')
// //   const u = uData.result[0]

// //   // Full rating history — every contest with full data
// //   const ratingHistory = (rData.status === 'OK' ? rData.result : []).map((r: any) => ({
// //     fullDate: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
// //     date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 7),
// //     rating: r.newRating, oldRating: r.oldRating,
// //     delta: r.newRating - r.oldRating,
// //     contest: r.contestName, rank: r.rank,
// //   }))

// //   const contests = (rData.status === 'OK' ? rData.result : [])
// //     .slice(-20).reverse().map((r: any) => ({
// //       name: r.contestName,
// //       date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
// //       rank: r.rank, delta: r.newRating - r.oldRating,
// //       newRating: r.newRating, oldRating: r.oldRating,
// //     }))

// //   // Process all submissions
// //   const subs = sData.status === 'OK' ? sData.result : []
// //   const acProbs = new Set<string>()
// //   const tagCount: Record<string, number> = {}
// //   const diffCount: Record<string, number> = {}
// //   const submDays = new Set<string>()

// //   // Weekly stats — last 7 days
// //   const now = Date.now()
// //   const weekMs = 7 * 24 * 3600 * 1000
// //   let weekSolved = 0, weekSubs = 0
// //   const weekDays = new Set<string>()

// //   for (const sub of subs) {
// //     const ts = sub.creationTimeSeconds * 1000
// //     const day = new Date(ts).toISOString().slice(0, 10)
// //     submDays.add(day)
// //     if (now - ts < weekMs) {
// //       weekSubs++
// //       weekDays.add(day)
// //     }
// //     if (sub.verdict !== 'OK') continue
// //     const key = `${sub.problem.contestId}-${sub.problem.index}`
// //     if (acProbs.has(key)) continue
// //     acProbs.add(key)
// //     if (now - ts < weekMs) weekSolved++
// //     for (const tag of sub.problem.tags ?? []) tagCount[tag] = (tagCount[tag] ?? 0) + 1
// //     const r = sub.problem.rating ?? 0
// //     if (r > 0) {
// //       const bucket = `${Math.floor(r / 200) * 200}-${Math.floor(r / 200) * 200 + 199}`
// //       diffCount[bucket] = (diffCount[bucket] ?? 0) + 1
// //     }
// //   }

// //   let streak = 0
// //   const today = new Date()
// //   for (let i = 0; i < 365; i++) {
// //     const d = new Date(today); d.setDate(d.getDate() - i)
// //     if (submDays.has(d.toISOString().slice(0, 10))) streak++
// //     else if (i > 0) break
// //   }

// //   return {
// //     handle: u.handle, rating: u.rating ?? 0, maxRating: u.maxRating ?? 0,
// //     rank: u.rank ?? 'unrated', maxRank: u.maxRank ?? 'unrated',
// //     totalSolved: acProbs.size, streakDays: streak,
// //     contribution: u.contribution ?? 0, friendCount: u.friendOfCount ?? 0,
// //     country: u.country ?? '', organization: u.organization ?? '',
// //     avatar: u.titlePhoto ?? '',
// //     ratingHistory, tagDistribution: tagCount, difficultyDist: diffCount, contests,
// //     weeklyStats: {
// //       solvedThisWeek: weekSolved, activeDays: weekDays.size,
// //       submissionsThisWeek: weekSubs,
// //       avgPerDay: weekDays.size > 0 ? Math.round((weekSolved / 7) * 10) / 10 : 0,
// //     },
// //   }
// // }

// // // ═══════════════════════════════════════════════════════════════════════════
// // // LEETCODE — tries 3 CORS proxies with auto-fallback
// // // ═══════════════════════════════════════════════════════════════════════════
// // const LC_GQL = `query getUserProfile($username: String!) {
// //   matchedUser(username: $username) {
// //     username
// //     profile { realName userAvatar ranking countryName }
// //     submitStats { acSubmissionNum { difficulty count submissions } }
// //     tagProblemCounts {
// //       advanced      { tagName problemsSolved }
// //       intermediate  { tagName problemsSolved }
// //       fundamental   { tagName problemsSolved }
// //     }
// //     languageProblemCount { languageName problemsSolved }
// //   }
// //   userContestRanking(username: $username) {
// //     rating globalRanking attendedContestsCount
// //   }
// //   userContestRankingHistory(username: $username) {
// //     attended rating ranking
// //     contest { title startTime }
// //   }
// // }`

// // export async function fetchLCData(handle: string): Promise<LCData> {
// //   const body = JSON.stringify({ query: LC_GQL, variables: { username: handle } })
// //   const proxies = [
// //     () => fetch('https://corsproxy.io/?' + encodeURIComponent('https://leetcode.com/graphql'), {
// //       method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
// //     }),
// //     () => fetch('https://api.allorigins.win/post?url=' + encodeURIComponent('https://leetcode.com/graphql'), {
// //       method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
// //     }),
// //     () => fetch('https://thingproxy.freeboard.io/fetch/https://leetcode.com/graphql', {
// //       method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
// //     }),
// //   ]

// //   let raw: any = null
// //   for (const proxy of proxies) {
// //     try {
// //       const r = await proxy()
// //       if (!r.ok) continue
// //       const data = await r.json()
// //       raw = data?.contents ? (() => { try { return JSON.parse(data.contents) } catch { return null } })() : data
// //       if (raw?.data?.matchedUser) break
// //       raw = null
// //     } catch { continue }
// //   }

// //   if (!raw?.data?.matchedUser) throw new Error('LeetCode user not found or API unreachable. Check username & try again.')

// //   const mu = raw.data.matchedUser
// //   const cr = raw.data.userContestRanking
// //   const history = raw.data.userContestRankingHistory ?? []

// //   const ac = mu.submitStats?.acSubmissionNum ?? []
// //   const total  = ac.find((s: any) => s.difficulty === 'All')?.count       ?? 0
// //   const easy   = ac.find((s: any) => s.difficulty === 'Easy')?.count      ?? 0
// //   const medium = ac.find((s: any) => s.difficulty === 'Medium')?.count    ?? 0
// //   const hard   = ac.find((s: any) => s.difficulty === 'Hard')?.count      ?? 0
// //   const totalSubs = ac.find((s: any) => s.difficulty === 'All')?.submissions ?? 1

// //   const tagDist: Record<string, number> = {}
// //   for (const grp of [mu.tagProblemCounts?.advanced, mu.tagProblemCounts?.intermediate, mu.tagProblemCounts?.fundamental]) {
// //     for (const t of grp ?? []) if (t.problemsSolved > 0) tagDist[t.tagName] = (tagDist[t.tagName] ?? 0) + t.problemsSolved
// //   }

// //   const langStats: Record<string, number> = {}
// //   for (const l of mu.languageProblemCount ?? []) langStats[l.languageName] = l.problemsSolved

// //   const attended = history.filter((h: any) => h.attended)
// //     .sort((a: any, b: any) => a.contest.startTime - b.contest.startTime)

// //   const ratingHistory = attended.map((h: any, i: number) => {
// //     const prev = attended[i - 1]
// //     return {
// //       fullDate: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
// //       date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 7),
// //       rating: Math.round(h.rating),
// //       delta: prev ? Math.round(h.rating - prev.rating) : 0,
// //       contestName: h.contest.title, rank: h.ranking,
// //     }
// //   })

// //   const contests = [...attended].reverse().slice(0, 20).map((h: any, i: number, arr: any[]) => ({
// //     name: h.contest.title,
// //     date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
// //     rank: h.ranking, rating: Math.round(h.rating),
// //     delta: arr[i + 1] ? Math.round(h.rating - arr[i + 1].rating) : 0,
// //   }))

// //   const maxRating = ratingHistory.length ? Math.max(...ratingHistory.map(h => h.rating)) : 0

// //   return {
// //     handle, username: mu.profile?.realName ?? handle,
// //     avatar: mu.profile?.userAvatar ?? '', ranking: mu.profile?.ranking ?? 0,
// //     contestRating: cr ? Math.round(cr.rating) : 0, maxRating,
// //     totalSolved: total, easySolved: easy, mediumSolved: medium, hardSolved: hard,
// //     totalEasy: 803, totalMedium: 1685, totalHard: 712,
// //     acceptanceRate: totalSubs > 0 ? Math.round((total / totalSubs) * 10000) / 100 : 0,
// //     streak: 0, totalContests: cr?.attendedContestsCount ?? 0,
// //     globalRanking: cr?.globalRanking ?? 0,
// //     tagDistribution: tagDist, languageStats: langStats, ratingHistory, contests,
// //     weeklyStats: { solvedThisWeek: 0, activeDays: 0, avgPerDay: 0 },
// //   }
// // }

// // // ═══════════════════════════════════════════════════════════════════════════
// // // AI COACH — Gemini with multi-model fallback + rich prompt
// // // ═══════════════════════════════════════════════════════════════════════════
// // export interface AIResult {
// //   daily_problem_sheet: Array<{
// //     platform: string; problem_name: string; url: string
// //     focus_tag: string; estimated_difficulty: string
// //   }>
// //   weak_topic_analysis: string
// //   weekly_roadmap: Array<{ day: number; topic: string; resource_focus: string }>
// // }

// // export async function generateAIPlan(payload: {
// //   cfHandle?: string; lcHandle?: string
// //   cfRating?: number; cfMaxRating?: number; lcContestRating?: number
// //   cfTagDistribution?: Record<string, number>
// //   lcTagDistribution?: Record<string, number>
// //   cfTotalSolved?: number; lcTotalSolved?: number
// //   cfWeeklySolved?: number; lcEasy?: number; lcMedium?: number; lcHard?: number
// //   cfRecentContests?: Array<{ name: string; delta: number; rank: number }>
// //   cfDifficultyDist?: Record<string, number>
// // }): Promise<AIResult> {
// //   const KEY = import.meta.env.VITE_GEMINI_API_KEY
// //   if (!KEY) throw new Error('Missing VITE_GEMINI_API_KEY in .env — see .env.example')

// //   const {
// //     cfHandle = '', lcHandle = '', cfRating = 0, cfMaxRating = 0,
// //     lcContestRating = 0, cfTagDistribution = {}, lcTagDistribution = {},
// //     cfTotalSolved = 0, lcTotalSolved = 0, cfWeeklySolved = 0,
// //     lcEasy = 0, lcMedium = 0, lcHard = 0,
// //     cfRecentContests = [], cfDifficultyDist = {},
// //   } = payload

// //   // Build weak topic list from real data
// //   const allTags: Record<string, number> = {}
// //   for (const [k, v] of Object.entries(cfTagDistribution)) allTags[k] = (allTags[k] ?? 0) + v
// //   for (const [k, v] of Object.entries(lcTagDistribution)) allTags[k] = (allTags[k] ?? 0) + v
// //   const sorted = Object.entries(allTags).sort(([, a], [, b]) => a - b)
// //   const weakTopics = sorted.slice(0, 6).map(([t, c]) => `${t}(${c} solved)`)
// //   const strongTopics = sorted.slice(-4).reverse().map(([t, c]) => `${t}(${c} solved)`)
// //   const recentCF = cfRecentContests.slice(0, 5).map(c => `${c.name}:rank${c.rank}(${c.delta > 0 ? '+' : ''}${c.delta})`).join(', ')
// //   const diffSummary = Object.entries(cfDifficultyDist).map(([r, c]) => `${r}:${c}`).join(', ')

// //   const prompt = `You are an expert competitive programming coach. Analyze this user's REAL data and generate a highly personalized improvement plan.

// // REAL USER STATS:
// // - Codeforces: handle=${cfHandle || 'none'}, rating=${cfRating} (peak ${cfMaxRating}), solved=${cfTotalSolved}, solved_this_week=${cfWeeklySolved}
// // - LeetCode: handle=${lcHandle || 'none'}, contest_rating=${lcContestRating}, solved=${lcTotalSolved} (Easy=${lcEasy} Medium=${lcMedium} Hard=${lcHard})
// // - CF difficulty distribution: ${diffSummary || 'unknown'}
// // - Weak topics (least practiced): ${weakTopics.join(', ') || 'unknown'}
// // - Strong topics: ${strongTopics.join(', ') || 'unknown'}
// // - Recent CF contests: ${recentCF || 'none'}

// // Based on THIS SPECIFIC data, provide:
// // 1. 7 targeted practice problems (mix CF + LC) focusing on the weakest topics above
// // 2. Analysis of exactly WHY these are weak areas based on the numbers
// // 3. A 7-day roadmap to address the specific gaps shown in the data

// // Return ONLY valid JSON (no markdown, no backticks, no explanation):
// // {
// //   "daily_problem_sheet": [
// //     {
// //       "platform": "Codeforces",
// //       "problem_name": "exact problem title",
// //       "url": "https://codeforces.com/problemset/problem/ID/LETTER",
// //       "focus_tag": "exact topic tag",
// //       "estimated_difficulty": "1400"
// //     }
// //   ],
// //   "weak_topic_analysis": "3-4 sentences referencing actual numbers from user stats",
// //   "weekly_roadmap": [
// //     { "day": 1, "topic": "Topic Name", "resource_focus": "Specific 2-3 sentence plan" }
// //   ]
// // }

// // CRITICAL:
// // - daily_problem_sheet: exactly 7 entries, real CF/LC problem URLs
// // - weekly_roadmap: exactly 7 entries (day 1 through 7)
// // - Reference actual numbers from the stats above in your analysis
// // - Problems should target CF rating ${cfRating - 100} to ${cfRating + 200} range
// // - For LeetCode, match Hard problems only if hardSolved > 50`

// //   const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.0-pro']
// //   let lastErr = ''

// //   for (const model of models) {
// //     try {
// //       const r = await fetch(
// //         `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`,
// //         {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify({
// //             contents: [{ parts: [{ text: prompt }] }],
// //             generationConfig: { temperature: 0.4, maxOutputTokens: 3000 },
// //           }),
// //         }
// //       )
// //       if (!r.ok) { lastErr = `${model}: HTTP ${r.status} ${await r.text()}`; continue }
// //       const gData = await r.json()
// //       const text = gData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
// //       if (!text) { lastErr = `${model}: empty response`; continue }
// //       const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
// //       const parsed = JSON.parse(cleaned)
// //       if (!parsed.daily_problem_sheet || !parsed.weekly_roadmap) throw new Error('Incomplete response')
// //       return parsed as AIResult
// //     } catch (e: any) { lastErr = e.message }
// //   }
// //   throw new Error(`AI Coach failed. ${lastErr}. Check your VITE_GEMINI_API_KEY in .env`)
// // }

// // // ═══════════════════════════════════════════════════════════════════════════
// // // DATABASE HELPERS
// // // ═══════════════════════════════════════════════════════════════════════════
// // export async function saveCFData(userId: string, d: CFData) {
// //   const { error } = await supabase.from('cf_data').upsert({
// //     user_id: userId, handle: d.handle, rating: d.rating, max_rating: d.maxRating,
// //     rank: d.rank, max_rank: d.maxRank, total_solved: d.totalSolved, streak_days: d.streakDays,
// //     contribution: d.contribution, friend_count: d.friendCount, country: d.country,
// //     organization: d.organization, avatar: d.avatar, rating_history: d.ratingHistory,
// //     tag_dist: d.tagDistribution, difficulty_dist: d.difficultyDist, contests: d.contests,
// //     cached_at: new Date().toISOString(),
// //   }, { onConflict: 'user_id' })
// //   if (error) throw error
// // }

// // export async function loadCFData(userId: string): Promise<CFData | null> {
// //   const { data } = await supabase.from('cf_data').select('*').eq('user_id', userId).single()
// //   if (!data) return null
// //   return {
// //     handle: data.handle, rating: data.rating, maxRating: data.max_rating,
// //     rank: data.rank, maxRank: data.max_rank, totalSolved: data.total_solved,
// //     streakDays: data.streak_days, contribution: data.contribution, friendCount: data.friend_count,
// //     country: data.country, organization: data.organization, avatar: data.avatar,
// //     ratingHistory: data.rating_history ?? [], tagDistribution: data.tag_dist ?? {},
// //     difficultyDist: data.difficulty_dist ?? {}, contests: data.contests ?? [],
// //     weeklyStats: { solvedThisWeek: 0, activeDays: 0, submissionsThisWeek: 0, avgPerDay: 0 },
// //   }
// // }

// // export async function saveLCData(userId: string, d: LCData) {
// //   const { error } = await supabase.from('lc_data').upsert({
// //     user_id: userId, handle: d.handle, real_name: d.username, avatar: d.avatar,
// //     ranking: d.ranking, contest_rating: d.contestRating, max_rating: d.maxRating,
// //     total_solved: d.totalSolved, easy_solved: d.easySolved, medium_solved: d.mediumSolved,
// //     hard_solved: d.hardSolved, total_easy: d.totalEasy, total_medium: d.totalMedium,
// //     total_hard: d.totalHard, acceptance_rate: d.acceptanceRate, streak: d.streak,
// //     total_contests: d.totalContests, global_ranking: d.globalRanking,
// //     tag_dist: d.tagDistribution, rating_history: d.ratingHistory,
// //     contests: d.contests, cached_at: new Date().toISOString(),
// //   }, { onConflict: 'user_id' })
// //   if (error) throw error
// // }

// // export async function loadLCData(userId: string): Promise<LCData | null> {
// //   const { data } = await supabase.from('lc_data').select('*').eq('user_id', userId).single()
// //   if (!data) return null
// //   return {
// //     handle: data.handle, username: data.real_name, avatar: data.avatar,
// //     ranking: data.ranking, contestRating: data.contest_rating, maxRating: data.max_rating,
// //     totalSolved: data.total_solved, easySolved: data.easy_solved, mediumSolved: data.medium_solved,
// //     hardSolved: data.hard_solved, totalEasy: data.total_easy, totalMedium: data.total_medium,
// //     totalHard: data.total_hard, acceptanceRate: data.acceptance_rate, streak: data.streak,
// //     totalContests: data.total_contests, globalRanking: data.global_ranking,
// //     tagDistribution: data.tag_dist ?? {}, languageStats: {},
// //     ratingHistory: data.rating_history ?? [], contests: data.contests ?? [],
// //     weeklyStats: { solvedThisWeek: 0, activeDays: 0, avgPerDay: 0 },
// //   }
// // }

// // export interface Note {
// //   id: string; title: string; content: string
// //   platform: 'CF' | 'LC' | 'BOTH'; tags: string[]
// //   url: string; bookmarked: boolean; created_at: string
// // }
// // export async function getNotes(userId: string): Promise<Note[]> {
// //   const { data, error } = await supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
// //   if (error) throw error; return (data ?? []) as Note[]
// // }
// // export async function createNote(userId: string, note: Omit<Note, 'id' | 'created_at'>): Promise<Note> {
// //   const { data, error } = await supabase.from('notes').insert({ ...note, user_id: userId }).select().single()
// //   if (error) throw error; return data as Note
// // }
// // export async function updateNote(id: string, updates: Partial<Note>): Promise<void> {
// //   const { error } = await supabase.from('notes').update(updates).eq('id', id); if (error) throw error
// // }
// // export async function deleteNote(id: string): Promise<void> {
// //   const { error } = await supabase.from('notes').delete().eq('id', id); if (error) throw error
// // }

// // export interface Goal {
// //   id: string; title: string; platform: 'CF' | 'LC' | 'BOTH'
// //   target: number; current: number; deadline: string; color: string; achieved: boolean; created_at: string
// // }
// // export async function getGoals(userId: string): Promise<Goal[]> {
// //   const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false })
// //   if (error) throw error; return (data ?? []) as Goal[]
// // }
// // export async function createGoal(userId: string, goal: Omit<Goal, 'id' | 'created_at'>): Promise<Goal> {
// //   const { data, error } = await supabase.from('goals').insert({ ...goal, user_id: userId }).select().single()
// //   if (error) throw error; return data as Goal
// // }
// // export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
// //   const { error } = await supabase.from('goals').update(updates).eq('id', id); if (error) throw error
// // }
// // export async function deleteGoal(id: string): Promise<void> {
// //   const { error } = await supabase.from('goals').delete().eq('id', id); if (error) throw error
// // }

// // export async function saveAISession(userId: string, result: AIResult): Promise<void> {
// //   await supabase.from('ai_sessions').insert({
// //     user_id: userId, roadmap: result.weekly_roadmap,
// //     problems: result.daily_problem_sheet, weak_analysis: result.weak_topic_analysis,
// //   })
// // }
// // export async function getLatestAISession(userId: string): Promise<AIResult | null> {
// //   const { data } = await supabase.from('ai_sessions').select('*')
// //     .eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
// //   if (!data) return null
// //   return { weekly_roadmap: data.roadmap, daily_problem_sheet: data.problems, weak_topic_analysis: data.weak_analysis }
// // }


// import { supabase } from '../lib/supabase'

// // ═══════════════════════════════════════════════════════════════════════════
// // TYPES
// // ═══════════════════════════════════════════════════════════════════════════
// export interface CFData {
//   handle: string; rating: number; maxRating: number
//   rank: string; maxRank: string; totalSolved: number
//   streakDays: number; contribution: number; friendCount: number
//   country: string; organization: string; avatar: string
//   ratingHistory: Array<{
//     date: string; fullDate: string; rating: number; oldRating: number
//     contest: string; rank: number; delta: number
//   }>
//   tagDistribution: Record<string, number>
//   difficultyDist: Record<string, number>
//   weeklyStats: {
//     solvedThisWeek: number; activeDays: number
//     submissionsThisWeek: number; avgPerDay: number
//   }
//   contests: Array<{
//     name: string; date: string; rank: number
//     delta: number; newRating: number; oldRating: number
//   }>
// }

// export interface LCData {
//   handle: string; username: string; avatar: string
//   ranking: number; contestRating: number; maxRating: number
//   totalSolved: number; easySolved: number; mediumSolved: number; hardSolved: number
//   totalEasy: number; totalMedium: number; totalHard: number
//   acceptanceRate: number; streak: number; totalContests: number; globalRanking: number
//   tagDistribution: Record<string, number>
//   languageStats: Record<string, number>
//   ratingHistory: Array<{
//     date: string; fullDate: string; rating: number
//     contestName: string; rank: number; delta: number
//   }>
//   weeklyStats: {
//     solvedThisWeek: number; activeDays: number; avgPerDay: number
//   }
//   contests: Array<{ name: string; date: string; rank: number; delta: number; rating: number }>
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // CODEFORCES — direct browser fetch, CF API has open CORS
// // ═══════════════════════════════════════════════════════════════════════════
// export async function fetchCFData(handle: string): Promise<CFData> {
//   const base = 'https://codeforces.com/api'
//   const [uRes, rRes, sRes] = await Promise.all([
//     fetch(`${base}/user.info?handles=${encodeURIComponent(handle)}`),
//     fetch(`${base}/user.rating?handle=${encodeURIComponent(handle)}`),
//     fetch(`${base}/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`),
//   ])
//   const [uData, rData, sData] = await Promise.all([uRes.json(), rRes.json(), sRes.json()])

//   if (uData.status !== 'OK') throw new Error(uData.comment ?? 'Codeforces user not found.')
//   const u = uData.result[0]

//   // Full rating history — every contest with full data
//   const ratingHistory = (rData.status === 'OK' ? rData.result : []).map((r: any) => ({
//     fullDate: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
//     date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 7),
//     rating: r.newRating, oldRating: r.oldRating,
//     delta: r.newRating - r.oldRating,
//     contest: r.contestName, rank: r.rank,
//   }))

//   const contests = (rData.status === 'OK' ? rData.result : [])
//     .slice(-20).reverse().map((r: any) => ({
//       name: r.contestName,
//       date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
//       rank: r.rank, delta: r.newRating - r.oldRating,
//       newRating: r.newRating, oldRating: r.oldRating,
//     }))

//   // Process all submissions
//   const subs = sData.status === 'OK' ? sData.result : []
//   const acProbs = new Set<string>()
//   const tagCount: Record<string, number> = {}
//   const diffCount: Record<string, number> = {}
//   const submDays = new Set<string>()

//   // Weekly stats — last 7 days
//   const now = Date.now()
//   const weekMs = 7 * 24 * 3600 * 1000
//   let weekSolved = 0, weekSubs = 0
//   const weekDays = new Set<string>()

//   for (const sub of subs) {
//     const ts = sub.creationTimeSeconds * 1000
//     const day = new Date(ts).toISOString().slice(0, 10)
//     submDays.add(day)
//     if (now - ts < weekMs) {
//       weekSubs++
//       weekDays.add(day)
//     }
//     if (sub.verdict !== 'OK') continue
//     const key = `${sub.problem.contestId}-${sub.problem.index}`
//     if (acProbs.has(key)) continue
//     acProbs.add(key)
//     if (now - ts < weekMs) weekSolved++
//     for (const tag of sub.problem.tags ?? []) tagCount[tag] = (tagCount[tag] ?? 0) + 1
//     const r = sub.problem.rating ?? 0
//     if (r > 0) {
//       const bucket = `${Math.floor(r / 200) * 200}-${Math.floor(r / 200) * 200 + 199}`
//       diffCount[bucket] = (diffCount[bucket] ?? 0) + 1
//     }
//   }

//   let streak = 0
//   const today = new Date()
//   for (let i = 0; i < 365; i++) {
//     const d = new Date(today); d.setDate(d.getDate() - i)
//     if (submDays.has(d.toISOString().slice(0, 10))) streak++
//     else if (i > 0) break
//   }

//   return {
//     handle: u.handle, rating: u.rating ?? 0, maxRating: u.maxRating ?? 0,
//     rank: u.rank ?? 'unrated', maxRank: u.maxRank ?? 'unrated',
//     totalSolved: acProbs.size, streakDays: streak,
//     contribution: u.contribution ?? 0, friendCount: u.friendOfCount ?? 0,
//     country: u.country ?? '', organization: u.organization ?? '',
//     avatar: u.titlePhoto ?? '',
//     ratingHistory, tagDistribution: tagCount, difficultyDist: diffCount, contests,
//     weeklyStats: {
//       solvedThisWeek: weekSolved, activeDays: weekDays.size,
//       submissionsThisWeek: weekSubs,
//       avgPerDay: weekDays.size > 0 ? Math.round((weekSolved / 7) * 10) / 10 : 0,
//     },
//   }
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // LEETCODE — tries 3 CORS proxies with auto-fallback
// // ═══════════════════════════════════════════════════════════════════════════
// const LC_GQL = `query getUserProfile($username: String!) {
//   matchedUser(username: $username) {
//     username
//     profile { realName userAvatar ranking countryName }
//     submitStats {
//       acSubmissionNum { difficulty count submissions }
//       totalSubmissionNum { difficulty count submissions }
//     }
//     tagProblemCounts {
//       advanced      { tagName tagSlug problemsSolved }
//       intermediate  { tagName tagSlug problemsSolved }
//       fundamental   { tagName tagSlug problemsSolved }
//     }
//     languageProblemCount { languageName problemsSolved }
//   }
//   allQuestionsCount { difficulty count }
//   userContestRanking(username: $username) {
//     rating globalRanking attendedContestsCount
//   }
//   userContestRankingHistory(username: $username) {
//     attended rating ranking
//     contest { title startTime }
//   }
// }`

// export async function fetchLCData(handle: string): Promise<LCData> {
//   const body = JSON.stringify({ query: LC_GQL, variables: { username: handle } })
//   const proxies = [
//     () => fetch('https://corsproxy.io/?' + encodeURIComponent('https://leetcode.com/graphql'), {
//       method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
//     }),
//     () => fetch('https://api.allorigins.win/post?url=' + encodeURIComponent('https://leetcode.com/graphql'), {
//       method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
//     }),
//     () => fetch('https://thingproxy.freeboard.io/fetch/https://leetcode.com/graphql', {
//       method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
//     }),
//   ]

//   let raw: any = null
//   for (const proxy of proxies) {
//     try {
//       const r = await proxy()
//       if (!r.ok) continue
//       const data = await r.json()
//       raw = data?.contents ? (() => { try { return JSON.parse(data.contents) } catch { return null } })() : data
//       if (raw?.data?.matchedUser) break
//       raw = null
//     } catch { continue }
//   }

//   if (!raw?.data?.matchedUser) throw new Error('LeetCode user not found or API unreachable. Check username & try again.')

//   const mu = raw.data.matchedUser
//   const cr = raw.data.userContestRanking
//   const history = raw.data.userContestRankingHistory ?? []

//   const ac = mu.submitStats?.acSubmissionNum ?? []
//   const total  = ac.find((s: any) => s.difficulty === 'All')?.count       ?? 0
//   const easy   = ac.find((s: any) => s.difficulty === 'Easy')?.count      ?? 0
//   const medium = ac.find((s: any) => s.difficulty === 'Medium')?.count    ?? 0
//   const hard   = ac.find((s: any) => s.difficulty === 'Hard')?.count      ?? 0
//   const totalSubs = ac.find((s: any) => s.difficulty === 'All')?.submissions ?? 1

//   const tagDist: Record<string, number> = {}
//   for (const grp of [mu.tagProblemCounts?.advanced, mu.tagProblemCounts?.intermediate, mu.tagProblemCounts?.fundamental]) {
//     for (const t of grp ?? []) if (t.problemsSolved > 0) tagDist[t.tagName] = (tagDist[t.tagName] ?? 0) + t.problemsSolved
//   }

//   const langStats: Record<string, number> = {}
//   for (const l of mu.languageProblemCount ?? []) langStats[l.languageName] = l.problemsSolved

//   const attended = history.filter((h: any) => h.attended)
//     .sort((a: any, b: any) => a.contest.startTime - b.contest.startTime)

//   const ratingHistory = attended.map((h: any, i: number) => {
//     const prev = attended[i - 1]
//     return {
//       fullDate: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
//       date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 7),
//       rating: Math.round(h.rating),
//       delta: prev ? Math.round(h.rating - prev.rating) : 0,
//       contestName: h.contest.title, rank: h.ranking,
//     }
//   })

//   const contests = [...attended].reverse().slice(0, 20).map((h: any, i: number, arr: any[]) => ({
//     name: h.contest.title,
//     date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
//     rank: h.ranking, rating: Math.round(h.rating),
//     delta: arr[i + 1] ? Math.round(h.rating - arr[i + 1].rating) : 0,
//   }))

//   const maxRating = ratingHistory.length ? Math.max(...ratingHistory.map(h => h.rating)) : 0

//   return {
//     handle, username: mu.profile?.realName ?? handle,
//     avatar: mu.profile?.userAvatar ?? '', ranking: mu.profile?.ranking ?? 0,
//     contestRating: cr ? Math.round(cr.rating) : 0, maxRating,
//     totalSolved: total, easySolved: easy, mediumSolved: medium, hardSolved: hard,
//     // Real total counts from LeetCode API
//     totalEasy:   (raw.data?.allQuestionsCount?.find((q: any) => q.difficulty === 'Easy')?.count ?? 803),
//     totalMedium: (raw.data?.allQuestionsCount?.find((q: any) => q.difficulty === 'Medium')?.count ?? 1685),
//     totalHard:   (raw.data?.allQuestionsCount?.find((q: any) => q.difficulty === 'Hard')?.count ?? 712),
//     acceptanceRate: totalSubs > 0 ? Math.round((total / totalSubs) * 10000) / 100 : 0,
//     streak: 0, totalContests: cr?.attendedContestsCount ?? 0,
//     globalRanking: cr?.globalRanking ?? 0,
//     tagDistribution: tagDist, languageStats: langStats, ratingHistory, contests,
//     weeklyStats: { solvedThisWeek: 0, activeDays: 0, avgPerDay: 0 },
//   }
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // AI COACH — Gemini with multi-model fallback + rich prompt
// // ═══════════════════════════════════════════════════════════════════════════
// export interface AIResult {
//   daily_problem_sheet: Array<{
//     platform: string; problem_name: string; url: string
//     focus_tag: string; estimated_difficulty: string
//   }>
//   weak_topic_analysis: string
//   weekly_roadmap: Array<{ day: number; topic: string; resource_focus: string }>
// }

// export async function generateAIPlan(payload: {
//   cfHandle?: string; lcHandle?: string
//   cfRating?: number; cfMaxRating?: number; lcContestRating?: number
//   cfTagDistribution?: Record<string, number>
//   lcTagDistribution?: Record<string, number>
//   cfTotalSolved?: number; lcTotalSolved?: number
//   cfWeeklySolved?: number; lcEasy?: number; lcMedium?: number; lcHard?: number
//   cfRecentContests?: Array<{ name: string; delta: number; rank: number }>
//   cfDifficultyDist?: Record<string, number>
// }): Promise<AIResult> {
//   const KEY = import.meta.env.VITE_GEMINI_API_KEY
//   if (!KEY) throw new Error('Missing VITE_GEMINI_API_KEY in .env — see .env.example')

//   const {
//     cfHandle = '', lcHandle = '', cfRating = 0, cfMaxRating = 0,
//     lcContestRating = 0, cfTagDistribution = {}, lcTagDistribution = {},
//     cfTotalSolved = 0, lcTotalSolved = 0, cfWeeklySolved = 0,
//     lcEasy = 0, lcMedium = 0, lcHard = 0,
//     cfRecentContests = [], cfDifficultyDist = {},
//   } = payload

//   // Build weak topic list from real data
//   const allTags: Record<string, number> = {}
//   for (const [k, v] of Object.entries(cfTagDistribution)) allTags[k] = (allTags[k] ?? 0) + v
//   for (const [k, v] of Object.entries(lcTagDistribution)) allTags[k] = (allTags[k] ?? 0) + v
//   const sorted = Object.entries(allTags).sort(([, a], [, b]) => a - b)
//   const weakTopics = sorted.slice(0, 6).map(([t, c]) => `${t}(${c} solved)`)
//   const strongTopics = sorted.slice(-4).reverse().map(([t, c]) => `${t}(${c} solved)`)
//   const recentCF = cfRecentContests.slice(0, 5).map(c => `${c.name}:rank${c.rank}(${c.delta > 0 ? '+' : ''}${c.delta})`).join(', ')
//   const diffSummary = Object.entries(cfDifficultyDist).map(([r, c]) => `${r}:${c}`).join(', ')

//   const prompt = `You are an expert competitive programming coach. Analyze this user's REAL data and generate a highly personalized improvement plan.

// REAL USER STATS:
// - Codeforces: handle=${cfHandle || 'none'}, rating=${cfRating} (peak ${cfMaxRating}), solved=${cfTotalSolved}, solved_this_week=${cfWeeklySolved}
// - LeetCode: handle=${lcHandle || 'none'}, contest_rating=${lcContestRating}, solved=${lcTotalSolved} (Easy=${lcEasy} Medium=${lcMedium} Hard=${lcHard})
// - CF difficulty distribution: ${diffSummary || 'unknown'}
// - Weak topics (least practiced): ${weakTopics.join(', ') || 'unknown'}
// - Strong topics: ${strongTopics.join(', ') || 'unknown'}
// - Recent CF contests: ${recentCF || 'none'}

// Based on THIS SPECIFIC data, provide:
// 1. 7 targeted practice problems (mix CF + LC) focusing on the weakest topics above
// 2. Analysis of exactly WHY these are weak areas based on the numbers
// 3. A 7-day roadmap to address the specific gaps shown in the data

// Return ONLY valid JSON (no markdown, no backticks, no explanation):
// {
//   "daily_problem_sheet": [
//     {
//       "platform": "Codeforces",
//       "problem_name": "exact problem title",
//       "url": "https://codeforces.com/problemset/problem/ID/LETTER",
//       "focus_tag": "exact topic tag",
//       "estimated_difficulty": "1400"
//     }
//   ],
//   "weak_topic_analysis": "3-4 sentences referencing actual numbers from user stats",
//   "weekly_roadmap": [
//     { "day": 1, "topic": "Topic Name", "resource_focus": "Specific 2-3 sentence plan" }
//   ]
// }

// CRITICAL:
// - daily_problem_sheet: exactly 7 entries, real CF/LC problem URLs
// - weekly_roadmap: exactly 7 entries (day 1 through 7)
// - Reference actual numbers from the stats above in your analysis
// - Problems should target CF rating ${cfRating - 100} to ${cfRating + 200} range
// - For LeetCode, match Hard problems only if hardSolved > 50`

// //   const models = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-flash', 'gemini-1.5-pro']
// //   let lastErr = ''

// //   for (const model of models) {
// //     try {
// //       const r = await fetch(
// //         `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`,
// //         {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify({
// //             contents: [{ parts: [{ text: prompt }] }],
// //             generationConfig: { temperature: 0.4, maxOutputTokens: 3000 },
// //           }),
// //         }
// //       )
// //       if (!r.ok) { lastErr = `${model}: HTTP ${r.status} ${await r.text()}`; continue }
// //       const gData = await r.json()
// //       const text = gData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
// //       if (!text) { lastErr = `${model}: empty response`; continue }
// //       const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
// //       const parsed = JSON.parse(cleaned)
// //       if (!parsed.daily_problem_sheet || !parsed.weekly_roadmap) throw new Error('Incomplete response')
// //       return parsed as AIResult
// //     } catch (e: any) { lastErr = e.message }
// //   }
// //   throw new Error(`AI Coach failed. ${lastErr}. Check your VITE_GEMINI_API_KEY in .env`)
// // }
// // Model candidates with their correct API versions
//   // const candidates = [
//   //   { model: 'gemini-2.0-flash',       ver: 'v1beta' },
//   //   { model: 'gemini-2.0-flash-lite',  ver: 'v1beta' },
//   //   { model: 'gemini-1.5-flash',       ver: 'v1' },
//   //   { model: 'gemini-1.5-flash-latest',ver: 'v1' },
//   //   { model: 'gemini-1.5-flash',    ver: 'v1' },
//   // ]
//   // let lastErr = ''

//   // for (const { model, ver } of candidates) {
//   //   try {
//   //     const endpoint = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${KEY}`
//   //     const r = await fetch(endpoint, {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({
//   //         contents: [{ parts: [{ text: prompt }] }],
//   //         generationConfig: { temperature: 0.4, maxOutputTokens: 3000 },
//   //       }),
//   //     })

//   //     if (!r.ok) {
//   //       await r.text()
//   //       lastErr = `${model} (${ver}): HTTP ${r.status}`
//   //       if (r.status === 404 || r.status === 400) continue
//   //       if (r.status === 403) throw new Error(`Invalid API key. Get a free key at aistudio.google.com`)
//   //       continue
//   //     }

//   //     const gData = await r.json()
//   //     const text = gData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
//   //     if (!text) { lastErr = `${model}: empty response`; continue }

//   //     const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

//   //     let parsed: any
//   //     try {
//   //       parsed = JSON.parse(cleaned)
//   //     } catch {
//   //       const match = cleaned.match(/\{[\s\S]*\}/)
//   //       if (!match) { lastErr = `${model}: invalid JSON`; continue }
//   //       try { parsed = JSON.parse(match[0]) } catch { lastErr = `${model}: JSON parse failed`; continue }
//   //     }

//   //     if (!parsed.daily_problem_sheet || !parsed.weekly_roadmap) {
//   //       lastErr = `${model}: incomplete response`; continue
//   //     }

//   //     return parsed as AIResult

//   //   } catch (e: any) {
//   //     if (e.message.includes('Invalid API key')) throw e
//   //     lastErr = e.message
//   //   }
//   // }

//   // throw new Error(`AI Coach: all models failed. Last: ${lastErr}. Verify your VITE_GEMINI_API_KEY at aistudio.google.com`)
// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// // Only VERIFIED REST-supported models
// const candidates = [
//   { model: 'gemini-1.5-flash', ver: 'v1' },
//   { model: 'gemini-1.5-pro', ver: 'v1' }
// ];

// let lastErr = '';

// export async function callGemini(prompt: string) {
//   for (const { model, ver } of candidates) {
//     try {
//       const endpoint = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

//       const r = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               role: 'user',
//               parts: [{ text: prompt }],
//             },
//           ],
//           generationConfig: {
//             temperature: 0.4,
//             maxOutputTokens: 3000,
//           },
//         }),
//       });

//       // IMPORTANT: always read response body for debugging
//       const rawText = await r.text();

//       if (!r.ok) {
//         lastErr = `${model} (${ver}): HTTP ${r.status} - ${rawText}`;

//         // Retry only for known fallback cases
//         if (r.status === 404 || r.status === 400) continue;

//         if (r.status === 403) {
//           throw new Error(
//             `Invalid API key or API not enabled. Check https://aistudio.google.com`
//           );
//         }

//         continue;
//       }

//       const gData = JSON.parse(rawText);

//       const text =
//         gData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

//       if (!text) {
//         lastErr = `${model}: empty response`;
//         continue;
//       }

//       // clean markdown fences safely
//       const cleaned = text
//         .replace(/```json\s*/gi, '')
//         .replace(/```\s*/g, '')
//         .trim();

//       let parsed: any;

//       try {
//         parsed = JSON.parse(cleaned);
//       } catch {
//         const match = cleaned.match(/\{[\s\S]*\}/);
//         if (!match) {
//           lastErr = `${model}: invalid JSON`;
//           continue;
//         }

//         parsed = JSON.parse(match[0]);
//       }

//       if (!parsed?.daily_problem_sheet || !parsed?.weekly_roadmap) {
//         lastErr = `${model}: incomplete response`;
//         continue;
//       }

//       return parsed;
//     } catch (err: any) {
//       if (err.message?.includes('Invalid API key')) throw err;
//       lastErr = err.message;
//     }
//   }

//   throw new Error(
//     `AI Coach: all models failed. Last error: ${lastErr}. Check API key and enabled models at https://aistudio.google.com`
//   );
// }
// // ═══════════════════════════════════════════════════════════════════════════
// // DATABASE HELPERS
// // ═══════════════════════════════════════════════════════════════════════════
// export async function saveCFData(userId: string, d: CFData) {
//   const { error } = await supabase.from('cf_data').upsert({
//     user_id: userId, handle: d.handle, rating: d.rating, max_rating: d.maxRating,
//     rank: d.rank, max_rank: d.maxRank, total_solved: d.totalSolved, streak_days: d.streakDays,
//     contribution: d.contribution, friend_count: d.friendCount, country: d.country,
//     organization: d.organization, avatar: d.avatar, rating_history: d.ratingHistory,
//     tag_dist: d.tagDistribution, difficulty_dist: d.difficultyDist, contests: d.contests,
//     cached_at: new Date().toISOString(),
//   }, { onConflict: 'user_id' })
//   if (error) throw error
// }

// export async function loadCFData(userId: string): Promise<CFData | null> {
//   const { data } = await supabase.from('cf_data').select('*').eq('user_id', userId).single()
//   if (!data) return null
//   return {
//     handle: data.handle, rating: data.rating, maxRating: data.max_rating,
//     rank: data.rank, maxRank: data.max_rank, totalSolved: data.total_solved,
//     streakDays: data.streak_days, contribution: data.contribution, friendCount: data.friend_count,
//     country: data.country, organization: data.organization, avatar: data.avatar,
//     ratingHistory: data.rating_history ?? [], tagDistribution: data.tag_dist ?? {},
//     difficultyDist: data.difficulty_dist ?? {}, contests: data.contests ?? [],
//     weeklyStats: { solvedThisWeek: 0, activeDays: 0, submissionsThisWeek: 0, avgPerDay: 0 },
//   }
// }

// export async function saveLCData(userId: string, d: LCData) {
//   const { error } = await supabase.from('lc_data').upsert({
//     user_id: userId, handle: d.handle, real_name: d.username, avatar: d.avatar,
//     ranking: d.ranking, contest_rating: d.contestRating, max_rating: d.maxRating,
//     total_solved: d.totalSolved, easy_solved: d.easySolved, medium_solved: d.mediumSolved,
//     hard_solved: d.hardSolved, total_easy: d.totalEasy, total_medium: d.totalMedium,
//     total_hard: d.totalHard, acceptance_rate: d.acceptanceRate, streak: d.streak,
//     total_contests: d.totalContests, global_ranking: d.globalRanking,
//     tag_dist: d.tagDistribution, rating_history: d.ratingHistory,
//     contests: d.contests, cached_at: new Date().toISOString(),
//   }, { onConflict: 'user_id' })
//   if (error) throw error
// }

// export async function loadLCData(userId: string): Promise<LCData | null> {
//   const { data } = await supabase.from('lc_data').select('*').eq('user_id', userId).single()
//   if (!data) return null
//   return {
//     handle: data.handle, username: data.real_name, avatar: data.avatar,
//     ranking: data.ranking, contestRating: data.contest_rating, maxRating: data.max_rating,
//     totalSolved: data.total_solved, easySolved: data.easy_solved, mediumSolved: data.medium_solved,
//     hardSolved: data.hard_solved, totalEasy: data.total_easy, totalMedium: data.total_medium,
//     totalHard: data.total_hard, acceptanceRate: data.acceptance_rate, streak: data.streak,
//     totalContests: data.total_contests, globalRanking: data.global_ranking,
//     tagDistribution: data.tag_dist ?? {}, languageStats: {},
//     ratingHistory: data.rating_history ?? [], contests: data.contests ?? [],
//     weeklyStats: { solvedThisWeek: 0, activeDays: 0, avgPerDay: 0 },
//   }
// }

// export interface Note {
//   id: string; title: string; content: string
//   platform: 'CF' | 'LC' | 'BOTH'; tags: string[]
//   url: string; bookmarked: boolean; created_at: string
// }
// export async function getNotes(userId: string): Promise<Note[]> {
//   const { data, error } = await supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
//   if (error) throw error; return (data ?? []) as Note[]
// }
// export async function createNote(userId: string, note: Omit<Note, 'id' | 'created_at'>): Promise<Note> {
//   const { data, error } = await supabase.from('notes').insert({ ...note, user_id: userId }).select().single()
//   if (error) throw error; return data as Note
// }
// export async function updateNote(id: string, updates: Partial<Note>): Promise<void> {
//   const { error } = await supabase.from('notes').update(updates).eq('id', id); if (error) throw error
// }
// export async function deleteNote(id: string): Promise<void> {
//   const { error } = await supabase.from('notes').delete().eq('id', id); if (error) throw error
// }

// export interface Goal {
//   id: string; title: string; platform: 'CF' | 'LC' | 'BOTH'
//   target: number; current: number; deadline: string; color: string; achieved: boolean; created_at: string
// }
// export async function getGoals(userId: string): Promise<Goal[]> {
//   const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false })
//   if (error) throw error; return (data ?? []) as Goal[]
// }
// export async function createGoal(userId: string, goal: Omit<Goal, 'id' | 'created_at'>): Promise<Goal> {
//   const { data, error } = await supabase.from('goals').insert({ ...goal, user_id: userId }).select().single()
//   if (error) throw error; return data as Goal
// }
// export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
//   const { error } = await supabase.from('goals').update(updates).eq('id', id); if (error) throw error
// }
// export async function deleteGoal(id: string): Promise<void> {
//   const { error } = await supabase.from('goals').delete().eq('id', id); if (error) throw error
// }

// export async function saveAISession(userId: string, result: AIResult): Promise<void> {
//   await supabase.from('ai_sessions').insert({
//     user_id: userId, roadmap: result.weekly_roadmap,
//     problems: result.daily_problem_sheet, weak_analysis: result.weak_topic_analysis,
//   })
// }
// export async function getLatestAISession(userId: string): Promise<AIResult | null> {
//   const { data } = await supabase.from('ai_sessions').select('*')
//     .eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
//   if (!data) return null
//   return { weekly_roadmap: data.roadmap, daily_problem_sheet: data.problems, weak_topic_analysis: data.weak_analysis }
// }
