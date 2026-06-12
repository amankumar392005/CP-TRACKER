// supabase/functions/cf-proxy/index.ts
// Fetches real Codeforces data — no API key needed, CF public API is open

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const url    = new URL(req.url)
    const handle = url.searchParams.get('handle')
    if (!handle) return json({ error: 'handle is required' }, 400)

    // ── Fetch 3 CF endpoints in parallel ────────────────────────────────
    const [uRes, rRes, sRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
      fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
      fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`),
    ])

    const [uData, rData, sData] = await Promise.all([uRes.json(), rRes.json(), sRes.json()])

    if (uData.status !== 'OK') {
      return json({ error: `CF: ${uData.comment ?? 'User not found'}` }, 404)
    }

    const u = uData.result[0]

    // ── Rating history ───────────────────────────────────────────────────
    const ratingHistory = (rData.status === 'OK' ? rData.result : []).map((r: any) => ({
      date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 7),
      rating: r.newRating,
      contest: r.contestName,
      rank: r.rank,
    })).slice(-40)

    // ── Contest list ─────────────────────────────────────────────────────
    const contests = (rData.status === 'OK' ? rData.result : []).slice(-10).reverse().map((r: any) => ({
      name: r.contestName,
      date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
      rank: r.rank,
      delta: r.newRating - r.oldRating,
      newRating: r.newRating,
      solved: String(r.rank),
    }))

    // ── Process submissions ──────────────────────────────────────────────
    const subs    = sData.status === 'OK' ? sData.result : []
    const acProbs = new Set<string>()
    const tagCount: Record<string, number> = {}
    const diffCount: Record<string, number> = {}
    const submDays = new Set<string>()

    for (const sub of subs) {
      const day = new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10)
      submDays.add(day)
      if (sub.verdict !== 'OK') continue
      const key = `${sub.problem.contestId}-${sub.problem.index}`
      if (acProbs.has(key)) continue
      acProbs.add(key)
      for (const tag of sub.problem.tags ?? []) {
        tagCount[tag] = (tagCount[tag] ?? 0) + 1
      }
      const rating = sub.problem.rating ?? 0
      if (rating > 0) {
        const bucket = `${Math.floor(rating / 200) * 200}-${Math.floor(rating / 200) * 200 + 199}`
        diffCount[bucket] = (diffCount[bucket] ?? 0) + 1
      }
    }

    // ── Streak ───────────────────────────────────────────────────────────
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i)
      if (submDays.has(d.toISOString().slice(0, 10))) streak++
      else if (i > 0) break
    }

    return json({
      handle: u.handle, rating: u.rating ?? 0, maxRating: u.maxRating ?? 0,
      rank: u.rank ?? 'unrated', maxRank: u.maxRank ?? 'unrated',
      totalSolved: acProbs.size, streakDays: streak,
      contribution: u.contribution ?? 0, friendCount: u.friendOfCount ?? 0,
      country: u.country ?? '', organization: u.organization ?? '',
      avatar: u.titlePhoto ?? '',
      ratingHistory, tagDistribution: tagCount,
      difficultyDist: diffCount, contests,
    })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})

function json(d: unknown, status = 200) {
  return new Response(JSON.stringify(d), {
    status, headers: { ...CORS, 'Content-Type': 'application/json' }
  })
}


// // supabase/functions/cf-proxy/index.ts
// import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// const CORS = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// }

// // Helper to avoid Codeforces rate-limiting triggers
// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// // Codeforces blocks requests without a recognizable User-Agent header
// const CF_HEADERS = {
//   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
// }

// serve(async (req) => {
//   if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

//   try {
//     const url = new URL(req.url)
//     const handle = url.searchParams.get('handle')
//     if (!handle) return json({ error: 'handle is required' }, 400)

//     // ── Fetch 1: User Info ─────────────────────────────────────────────
//     const uRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`, { headers: CF_HEADERS })
//     if (!uRes.ok) return json({ error: `CF: User info fetch failed with status ${uRes.status}` }, uRes.status)
//     const uData = await uRes.json()

//     if (uData.status !== 'OK') {
//       return json({ error: `CF: ${uData.comment ?? 'User not found'}` }, 404)
//     }
//     const u = uData.result[0]

//     // Spacer delay to respect CF's rate limit policy (1 request per 2 seconds)
//     await delay(3000)

//     // ── Fetch 2: User Rating History ───────────────────────────────────
//     const rRes = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`, { headers: CF_HEADERS })
//     let rData = { status: 'FAILED', result: [] }
//     if (rRes.ok) {
//       rData = await rRes.json()
//     }

//     await delay(3000)

//     // ── Fetch 3: Submissions ───────────────────────────────────────────
//     const sRes = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`, { headers: CF_HEADERS })
//     let sData = { status: 'FAILED', result: [] }
//     if (sRes.ok) {
//       sData = await sRes.json()
//     }

//     // ── Rating history processing ──────────────────────────────────────
//     const ratingHistory = (rData.status === 'OK' ? rData.result : []).map((r: any) => ({
//       date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 7),
//       rating: r.newRating,
//       contest: r.contestName,
//       rank: r.rank,
//     })).slice(-40)

//     // ── Contest list processing ────────────────────────────────────────
//     const contests = (rData.status === 'OK' ? rData.result : []).slice(-10).reverse().map((r: any) => ({
//       name: r.contestName,
//       date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
//       rank: r.rank,
//       delta: r.newRating - r.oldRating,
//       newRating: r.newRating,
//       solved: String(r.rank),
//     }))

//     // ── Process submissions ─────────────────────────────────────────────
//     const subs = sData.status === 'OK' ? sData.result : []
//     const acProbs = new Set<string>()
//     const tagCount: Record<string, number> = {}
//     const diffCount: Record<string, number> = {}
//     const submDays = new Set<string>()

//     for (const sub of subs) {
//       const day = new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10)
//       submDays.add(day)
//       if (sub.verdict !== 'OK') continue
//       const key = `${sub.problem.contestId}-${sub.problem.index}`
//       if (acProbs.has(key)) continue
//       acProbs.add(key)
//       for (const tag of sub.problem.tags ?? []) {
//         tagCount[tag] = (tagCount[tag] ?? 0) + 1
//       }
//       const rating = sub.problem.rating ?? 0
//       if (rating > 0) {
//         const bucket = `${Math.floor(rating / 200) * 200}-${Math.floor(rating / 200) * 200 + 199}`
//         diffCount[bucket] = (diffCount[bucket] ?? 0) + 1
//       }
//     }

//     // ── Streak calculation ──────────────────────────────────────────────
//     let streak = 0
//     const today = new Date()
//     for (let i = 0; i < 365; i++) {
//       const d = new Date(today); d.setDate(d.getDate() - i)
//       if (submDays.has(d.toISOString().slice(0, 10))) streak++
//       else if (i > 0) break
//     }

//     return json({
//       handle: u.handle, rating: u.rating ?? 0, maxRating: u.maxRating ?? 0,
//       rank: u.rank ?? 'unrated', maxRank: u.maxRank ?? 'unrated',
//       totalSolved: acProbs.size, streakDays: streak,
//       contribution: u.contribution ?? 0, friendCount: u.friendOfCount ?? 0,
//       country: u.country ?? '', organization: u.organization ?? '',
//       avatar: u.titlePhoto ?? '',
//       ratingHistory, tagDistribution: tagCount,
//       difficultyDist: diffCount, contests,
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