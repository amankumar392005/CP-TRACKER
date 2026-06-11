// ─── CODEFORCES ────────────────────────────────────────────────────────────
export const cfProfile = {
  handle: 'tourist',
  rating: 3789, maxRating: 3979,
  rank: 'Legendary Grandmaster', maxRank: 'Legendary Grandmaster',
  country: 'Belarus', organization: 'ITMO University',
  contribution: 163, friendOfCount: 49231,
  totalSolved: 1847, streakDays: 34,
  avatar: '',
};

export const cfRatingHistory = [
  { date: 'Jan', rating: 3650, contest: 'CF Round 900' },
  { date: 'Feb', rating: 3680, contest: 'Edu Round 158' },
  { date: 'Mar', rating: 3720, contest: 'CF Round 910' },
  { date: 'Apr', rating: 3700, contest: 'Global Round 26' },
  { date: 'May', rating: 3750, contest: 'CF Round 920' },
  { date: 'Jun', rating: 3740, contest: 'Edu Round 162' },
  { date: 'Jul', rating: 3760, contest: 'CF Round 930' },
  { date: 'Aug', rating: 3780, contest: 'Global Round 27' },
  { date: 'Sep', rating: 3770, contest: 'CF Round 940' },
  { date: 'Oct', rating: 3789, contest: 'Edu Round 165' },
];

export const cfTags = [
  { tag: 'dp', solved: 412, color: '#3b82f6' },
  { tag: 'graphs', solved: 387, color: '#06b6d4' },
  { tag: 'math', solved: 356, color: '#f59e0b' },
  { tag: 'greedy', solved: 298, color: '#10b981' },
  { tag: 'data structures', solved: 276, color: '#a855f7' },
  { tag: 'strings', solved: 234, color: '#f43f5e' },
  { tag: 'binary search', solved: 198, color: '#fb923c' },
  { tag: 'trees', solved: 176, color: '#34d399' },
  { tag: 'number theory', solved: 145, color: '#60a5fa' },
  { tag: 'geometry', solved: 98, color: '#f472b6' },
];

export const cfDifficulty = [
  { range: '800–1000', count: 234, color: '#6b7280' },
  { range: '1100–1300', count: 312, color: '#06b6d4' },
  { range: '1400–1600', count: 287, color: '#10b981' },
  { range: '1700–1900', count: 198, color: '#f59e0b' },
  { range: '2000–2200', count: 156, color: '#fb923c' },
  { range: '2300–2500', count: 98, color: '#f43f5e' },
  { range: '2600+', count: 45, color: '#a855f7' },
];

export const cfContests = [
  { name: 'CF Round 940', date: 'Mar 15 2024', rank: 3, delta: +19, newRating: 3789, solved: '5/6' },
  { name: 'Edu Round 165', date: 'Feb 28 2024', rank: 1, delta: +20, newRating: 3770, solved: '6/6' },
  { name: 'Global Round 27', date: 'Feb 12 2024', rank: 5, delta: +20, newRating: 3780, solved: '7/7' },
  { name: 'CF Round 930', date: 'Jan 30 2024', rank: 2, delta: +20, newRating: 3760, solved: '6/6' },
  { name: 'Edu Round 162', date: 'Jan 14 2024', rank: 8, delta: -10, newRating: 3740, solved: '5/6' },
  { name: 'CF Round 920', date: 'Jan 02 2024', rank: 4, delta: +10, newRating: 3750, solved: '6/6' },
];

// ─── LEETCODE ──────────────────────────────────────────────────────────────
export const lcProfile = {
  username: 'neal_wu', realName: 'Neal Wu',
  ranking: 42, contestRating: 3823,
  totalSolved: 2847, easySolved: 642, mediumSolved: 1387, hardSolved: 818,
  totalEasy: 803, totalMedium: 1685, totalHard: 712,
  acceptanceRate: 78.4, streak: 342, totalContests: 89,
  globalRanking: 42, topPercentage: 0.001,
};

export const lcRatingHistory = [
  { date: 'Jan', rating: 3680 }, { date: 'Feb', rating: 3700 },
  { date: 'Mar', rating: 3720 }, { date: 'Apr', rating: 3740 },
  { date: 'May', rating: 3760 }, { date: 'Jun', rating: 3780 },
  { date: 'Jul', rating: 3800 }, { date: 'Aug', rating: 3790 },
  { date: 'Sep', rating: 3810 }, { date: 'Oct', rating: 3823 },
];

export const lcTopics = [
  { topic: 'Dynamic Programming', solved: 387, total: 550, color: '#3b82f6' },
  { topic: 'Graph Theory', solved: 298, total: 420, color: '#06b6d4' },
  { topic: 'Trees', solved: 276, total: 380, color: '#10b981' },
  { topic: 'Binary Search', solved: 245, total: 310, color: '#f59e0b' },
  { topic: 'String', solved: 234, total: 350, color: '#a855f7' },
  { topic: 'Math', solved: 198, total: 280, color: '#fb923c' },
  { topic: 'Sliding Window', solved: 167, total: 200, color: '#f43f5e' },
  { topic: 'Backtracking', solved: 143, total: 190, color: '#60a5fa' },
];

export const lcRecentContests = [
  { name: 'Weekly 392', date: 'May 12 2024', rank: 3, rating: 3823, delta: +13 },
  { name: 'Biweekly 130', date: 'May 4 2024', rank: 7, rating: 3810, delta: +20 },
  { name: 'Weekly 389', date: 'Apr 21 2024', rank: 2, rating: 3800, delta: +20 },
  { name: 'Biweekly 128', date: 'Apr 6 2024', rank: 5, rating: 3780, delta: -10 },
  { name: 'Weekly 386', date: 'Mar 24 2024', rank: 1, rating: 3790, delta: +30 },
];

// ─── COMBINED ──────────────────────────────────────────────────────────────
export const combined = {
  totalSolved: 4694, cfSolved: 1847, lcSolved: 2847,
  totalContests: 95, currentStreak: 34, longestStreak: 342,
};

export const weeklyActivity = [
  { day: 'Mon', cf: 4, lc: 3 }, { day: 'Tue', cf: 2, lc: 5 },
  { day: 'Wed', cf: 6, lc: 2 }, { day: 'Thu', cf: 3, lc: 4 },
  { day: 'Fri', cf: 5, lc: 6 }, { day: 'Sat', cf: 8, lc: 7 },
  { day: 'Sun', cf: 7, lc: 5 },
];

export const monthlyProgress = [
  { month: 'Jan', cf: 3650, lc: 3680 }, { month: 'Feb', cf: 3680, lc: 3700 },
  { month: 'Mar', cf: 3720, lc: 3720 }, { month: 'Apr', cf: 3700, lc: 3740 },
  { month: 'May', cf: 3750, lc: 3760 }, { month: 'Jun', cf: 3740, lc: 3780 },
  { month: 'Jul', cf: 3760, lc: 3800 }, { month: 'Aug', cf: 3780, lc: 3790 },
  { month: 'Sep', cf: 3770, lc: 3810 }, { month: 'Oct', cf: 3789, lc: 3823 },
];

export const radarSkills = [
  { skill: 'DP', cf: 90, lc: 85 }, { skill: 'Graphs', cf: 88, lc: 82 },
  { skill: 'Math', cf: 85, lc: 78 }, { skill: 'Greedy', cf: 80, lc: 75 },
  { skill: 'Strings', cf: 75, lc: 88 }, { skill: 'Trees', cf: 82, lc: 86 },
  { skill: 'Binary Search', cf: 78, lc: 90 }, { skill: 'Segment Tree', cf: 70, lc: 60 },
];

// ─── AI COACH ─────────────────────────────────────────────────────────────
export const aiRoadmap = [
  { day: 1, topic: 'Segment Trees', focus: 'Lazy propagation + range updates', problems: 3, time: '2.5h', tag: 'data structures' },
  { day: 2, topic: 'Graph Algorithms', focus: 'Dijkstra, Bellman-Ford, SPFA', problems: 4, time: '3h', tag: 'graphs' },
  { day: 3, topic: 'Dynamic Programming', focus: 'Bitmask DP + Tree DP', problems: 5, time: '3.5h', tag: 'dp' },
  { day: 4, topic: 'Number Theory', focus: 'Modular arithmetic, Euler\'s theorem', problems: 3, time: '2h', tag: 'math' },
  { day: 5, topic: 'String Algorithms', focus: 'KMP, Z-function, Aho-Corasick', problems: 4, time: '3h', tag: 'strings' },
  { day: 6, topic: 'Virtual Contest', focus: 'Codeforces Div 1 simulation', problems: 6, time: '3h', tag: 'contest' },
  { day: 7, topic: 'Review & Upsolve', focus: 'Fix WA, study editorial solutions', problems: 2, time: '1.5h', tag: 'review' },
];

export const aiProblems = [
  { platform: 'CF', name: 'Segment Tree Beats', tag: 'data structures', diff: '2600', url: 'https://codeforces.com/problemset/problem/1515/G', priority: 'high' },
  { platform: 'LC', name: 'Find Median from Data Stream', tag: 'heap', diff: 'Hard', url: 'https://leetcode.com/problems/find-median-from-data-stream/', priority: 'high' },
  { platform: 'CF', name: 'Line Sweep Geometry', tag: 'geometry', diff: '1800', url: 'https://codeforces.com/problemset/problem/598/E', priority: 'medium' },
  { platform: 'LC', name: 'Word Ladder II', tag: 'bfs', diff: 'Hard', url: 'https://leetcode.com/problems/word-ladder-ii/', priority: 'medium' },
  { platform: 'CF', name: 'Nim Variants Game Theory', tag: 'games', diff: '2200', url: 'https://codeforces.com/problemset/problem/850/C', priority: 'low' },
  { platform: 'LC', name: 'Regular Expression Matching', tag: 'dp', diff: 'Hard', url: 'https://leetcode.com/problems/regular-expression-matching/', priority: 'low' },
  { platform: 'CF', name: 'Min Cost Flow Network', tag: 'flows', diff: '2400', url: 'https://codeforces.com/problemset/problem/786/E', priority: 'low' },
];

export const weakTopics = [
  { topic: 'Geometry', solved: 98, avg: 250, gap: 61 },
  { topic: 'Game Theory', solved: 45, avg: 180, gap: 75 },
  { topic: 'FFT / NTT', solved: 23, avg: 120, gap: 81 },
  { topic: 'Network Flows', solved: 56, avg: 200, gap: 72 },
  { topic: 'Heavy-Light Decomp', solved: 34, avg: 150, gap: 77 },
];

// ─── COMPARE ──────────────────────────────────────────────────────────────
export const compareData = {
  u1: { handle: 'tourist', cfRating: 3789, lcRating: 3823, cfSolved: 1847, lcSolved: 2847, contests: 95, streak: 34, color: '#3b82f6' },
  u2: { handle: 'jiangly', cfRating: 3634, lcRating: 3500, cfSolved: 987, lcSolved: 1567, contests: 67, streak: 12, color: '#06b6d4' },
};

export const compareRating = [
  { date: 'Jan', u1: 3700, u2: 3400 }, { date: 'Feb', u1: 3720, u2: 3430 },
  { date: 'Mar', u1: 3740, u2: 3460 }, { date: 'Apr', u1: 3720, u2: 3490 },
  { date: 'May', u1: 3750, u2: 3500 }, { date: 'Jun', u1: 3740, u2: 3520 },
  { date: 'Jul', u1: 3760, u2: 3540 }, { date: 'Aug', u1: 3780, u2: 3560 },
  { date: 'Sep', u1: 3770, u2: 3580 }, { date: 'Oct', u1: 3789, u2: 3634 },
];

export const compareSkills = [
  { skill: 'DP', u1: 90, u2: 82 }, { skill: 'Graphs', u1: 88, u2: 85 },
  { skill: 'Math', u1: 85, u2: 78 }, { skill: 'Greedy', u1: 80, u2: 88 },
  { skill: 'Strings', u1: 75, u2: 70 }, { skill: 'Trees', u1: 82, u2: 79 },
  { skill: 'BS', u1: 78, u2: 85 }, { skill: 'Seg Tree', u1: 70, u2: 72 },
];

// ─── GOALS ────────────────────────────────────────────────────────────────
export const goals = [
  { id: 1, title: 'Reach CF Grandmaster', platform: 'CF', target: 2400, current: 1547, deadline: '2024-12-01', color: '#3b82f6' },
  { id: 2, title: 'Solve 500 LC Medium', platform: 'LC', target: 500, current: 387, deadline: '2024-09-01', color: '#f59e0b' },
  { id: 3, title: 'LC Contest Rating 2000', platform: 'LC', target: 2000, current: 1823, deadline: '2024-12-01', color: '#06b6d4' },
  { id: 4, title: '100 Day Streak', platform: 'BOTH', target: 100, current: 34, deadline: '2024-10-01', color: '#10b981' },
  { id: 5, title: 'CF Expert', platform: 'CF', target: 1600, current: 1547, deadline: '2024-08-01', color: '#a855f7' },
];

export const milestones = [
  { title: 'First AC', date: '2022-01-15', platform: 'LC', done: true },
  { title: 'CF Newbie → Pupil', date: '2022-03-20', platform: 'CF', done: true },
  { title: '100 Problems Solved', date: '2022-06-10', platform: 'BOTH', done: true },
  { title: 'CF Specialist', date: '2022-11-05', platform: 'CF', done: true },
  { title: 'LC 500 Solved', date: '2023-04-18', platform: 'LC', done: true },
  { title: 'CF Expert', date: '2024-08-01', platform: 'CF', done: false },
  { title: 'LC 1000 Solved', date: '2024-10-01', platform: 'LC', done: false },
  { title: 'CF Candidate Master', date: '2025-01-01', platform: 'CF', done: false },
];

// ─── NOTES ────────────────────────────────────────────────────────────────
export const initialNotes = [
  {
    id: '1', title: 'KMP Algorithm Notes', platform: 'CF' as const, tags: ['strings', 'kmp', 'pattern matching'],
    content: 'KMP uses failure function to avoid redundant comparisons.\nfailure[i] = length of longest proper prefix which is also suffix for pattern[0..i].\n\nTime: O(n+m), Space: O(m)\n\nKey insight: when mismatch at j, jump to failure[j-1] instead of restarting.',
    bookmarked: true, createdAt: '2024-03-15', url: '',
  },
  {
    id: '2', title: 'Segment Tree Lazy Template', platform: 'CF' as const, tags: ['segment tree', 'template', 'data structures'],
    content: 'Range update + range query in O(log n).\n\npushdown() must happen before recursing into children.\npushup() after returning from children.\n\nLazy tag represents PENDING operation not yet pushed to children.',
    bookmarked: true, createdAt: '2024-03-10', url: '',
  },
  {
    id: '3', title: 'LC Weekly 389 Notes', platform: 'LC' as const, tags: ['deque', 'dp', 'contest'],
    content: 'Q4: Monotonic deque + DP combo.\ndp[i] = max over window of dp[j] + cost(j,i)\nUse deque to maintain max in O(1) amortized.\n\nPattern: sliding window optimization for DP.',
    bookmarked: false, createdAt: '2024-03-17', url: 'https://leetcode.com/contest/weekly-contest-389/',
  },
  {
    id: '4', title: 'CF Round 940 Upsolve', platform: 'CF' as const, tags: ['tree dp', 'upsolve'],
    content: 'Problem D: Tree DP with rerooting technique.\ndp[v][0/1] = max sum when v is/is not selected.\n\nRerooting: compute answer for root first, then push down.\nTime: O(n), single DFS for rerooting pass.',
    bookmarked: false, createdAt: '2024-03-16', url: 'https://codeforces.com/contest/1940',
  },
];

export const bookmarks = [
  { id: 'b1', name: 'Segment Tree Beats', platform: 'CF', diff: 2600, tags: ['data structures'], solved: false, url: '#' },
  { id: 'b2', name: 'Minimum Window Substring', platform: 'LC', diff: 'Hard', tags: ['sliding window'], solved: true, url: '#' },
  { id: 'b3', name: 'Edit Distance', platform: 'LC', diff: 'Medium', tags: ['dp', 'strings'], solved: true, url: '#' },
  { id: 'b4', name: 'Tenzing and Yak', platform: 'CF', diff: 2800, tags: ['math', 'constructive'], solved: false, url: '#' },
];
