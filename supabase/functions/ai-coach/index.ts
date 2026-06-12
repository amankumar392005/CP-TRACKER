// supabase/functions/ai-coach/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY')
  if (!GEMINI_KEY) return json({ error: 'GEMINI_API_KEY secret not set in Supabase' }, 500)

  try {
    const body = await req.json()
    const {
      cfHandle = '', lcHandle = '',
      cfRating = 0, lcContestRating = 0,
      cfTagDistribution = {}, lcTagDistribution = {},
      cfTotalSolved = 0, lcTotalSolved = 0,
      lcEasy = 0, lcMedium = 0, lcHard = 0,
    } = body

    // Build weak topic list from combined tag stats
    const allTags: Record<string, number> = {}
    for (const [k, v] of Object.entries(cfTagDistribution as Record<string, number>)) {
      allTags[k] = (allTags[k] ?? 0) + v
    }
    for (const [k, v] of Object.entries(lcTagDistribution as Record<string, number>)) {
      allTags[k] = (allTags[k] ?? 0) + v
    }
    const weakTags = Object.entries(allTags)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 8)
      .map(([t, c]) => `${t}(${c})`)
      .join(', ')

    const prompt = `You are an elite competitive programming coach. Generate a personalized 1-week study plan.

USER STATS:
- Codeforces: handle=${cfHandle || 'none'}, rating=${cfRating}, total_solved=${cfTotalSolved}
- LeetCode: handle=${lcHandle || 'none'}, contest_rating=${lcContestRating}, solved=${lcTotalSolved} (Easy=${lcEasy}, Medium=${lcMedium}, Hard=${lcHard})
- Weakest topics (fewest solved): ${weakTags || 'unknown'}

OUTPUT: Return ONLY valid JSON, no markdown, no explanation, no backticks.

{
  "daily_problem_sheet": [
    {
      "platform": "Codeforces" or "LeetCode",
      "problem_name": "exact problem title",
      "url": "direct URL to problem",
      "focus_tag": "one algorithmic tag",
      "estimated_difficulty": "Easy/Medium/Hard or CF rating like 1400"
    }
  ],
  "weak_topic_analysis": "2-3 sentence analysis of weaknesses and priority actions",
  "weekly_roadmap": [
    { "day": 1, "topic": "topic name", "resource_focus": "what to study" },
    { "day": 2, "topic": "...", "resource_focus": "..." },
    { "day": 3, "topic": "...", "resource_focus": "..." },
    { "day": 4, "topic": "...", "resource_focus": "..." },
    { "day": 5, "topic": "...", "resource_focus": "..." },
    { "day": 6, "topic": "Virtual Contest", "resource_focus": "Simulate a full rated contest" },
    { "day": 7, "topic": "Review & Upsolve", "resource_focus": "Study solutions you couldn't solve" }
  ]
}

RULES:
- daily_problem_sheet: exactly 7 problems targeting weak topics
- Use real URLs: LC = https://leetcode.com/problems/slug/, CF = https://codeforces.com/problemset/problem/id/letter
- Match difficulty to user level (CF rating ~${cfRating}, LC rating ~${lcContestRating})
- weekly_roadmap: exactly 7 entries (day 1-7)`

    const gRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048, responseMimeType: 'application/json' },
        }),
      }
    )

    if (!gRes.ok) {
      const err = await gRes.text()
      return json({ error: `Gemini error: ${err}` }, 502)
    }

    const gData = await gRes.json()
    const raw   = gData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const clean = raw.replace(/```json|```/g, '').trim()

    let parsed
    try { parsed = JSON.parse(clean) }
    catch { return json({ error: 'Gemini returned invalid JSON', raw }, 502) }

    return json(parsed)
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})

function json(d: unknown, status = 200) {
  return new Response(JSON.stringify(d), {
    status, headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}



// // supabase/functions/ai-coach/index.ts
// import { serve } from '[https://deno.land/std@0.177.0/http/server.ts](https://deno.land/std@0.177.0/http/server.ts)'

// const CORS = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// }

// serve(async (req) => {
//   if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
//   if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

//   const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY')
//   if (!GEMINI_KEY) return json({ error: 'GEMINI_API_KEY secret not set in Supabase' }, 500)

//   try {
//     const body = await req.json()
//     const {
//       cfHandle = '', lcHandle = '',
//       cfRating = 0, lcContestRating = 0,
//       cfTagDistribution = {}, lcTagDistribution = {},
//       cfTotalSolved = 0, lcTotalSolved = 0,
//       lcEasy = 0, lcMedium = 0, lcHard = 0,
//     } = body

//     // Combine tags to assess profile density
//     const allTags: Record<string, number> = {}
//     for (const [k, v] of Object.entries(cfTagDistribution as Record<string, number>)) {
//       allTags[k] = (allTags[k] ?? 0) + v
//     }
//     for (const [k, v] of Object.entries(lcTagDistribution as Record<string, number>)) {
//       allTags[k] = (allTags[k] ?? 0) + v
//     }

//     // Convert distribution to string format for context mapping
//     const distributionProfile = Object.entries(allTags)
//       .map(([t, c]) => `${t}: ${c} solved`)
//       .join(', ')

//     const prompt = `You are an elite competitive programming and algorithmic coach. 
// Analyze the user's current metrics and metrics distribution to generate a hyper-personalized 1-week study roadmap and targeted problem strategy.

// USER PROFILE METRICS:
// - Codeforces Handle: ${cfHandle || 'Not connected'}
// - Codeforces Rating: ${cfRating} (Total Solved: ${cfTotalSolved})
// - LeetCode Handle: ${lcHandle || 'Not connected'}
// - LeetCode Contest Rating: ${lcContestRating} (Total Solved: ${lcTotalSolved} -> Easy: ${lcEasy}, Medium: ${lcMedium}, Hard: ${lcHard})
// - Current Tag Distribution Density: ${distributionProfile || 'No submissions tracked yet'}

// CRITICAL REQUIREMENT:
// Design a roadmap targeting algorithmic weaknesses implied by the profile or explicit low metrics areas. 
// For problem assignments, focus on standard, universally static canonical problem titles that strictly match the user's current rating level:
// - Codeforces target rating range: ${cfRating > 0 ? `${cfRating}-${cfRating + 200}` : '1200-1400'}
// - LeetCode target difficulty: ${lcContestRating > 1800 ? 'Hard' : lcContestRating > 1400 ? 'Medium' : 'Easy'}

// You must return valid JSON matching this schema structure exactly. No conversational wrap.

// {
//   "daily_problem_sheet": [
//     {
//       "platform": "Codeforces",
//       "problem_name": "string (e.g. 'Product Triplets' or 'Two Sum')",
//       "url": "string (Provide valid, active canonical web URLs. Double check correctness)",
//       "focus_tag": "string (e.g. 'dp', 'graphs', 'greedy')",
//       "estimated_difficulty": "string"
//     }
//   ],
//   "weak_topic_analysis": "string (2-3 sentences diagnosing user progression limits and priorities)",
//   "weekly_roadmap": [
//     { "day": 1, "topic": "string", "resource_focus": "string" },
//     { "day": 2, "topic": "string", "resource_focus": "string" },
//     { "day": 3, "topic": "string", "resource_focus": "string" },
//     { "day": 4, "topic": "string", "resource_focus": "string" },
//     { "day": 5, "topic": "string", "resource_focus": "string" },
//     { "day": 6, "topic": "Virtual Contest", "resource_focus": "Simulate a full rated contest environment" },
//     { "day": 7, "topic": "Review & Upsolve", "resource_focus": "Analyze solutions for failures met during the week" }
//   ]
// }

// RULES:
// - daily_problem_sheet must contain exactly 7 problems.
// - weekly_roadmap must contain exactly 7 sequential days.`

//     const gRes = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//           generationConfig: { 
//             temperature: 0.4, // Lower temperature means more predictable, accurate canonical links
//             maxOutputTokens: 2048, 
//             responseMimeType: 'application/json' 
//           },
//         }),
//       }
//     )

//   if (!gRes.ok) {
//       const err = await gRes.text()
//       return json({ error: `Gemini server returned error context: ${err}` }, 502)
//     }

//     const gData = await gRes.json()
//     const cleanJSONString = gData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

//     let parsed
//     try { 
//       parsed = JSON.parse(cleanJSONString.trim()) 
//     } catch { 
//       return json({ error: 'Gemini system failed to parse native object map', raw: cleanJSONString }, 502) 
//     }

//     return json(parsed)
//   } catch (e) {
//     return json({ error: String(e) }, 500)
//   }
// })

// function json(d: unknown, status = 200) {
//   return new Response(JSON.stringify(d), {
//     status, headers: { ...CORS, 'Content-Type': 'application/json' },
//   })
// }