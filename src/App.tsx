import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ThemeExplorer from "./ThemeExplorer";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Filter,
  LineChart,
  MessageSquareText,
  Search,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const industries = ["Property Management", "Hospitality", "Food Delivery", "Automotive"];

const industryData = {
  "Property Management": {
    volume: "42.8K",
    sentiment: 61,
    delta: -8,
    themes: [
      {
        name: "Maintenance Staff",
        sentiment: 42,
        mentions: 12840,
        delta: -18,
        risk: "High",
        subthemes: [
          { name: "Rude behavior", sentiment: 28, mentions: 3120, impact: -22, keywords: ["rude", "dismissive", "unhelpful", "attitude"] },
          { name: "Delayed response", sentiment: 35, mentions: 2850, impact: -18, keywords: ["late", "no show", "follow-up", "waiting"] },
          { name: "Poor communication", sentiment: 39, mentions: 2310, impact: -14, keywords: ["no update", "unclear", "ignored", "callback"] },
          { name: "Issue not fixed", sentiment: 31, mentions: 1980, impact: -19, keywords: ["again", "leak", "broken", "temporary"] },
        ],
      },
      {
        name: "Amenities",
        sentiment: 68,
        mentions: 7420,
        delta: 4,
        risk: "Medium",
        subthemes: [
          { name: "Gym equipment", sentiment: 62, mentions: 1180, impact: -4, keywords: ["old", "repair", "crowded"] },
          { name: "Pool cleanliness", sentiment: 71, mentions: 940, impact: 5, keywords: ["clean", "open", "family"] },
        ],
      },
      {
        name: "Leasing Office",
        sentiment: 73,
        mentions: 6210,
        delta: 7,
        risk: "Low",
        subthemes: [
          { name: "Move-in support", sentiment: 76, mentions: 1820, impact: 8, keywords: ["helpful", "smooth", "responsive"] },
          { name: "Renewal process", sentiment: 66, mentions: 1390, impact: -3, keywords: ["fee", "increase", "notice"] },
        ],
      },
    ],
    timeline: [
      { week: "W1", sentiment: 69, maintenance: 60 },
      { week: "W2", sentiment: 67, maintenance: 54 },
      { week: "W3", sentiment: 65, maintenance: 49 },
      { week: "W4", sentiment: 61, maintenance: 42 },
    ],
    correlation: [
      { driver: "Rude behavior", correlation: 0.82, impact: -22 },
      { driver: "Delayed response", correlation: 0.76, impact: -18 },
      { driver: "Issue not fixed", correlation: 0.71, impact: -19 },
      { driver: "Poor communication", correlation: 0.66, impact: -14 },
    ],
    sample: "The maintenance person finally came after three days, acted annoyed, and the leak still was not fixed.",
  },
  "Food Delivery": {
    volume: "58.3K",
    sentiment: 64,
    delta: -5,
    themes: [
      {
        name: "Food Quality",
        sentiment: 49,
        mentions: 17600,
        delta: -14,
        risk: "High",
        subthemes: [
          { name: "Food temperature", sentiment: 34, mentions: 4680, impact: -21, keywords: ["cold", "lukewarm", "soggy", "reheat"] },
          { name: "Food taste", sentiment: 52, mentions: 3950, impact: -9, keywords: ["bland", "salty", "fresh", "flavor"] },
          { name: "Food portion", sentiment: 46, mentions: 3270, impact: -13, keywords: ["small", "less", "quantity", "portion"] },
          { name: "Order accuracy", sentiment: 38, mentions: 2890, impact: -17, keywords: ["missing", "wrong", "item", "sauce"] },
        ],
      },
      {
        name: "Delivery Experience",
        sentiment: 59,
        mentions: 13200,
        delta: -4,
        risk: "Medium",
        subthemes: [
          { name: "Late delivery", sentiment: 44, mentions: 4710, impact: -15, keywords: ["late", "delay", "tracking"] },
          { name: "Driver behavior", sentiment: 69, mentions: 1660, impact: 2, keywords: ["polite", "call", "drop"] },
        ],
      },
    ],
    timeline: [
      { week: "W1", sentiment: 69, maintenance: 62 },
      { week: "W2", sentiment: 68, maintenance: 58 },
      { week: "W3", sentiment: 65, maintenance: 54 },
      { week: "W4", sentiment: 64, maintenance: 49 },
    ],
    correlation: [
      { driver: "Food temperature", correlation: 0.79, impact: -21 },
      { driver: "Order accuracy", correlation: 0.74, impact: -17 },
      { driver: "Food portion", correlation: 0.68, impact: -13 },
      { driver: "Food taste", correlation: 0.58, impact: -9 },
    ],
    sample: "The burger was cold, fries were soggy, and the portion felt much smaller than usual.",
  },
  Hospitality: {
    volume: "31.5K",
    sentiment: 72,
    delta: 3,
    themes: [
      {
        name: "Front Desk Staff",
        sentiment: 67,
        mentions: 9200,
        delta: -3,
        risk: "Medium",
        subthemes: [
          { name: "Check-in delay", sentiment: 48, mentions: 1840, impact: -12, keywords: ["queue", "wait", "room ready"] },
          { name: "Staff courtesy", sentiment: 74, mentions: 2980, impact: 9, keywords: ["friendly", "helpful", "smile"] },
        ],
      },
      {
        name: "Room Experience",
        sentiment: 69,
        mentions: 11800,
        delta: 2,
        risk: "Medium",
        subthemes: [
          { name: "Cleanliness", sentiment: 71, mentions: 3980, impact: 5, keywords: ["clean", "linen", "bathroom"] },
          { name: "Noise", sentiment: 51, mentions: 1960, impact: -10, keywords: ["loud", "hallway", "traffic"] },
        ],
      },
    ],
    timeline: [
      { week: "W1", sentiment: 69, maintenance: 62 },
      { week: "W2", sentiment: 70, maintenance: 65 },
      { week: "W3", sentiment: 71, maintenance: 66 },
      { week: "W4", sentiment: 72, maintenance: 67 },
    ],
    correlation: [
      { driver: "Check-in delay", correlation: 0.7, impact: -12 },
      { driver: "Noise", correlation: 0.61, impact: -10 },
      { driver: "Staff courtesy", correlation: 0.55, impact: 9 },
      { driver: "Cleanliness", correlation: 0.49, impact: 5 },
    ],
    sample: "The front desk team was nice, but check-in took too long and the hallway was noisy at night.",
  },
  Automotive: {
    volume: "26.9K",
    sentiment: 66,
    delta: -2,
    themes: [
      {
        name: "Service Advisor",
        sentiment: 57,
        mentions: 8100,
        delta: -7,
        risk: "Medium",
        subthemes: [
          { name: "Cost explanation", sentiment: 41, mentions: 2210, impact: -16, keywords: ["estimate", "charge", "unclear"] },
          { name: "Status updates", sentiment: 52, mentions: 1740, impact: -8, keywords: ["update", "callback", "ready"] },
        ],
      },
      {
        name: "Repair Quality",
        sentiment: 62,
        mentions: 6900,
        delta: 1,
        risk: "Medium",
        subthemes: [
          { name: "Repeat visit", sentiment: 45, mentions: 1320, impact: -14, keywords: ["again", "same issue", "fixed"] },
          { name: "Parts availability", sentiment: 58, mentions: 990, impact: -5, keywords: ["parts", "delay", "backorder"] },
        ],
      },
    ],
    timeline: [
      { week: "W1", sentiment: 68, maintenance: 61 },
      { week: "W2", sentiment: 67, maintenance: 58 },
      { week: "W3", sentiment: 66, maintenance: 56 },
      { week: "W4", sentiment: 66, maintenance: 57 },
    ],
    correlation: [
      { driver: "Cost explanation", correlation: 0.77, impact: -16 },
      { driver: "Repeat visit", correlation: 0.69, impact: -14 },
      { driver: "Status updates", correlation: 0.63, impact: -8 },
      { driver: "Parts availability", correlation: 0.48, impact: -5 },
    ],
    sample: "The repair worked, but the advisor never explained the extra charge clearly.",
  },
};

function cls(...items: (string | boolean | undefined)[]) {
  return items.filter(Boolean).join(" ");
}

const mockReviews = [
  {
    date: "Apr 23, 2026",
    location: "The Presidio Apartments (6620)",
    rating: 2,
    sentiment: "Negative",
    oldSentiment: "—",
    topic: "Move-Out Cleaning...",
    review: "Had agreed with presidio on a move out and key drop off date but AFTER we had they disagreed on the date and had to pay extra for the days we did not live there. Before move out, inspector came and said our carpets were clean and we would get our security deposit back. Last minute we were charged and did not get our security deposit back.",
    highlights: ["our carpets", "were clean"]
  },
  {
    date: "Apr 2, 2026",
    location: "Avida (2665)",
    rating: 2,
    sentiment: "Negative",
    oldSentiment: "—",
    topic: "Other",
    review: "I recently just moved out of Avida and would like to say my experience has multiple mixed emotions. 1. For starters yes the leasing office does have really nice people. I will not say anything bad about them. The amenities are pretty good for what it offers. I love the fact that there were food trucks on site every now and then. team was always willing to help with anything broken. They were very attentive. 2. When it comes to the unit you get, everything is like everyone says it is paper thin everything is super cheaply made. There's nothing they could really do about that. The damage is already done, but they don't disclose that to you. You will hear your upstairs neighbors if you're not on the top floor, which I highly recommend you get..."
  },
  {
    date: "Mar 28, 2026",
    location: "Skyline Apartments (3921)",
    rating: 1,
    sentiment: "Negative",
    oldSentiment: "Mixed",
    topic: "Maintenance Staff",
    review: "Maintenance was once a great place to live has become increasingly chaotic. The amenity areas are frequently overcrowded with large groups of guests, and many long-term tenants who pay premium rents ($4,000–$7,000+) no longer feel comfortable using these shared spaces due to ongoing disruptive behavior. Last night both the lobby and second floor appeared to be the scene of a serious incident, with tons of visible blood throughout the area following what appeared to be an altercation. Situations like this are alarming and deeply concerning for residents. There also appears to be a lack of consistent front desk staffing. The doormen change frequently, and guest management and enforcement of building rules seem inconsistent. Disorderly behavior often goes unchecked, which contributes to an overall sense that the building is not being properly supervised..."
  }
];

function ReviewTable({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Reviews (26)</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-y border-neutral-200 py-3 text-body-s">
        {["Date", "Location", "Rating", "Sentiment", "Hard Disagreement", "Topic"].map((filter) => (
          <button key={filter} className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-bold text-neutral-700 shadow-sm hover:bg-neutral-100">
            {filter} <ChevronDown className="h-4 w-4 text-neutral-400" />
          </button>
        ))}
      </div>

      <div className="flex gap-2 text-xs font-mono">
        <span className="rounded bg-sky-100 px-2 py-0.5 text-sky-700">aspect</span>
        <span className="rounded bg-rose-100 px-2 py-0.5 text-rose-700">opinion</span>
      </div>

      <p className="text-body-s italic text-neutral-500">
        Does this category belong on this review? Vote with 👍 / 👎.
      </p>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-body-s">
          <thead className="bg-neutral-100 text-body-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Sentiment</th>
              <th className="px-4 py-3">Old Sentiment</th>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3 w-1/3">Review</th>
              <th className="px-4 py-3 text-center">Vote</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {mockReviews.map((item, idx) => (
              <tr key={idx} className="hover:bg-neutral-100 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-neutral-600 font-bold">{item.date}</td>
                <td className="px-4 py-4 text-neutral-900 font-bold">{item.location}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cls("h-3 w-3", i < item.rating ? "fill-current" : "text-neutral-200 fill-neutral-200")} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={cls(
                    "rounded-full px-2 py-0.5 text-body-xs font-bold uppercase tracking-tighter",
                    item.sentiment === "Negative" ? "bg-error-500/10 text-error-500" : "bg-success-500/10 text-success-500"
                  )}>
                    {item.sentiment}
                  </span>
                </td>
                <td className="px-4 py-4 text-neutral-400 text-center">{item.oldSentiment}</td>
                <td className="px-4 py-4">
                  <span className="rounded bg-brand-800/10 px-2 py-1 text-body-xs font-bold text-brand-800">
                    {item.topic}
                  </span>
                </td>
                <td className="px-4 py-4 text-neutral-700 leading-relaxed text-body-xs">
                  {item.review}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-3 text-neutral-300">
                    <button className="hover:text-success-500 transition-colors"><ThumbsUp className="h-4 w-4" /></button>
                    <button className="hover:text-error-500 transition-colors"><ThumbsDown className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-100 px-4 py-3">
          <span className="text-body-xs font-bold text-neutral-400 uppercase tracking-wider">Page 1 of 3</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 rounded text-body-xs font-bold uppercase">PREVIOUS</Button>
            <Button variant="outline" size="sm" className="h-8 rounded text-body-xs font-bold uppercase">NEXT</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SentimentPill({ value }: { value: number }) {
  const label = value >= 70 ? "Positive" : value >= 50 ? "Mixed" : "Negative";
  return (
    <span className={cls("rounded-full px-3 py-1 text-body-xs font-bold uppercase tracking-wider", value >= 70 ? "bg-success-500/10 text-success-500" : value >= 50 ? "bg-warning-500/10 text-warning-500" : "bg-error-500/10 text-error-500")}>{label}</span>
  );
}

function MetricCard({ title, value, delta, icon: Icon }: { title: string, value: string, delta: number, icon: any }) {
  const up = delta >= 0;
  return (
    <Card className="rounded-2xl border-0 shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="rounded-2xl bg-neutral-100 p-3"><Icon className="h-5 w-5 text-neutral-700" /></div>
          <div className={cls("flex items-center gap-1 text-body-s font-bold", up ? "text-success-500" : "text-error-500")}>
            {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}{Math.abs(delta)} pts
          </div>
        </div>
        <p className="mt-4 text-body-m font-medium text-neutral-500">{title}</p>
        <p className="mt-1 text-h1 font-bold tracking-tight text-neutral-950">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function SentimentInsightDashboard() {
  const [activeTab, setActiveTab] = useState('insights');
  const [viewMode, setViewMode] = useState<'main' | 'reviews'>('main');
  const [selectedSubtheme, setSelectedSubtheme] = useState(0);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [industry, setIndustry] = useState("Property Management");
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedJourneyStage, setSelectedJourneyStage] = useState(0);
  const [journeyDetailTab, setJourneyDetailTab] = useState('locations');

  // @ts-ignore
  const data = industryData[industry];
  const theme = data.themes[selectedTheme] || data.themes[0];
  const subtheme = theme.subthemes[selectedSubtheme] || theme.subthemes[0];
  const keyword = selectedKeyword || subtheme?.keywords?.[0];

  const representativeReviews: Record<string, { sentiment: string, text: string }[]> = {
    rude: [
      { sentiment: 'Negative', text: 'The maintenance technician was dismissive and acted annoyed when I explained the issue.' },
      { sentiment: 'Negative', text: 'Very rude interaction. Felt like my complaint was a burden.' }
    ],
    dismissive: [
      { sentiment: 'Negative', text: 'Staff dismissed the concern and left without explaining anything.' }
    ],
    late: [
      { sentiment: 'Negative', text: 'Maintenance arrived three days late and never updated me.' }
    ],
    cold: [
      { sentiment: 'Negative', text: 'The pizza arrived cold and tasted stale.' },
      { sentiment: 'Negative', text: 'Food was cold by the time it reached us.' }
    ],
    soggy: [
      { sentiment: 'Negative', text: 'Fries were soggy and the burger felt reheated.' }
    ],
    friendly: [
      { sentiment: 'Positive', text: 'Front desk staff greeted us warmly and were incredibly helpful.' }
    ],
    estimate: [
      { sentiment: 'Negative', text: 'The service advisor added charges without clearly explaining the estimate.' }
    ]
  };

  const visibleSubthemes = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return theme.subthemes;
    return theme.subthemes.filter((s: any) =>
      [s.name, ...s.keywords].join(' ').toLowerCase().includes(term)
    );
  }, [query, theme]);

  const reviews = representativeReviews[keyword as string] || [
    { sentiment: 'Mixed', text: `Representative feedback for keyword '${keyword}' will appear here.` }
  ];

  const journeyStages = [
    { stage: 'Pre-Arrival', score: 48, mentions: 1481, change: 7, topDriver: 'Appointments', negative: 288, neutral: 22, positive: 312 },
    { stage: 'Arrival', score: 70, mentions: 1833, change: 4, topDriver: 'Friendliness', negative: 92, neutral: 144, positive: 512 },
    { stage: 'Assessment', score: 60, mentions: 2135, change: 2, topDriver: 'Service Staff', negative: 175, neutral: 155, positive: 200 },
    { stage: 'Work Done', score: 52, mentions: 2881, change: -3, topDriver: 'Repair Work', negative: 619, neutral: 183, positive: 312 },
    { stage: 'Payment', score: 44, mentions: 1334, change: -8, topDriver: 'Price', negative: 375, neutral: 110, positive: 123 },
    { stage: 'Post Visit', score: 73, mentions: 2906, change: 9, topDriver: 'Likelihood to Return', negative: 88, neutral: 130, positive: 680 },
  ];

  const selectedStage = journeyStages[selectedJourneyStage];
  const journeyCategories = [
    { name: 'Overall experience', level: 0, all: 530, negative: 175, neutral: 155, positive: 200, score: 52, change: 5 },
    { name: 'Appointments', level: 1, all: 281, negative: 102, neutral: 97, positive: 82, score: 46, change: 6 },
    { name: 'Speed', level: 1, all: 104, negative: 21, neutral: 28, positive: 55, score: 66, change: -2 },
    { name: 'Overall experience - General', level: 1, all: 74, negative: 13, neutral: 12, positive: 49, score: 74, change: 0 },
    { name: 'Wait time', level: 1, all: 48, negative: 31, neutral: 12, positive: 5, score: 23, change: 9 },
    { name: 'Communication', level: 0, all: 113, negative: 74, neutral: 30, positive: 9, score: 21, change: 2 },
    { name: 'Staff Behavior', level: 0, all: 174, negative: 46, neutral: 25, positive: 103, score: 66, change: 14 },
  ];

  const journeyTrend = [
    { month: 'May 25', positive: 4, neutral: 0, negative: 0, sentiment: 100 },
    { month: 'Jun 25', positive: 6, neutral: 2, negative: 5, sentiment: 55 },
    { month: 'Jul 25', positive: 3, neutral: 7, negative: 1, sentiment: 60 },
    { month: 'Aug 25', positive: 7, neutral: 4, negative: 3, sentiment: 65 },
    { month: 'Sep 25', positive: 8, neutral: 0, negative: 1, sentiment: 90 },
    { month: 'Oct 25', positive: 3, neutral: 2, negative: 1, sentiment: 63 },
    { month: 'Nov 25', positive: 1, neutral: 1, negative: 1, sentiment: 50 },
    { month: 'Dec 25', positive: 5, neutral: 3, negative: 2, sentiment: 66 },
    { month: 'Jan 26', positive: 3, neutral: 3, negative: 1, sentiment: 65 },
    { month: 'Feb 26', positive: 4, neutral: 1, negative: 1, sentiment: 82 },
    { month: 'Mar 26', positive: 5, neutral: 1, negative: 0, sentiment: 91 },
    { month: 'Apr 26', positive: 5, neutral: 3, negative: 5, sentiment: 50 },
  ];

  const locationData = [
    { location: 'Amarillo', positive: 2, neutral: 0, negative: 0, sentiment: 100 },
    { location: 'Austin', positive: 5, neutral: 1, negative: 0, sentiment: 88 },
    { location: 'Gilbert', positive: 7, neutral: 1, negative: 1, sentiment: 84 },
    { location: 'Mesa', positive: 2, neutral: 1, negative: 1, sentiment: 66 },
    { location: 'Omaha', positive: 2, neutral: 2, negative: 3, sentiment: 43 },
    { location: 'Greenville', positive: 2, neutral: 1, negative: 3, sentiment: 41 },
    { location: 'Peoria', positive: 1, neutral: 3, negative: 5, sentiment: 28 },
  ];

  const journeyQuotes = [
    'Scheduling the appointment took too long and nobody called me back.',
    'The service was good once I arrived, but getting the appointment was frustrating.',
    'I had to follow up twice before anyone confirmed the time.',
  ];

  const wordCloud = ['appointment', 'service', 'quick', 'wait', 'schedule', 'callback', 'repair', 'communication', 'advisor', 'online', 'friendly', 'time', 'update', 'price', 'follow up', 'confirm', 'staff', 'professional'];

  const strengthWeaknessRows = data.themes.flatMap((t: any) => [
    {
      type: 'Theme',
      name: t.name,
      sentiment: t.sentiment,
      mentions: t.mentions,
      reviewImpact: Math.round((t.sentiment - data.sentiment) * 0.18),
      npsImpact: Math.round((t.sentiment - data.sentiment) * 0.26),
    },
    ...t.subthemes.map((s: any) => ({
      type: 'Sub-theme',
      name: `${t.name} / ${s.name}`,
      sentiment: s.sentiment,
      mentions: s.mentions,
      reviewImpact: Math.round(s.impact * 0.15),
      npsImpact: Math.round(s.impact * 0.22),
    })),
  ]);

  const strengths = strengthWeaknessRows
    .filter((row: any) => row.reviewImpact > 0 || row.npsImpact > 0)
    .sort((a: any, b: any) => b.reviewImpact + b.npsImpact - (a.reviewImpact + a.npsImpact))
    .slice(0, 4);

  const weaknesses = strengthWeaknessRows
    .filter((row: any) => row.reviewImpact < 0 || row.npsImpact < 0)
    .sort((a: any, b: any) => a.reviewImpact + a.npsImpact - (b.reviewImpact + b.npsImpact))
    .slice(0, 4);

  const locationLeaderboard: Record<string, any> = {
    'Property Management': {
      groupings: ['Location', 'Region', 'Property Brand', 'Management Group'],
      rows: [
        { name: 'Parkview Residences', group: 'West', overall: 78, 'Maintenance Staff / Rude behavior': 42, 'Maintenance Staff / Delayed response': 38, 'Amenities / Pool cleanliness': 86, 'Leasing Office / Move-in support': 91 },
        { name: 'Maple Heights', group: 'South', overall: 72, 'Maintenance Staff / Rude behavior': 31, 'Maintenance Staff / Delayed response': 44, 'Amenities / Pool cleanliness': 81, 'Leasing Office / Move-in support': 84 },
        { name: 'Skyline Apartments', group: 'East', overall: 69, 'Maintenance Staff / Rude behavior': 28, 'Maintenance Staff / Delayed response': 29, 'Amenities / Pool cleanliness': 77, 'Leasing Office / Move-in support': 73 },
      ]
    },
    'Food Delivery': {
      groupings: ['Location', 'Region', 'Restaurant Brand', 'Delivery Zone'],
      rows: [
        { name: 'Chicago Central', group: 'Midwest', overall: 74, 'Food Quality / Food temperature': 48, 'Food Quality / Food taste': 71, 'Food Quality / Food portion': 58, 'Delivery Experience / Late delivery': 53 },
        { name: 'Dallas North', group: 'South', overall: 69, 'Food Quality / Food temperature': 35, 'Food Quality / Food taste': 63, 'Food Quality / Food portion': 47, 'Delivery Experience / Late delivery': 42 },
        { name: 'San Jose West', group: 'West', overall: 79, 'Food Quality / Food temperature': 62, 'Food Quality / Food taste': 75, 'Food Quality / Food portion': 66, 'Delivery Experience / Late delivery': 71 },
      ]
    },
    Hospitality: {
      groupings: ['Location', 'Region', 'Hotel Brand', 'Property Type'],
      rows: [
        { name: 'Hilton Downtown', group: 'West', overall: 84, 'Front Desk Staff / Check-in delay': 61, 'Front Desk Staff / Staff courtesy': 89, 'Room Experience / Cleanliness': 92, 'Room Experience / Noise': 58 },
        { name: 'City Suites Austin', group: 'South', overall: 79, 'Front Desk Staff / Check-in delay': 44, 'Front Desk Staff / Staff courtesy': 86, 'Room Experience / Cleanliness': 81, 'Room Experience / Noise': 51 },
        { name: 'Bay Resort Miami', group: 'East', overall: 87, 'Front Desk Staff / Check-in delay': 67, 'Front Desk Staff / Staff courtesy': 91, 'Room Experience / Cleanliness': 93, 'Room Experience / Noise': 63 },
      ]
    },
    Automotive: {
      groupings: ['Location', 'Region', 'Brand', 'Dealer Group'],
      rows: [
        { name: 'Reputation Automotive Amarillo 14', group: 'West', overall: 94, 'Service Advisor / Cost explanation': 84, 'Service Advisor / Status updates': 87, 'Repair Quality / Repeat visit': 82, 'Repair Quality / Parts availability': 88 },
        { name: 'Reputation Automotive Austin 178', group: 'South', overall: 90, 'Service Advisor / Cost explanation': 76, 'Service Advisor / Status updates': 81, 'Repair Quality / Repeat visit': 71, 'Repair Quality / Parts availability': 84 },
        { name: 'Reputation Automotive Mesa 186', group: 'West', overall: 91, 'Service Advisor / Cost explanation': 80, 'Service Advisor / Status updates': 85, 'Repair Quality / Repeat visit': 77, 'Repair Quality / Parts availability': 82 },
      ]
    }
  };

  const leaderboardData = locationLeaderboard[industry];
  const leaderboardColumns = [...new Set(data.themes.flatMap((t: any) => t.subthemes.map((s: any) => `${t.name} / ${s.name}`)))];

  if (viewMode === 'reviews') {
    return (
      <div className="min-h-screen bg-neutral-100 p-6 text-neutral-950">
        <div className="mx-auto max-w-[1600px]">
          <ReviewTable onBack={() => setViewMode('main')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-6 text-neutral-900">
      <div className="mx-auto max-w-[1600px] space-y-6">

        <div className="flex items-center gap-2 rounded-3xl bg-white p-2 shadow-sm w-fit border border-neutral-200">
          <button
            onClick={() => setActiveTab('insights')}
            className={cls(
              'rounded-2xl px-5 py-2 text-body-s font-medium transition',
              activeTab === 'insights'
                ? 'bg-brand-950 text-white'
                : 'text-neutral-500 hover:bg-neutral-100'
            )}
          >
            Sentiment Insights
          </button>

          <button
            onClick={() => setActiveTab('journey')}
            className={cls(
              'rounded-2xl px-5 py-2 text-body-s font-medium transition',
              activeTab === 'journey'
                ? 'bg-brand-950 text-white'
                : 'text-neutral-500 hover:bg-neutral-100'
            )}
          >
            Journey Analytics
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={cls(
              'rounded-2xl px-5 py-2 text-body-s font-medium transition',
              activeTab === 'explorer'
                ? 'bg-brand-950 text-white'
                : 'text-neutral-500 hover:bg-neutral-100'
            )}
          >
            Theme Explorer
          </button>
        </div>

        {activeTab === 'journey' && (
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-neutral-200 bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-h1 font-bold tracking-tight">Journey Insights</h2>
                    <p className="mt-1 text-body-m text-neutral-500">Automotive journey example with stage-level sentiment, categories, trends, word cloud, and quotes.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <select className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-body-s font-bold text-neutral-700 outline-none"><option>Service</option><option>Sales</option></select>
                    <select className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-body-s font-bold text-neutral-700 outline-none"><option>Last year</option><option>Last quarter</option></select>
                    <select className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-body-s font-bold text-neutral-700 outline-none"><option>Show Categories</option><option>Show Themes</option></select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto bg-neutral-100 p-6">
                <div className="flex min-w-[1300px] gap-5">
                  {journeyStages.map((step, idx) => (
                    <button key={step.stage} onClick={() => setSelectedJourneyStage(idx)} className={cls('min-w-[205px] flex-1 rounded-3xl border bg-white p-5 text-left shadow-sm transition-all hover:shadow-md', selectedJourneyStage === idx ? 'border-brand-900 ring-2 ring-brand-900/10' : 'border-neutral-200 hover:border-brand-800')}>
                      <p className="text-body-xs font-bold uppercase tracking-wide text-neutral-400">Journey Stage {idx + 1}</p>
                      <h3 className="mt-2 text-h4 font-bold text-brand-950">{step.stage}</h3>
                      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 text-center">
                        <p className="font-bold text-body-m">{step.stage}</p>
                        <p className="text-body-s text-neutral-600 font-medium">{step.mentions.toLocaleString()} Mentions</p>
                        <p className="text-body-s text-neutral-600 font-medium">Sentiment: {step.score}/100</p>
                      </div>
                      <div className="mt-4 rounded-2xl bg-neutral-100 p-3">
                        <p className="text-body-xs font-bold uppercase text-neutral-400">Top category</p>
                        <p className="font-bold text-body-s text-neutral-900">{step.topDriver}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="mb-2 text-body-s font-bold text-brand-800">Journey Insights / Service / {selectedStage.stage}</p>
                  <h2 className="text-h1 font-bold tracking-tight text-neutral-900">{selectedStage.stage}</h2>
                </div>
                <Button variant="outline" className="rounded-full">•••</Button>
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h3 className="text-h4 font-bold text-neutral-600">Sentiment</h3>
                  <div className="mt-6 flex items-end gap-3"><p className="text-5xl font-bold text-neutral-950">{selectedStage.score}/100</p><p className={cls('pb-2 text-body-s font-bold', selectedStage.change >= 0 ? 'text-success-500' : 'text-error-500')}>{selectedStage.change >= 0 ? '↑' : '↓'} {Math.abs(selectedStage.change)}</p></div>
                  <p className="mt-1 text-body-xs font-medium text-neutral-400 uppercase tracking-wider">From previous period</p>
                  <div className="mt-8 space-y-4">
                    {[['Positive', selectedStage.positive, 'bg-success-500'], ['Neutral', selectedStage.neutral, 'bg-warning-500'], ['Negative', selectedStage.negative, 'bg-error-500']].map(([label, val, color]) => (
                      <div key={label as string} className="grid grid-cols-[80px_1fr_80px] items-center gap-3 text-body-s font-bold uppercase tracking-wider">
                        <span className="text-neutral-500">{label as string}</span><div className="h-3 rounded-full bg-neutral-100"><div className={cls('h-3 rounded-full', color as string)} style={{ width: `${Math.min(100, ((val as number) / Math.max(selectedStage.positive, selectedStage.neutral, selectedStage.negative)) * 100)}%` }} /></div><span className="text-neutral-900">{val as number}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <h3 className="text-lg font-semibold">Feedback by Source</h3>
                  <div className="mt-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ source: 'Google', positive: 260, neutral: 22, negative: 196 }, { source: 'DealerRater', positive: 35, neutral: 5, negative: 13 }, { source: 'Cars.com', positive: 20, neutral: 4, negative: 10 }, { source: 'Carfax', positive: 21, neutral: 3, negative: 9 }, { source: 'Facebook', positive: 5, neutral: 1, negative: 5 }, { source: 'Edmunds', positive: 4, neutral: 2, negative: 4 }]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="source" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="negative" stackId="a" name="Negative" fill="#f43f5e" />
                        <Bar dataKey="neutral" stackId="a" name="Neutral" fill="#fbbf24" />
                        <Bar dataKey="positive" stackId="a" name="Positive" fill="#34d399" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h3 className="text-h4 font-bold text-neutral-600">Domains and Categories for {selectedStage.stage}</h3>
                <div className="flex gap-3">
                  <select className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-body-s font-bold text-neutral-700 outline-none">
                    <option>Most Mentions</option>
                    <option>Lowest Sentiment</option>
                  </select>
                  <Input placeholder="Search" className="w-56 rounded-2xl h-10 border-neutral-200" />
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-neutral-200">
                <table className="w-full text-body-s">
                  <thead className="bg-neutral-100 text-neutral-500 font-bold border-b border-neutral-200">
                    <tr>
                      <th className="p-4 text-left uppercase tracking-wider">Category Name</th>
                      <th className="text-center">All</th>
                      <th className="text-center">Negative</th>
                      <th className="text-center">Neutral</th>
                      <th className="text-center">Positive</th>
                      <th className="text-center">Score</th>
                      <th className="text-center">Change</th>
                      <th className="p-4 text-left uppercase tracking-wider">Current Period Breakdown</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {journeyCategories.map((row) => (
                      <tr key={row.name} className="border-t border-neutral-200 bg-white hover:bg-neutral-100 transition-colors">
                        <td className={cls('p-4 font-bold text-brand-800', row.level === 1 && 'pl-10')}>
                          {row.level === 0 ? '▸ ' : ''}{row.name}
                        </td>
                        <td className="text-center font-bold">{row.all}</td>
                        <td className="text-center text-error-500 font-bold">{row.negative}</td>
                        <td className="text-center text-warning-500 font-bold">{row.neutral}</td>
                        <td className="text-center text-success-500 font-bold">{row.positive}</td>
                        <td className="text-center font-bold text-neutral-900">{row.score}/100</td>
                        <td className={cls('text-center font-bold', row.change >= 0 ? 'text-success-500' : 'text-error-500')}>
                          {row.change > 0 ? '↑' : row.change < 0 ? '↓' : '='} {Math.abs(row.change)}
                        </td>
                        <td className="p-4">
                          <div className="flex h-5 max-w-md overflow-hidden rounded-full bg-neutral-100">
                            <div className="bg-error-500" style={{ width: `${row.negative / row.all * 100}%` }} />
                            <div className="bg-warning-500" style={{ width: `${row.neutral / row.all * 100}%` }} />
                            <div className="bg-success-500" style={{ width: `${row.positive / row.all * 100}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-h1 font-bold tracking-tight text-neutral-900">Overall experience: Speed</h2>
                  <p className="mt-2 text-body-s text-neutral-500">Detailed category analytics from the selected journey stage.</p>
                </div>
                <div className="flex gap-3">
                  <select className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-body-s font-bold text-neutral-700 outline-none">
                    <option>All Sentiments</option>
                    <option>Negative</option>
                    <option>Positive</option>
                  </select>
                  <Button variant="outline" className="rounded-full">•••</Button>
                </div>
              </div>
              <div className="mb-6 flex gap-6 border-b border-neutral-200">
                {[['locations', 'Locations'], ['trend', 'Sentiment Trend'], ['cloud', 'Word Cloud']].map(([id, label]) => (
                  <button 
                    key={id} 
                    onClick={() => setJourneyDetailTab(id)} 
                    className={cls('pb-3 text-body-s font-bold uppercase tracking-wider', journeyDetailTab === id ? 'border-b-2 border-brand-800 text-brand-800' : 'text-neutral-400 hover:text-neutral-600')}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {journeyDetailTab === 'locations' && <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={locationData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" /><XAxis dataKey="location" tick={{ fontSize: 10, fontWeight: 700 }} /><YAxis tick={{ fontSize: 10, fontWeight: 700 }} /><Tooltip /><Bar dataKey="negative" stackId="a" name="Negative" fill="var(--color-error-500)" /><Bar dataKey="neutral" stackId="a" name="Neutral" fill="var(--color-warning-500)" /><Bar dataKey="positive" stackId="a" name="Positive" fill="var(--color-success-500)" /><Line type="monotone" dataKey="sentiment" name="Category Sentiment" stroke="var(--color-brand-800)" strokeWidth={3} /></BarChart></ResponsiveContainer></div>}

              {journeyDetailTab === 'trend' && <div className="h-80"><ResponsiveContainer width="100%" height="100%"><ReLineChart data={journeyTrend}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" /><XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700 }} /><YAxis tick={{ fontSize: 10, fontWeight: 700 }} /><Tooltip /><Line type="monotone" dataKey="sentiment" name="Category Sentiment" stroke="var(--color-brand-800)" strokeWidth={3} /><Line type="monotone" dataKey="positive" name="Positive Volume" stroke="var(--color-success-500)" strokeWidth={2} /><Line type="monotone" dataKey="negative" name="Negative Volume" stroke="var(--color-error-500)" strokeWidth={2} /></ReLineChart></ResponsiveContainer></div>}

              {journeyDetailTab === 'cloud' && <div className="rounded-3xl bg-neutral-100 p-8"><div className="flex min-h-[260px] flex-wrap items-center justify-center gap-x-5 gap-y-3">{wordCloud.map((word, idx) => <button key={word} className={cls('font-bold transition-transform hover:scale-110', idx < 3 ? 'text-h1 text-success-500' : idx < 8 ? 'text-h4 text-brand-800' : idx % 3 === 0 ? 'text-body-m text-error-500' : 'text-body-m text-warning-500')}>{word}</button>)}</div></div>}

              <div className="mt-8">
                <h3 className="mb-3 text-h4 font-bold text-neutral-900">Customer Quotes</h3>
                <div className="grid gap-3 lg:grid-cols-3">{journeyQuotes.map((quote) => <div key={quote} className="rounded-2xl border border-neutral-200 bg-white p-4 text-body-s leading-6 text-neutral-700 shadow-sm transition-all hover:shadow-md hover:border-brand-800">“{quote}”</div>)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'explorer' && <ThemeExplorer />}

      {activeTab === 'insights' && (
      <>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-3xl bg-brand-950 p-6 text-white shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-body-s text-neutral-100">
              <Sparkles className="h-4 w-4" /> Insight-driven sentiment analysis
            </div>
            <h1 className="text-h1 font-bold tracking-tight">Theme, sub-theme, correlation & keyword analysis</h1>
            <p className="mt-2 max-w-3xl text-body-m leading-6 text-neutral-200">
              Connect what customers feel with the exact operational drivers behind sentiment shifts across industries.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {industries.map((item) => (
              <Button key={item} onClick={() => { setIndustry(item); setSelectedTheme(0); setQuery(""); }} variant="secondary" className={cls("rounded-full", item === industry ? "bg-white text-brand-950" : "bg-white/10 text-white hover:bg-white/20")}>{item}</Button>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Overall sentiment" value={`${data.sentiment}/100`} delta={data.delta} icon={LineChart} />
          <MetricCard title="Feedback volume" value={data.volume} delta={6} icon={MessageSquareText} />
          <MetricCard title="Primary risk theme" value={theme.name} delta={theme.delta} icon={AlertTriangle} />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-3xl border-0 shadow-sm lg:col-span-4 transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-h4 font-bold text-neutral-600">Theme explorer</h2>
                  <p className="text-body-s text-neutral-400">Ranked by sentiment risk and mention volume.</p>
                </div>
                <Filter className="h-5 w-5 text-neutral-300" />
              </div>
              <div className="space-y-3">
                {data.themes.map((t: any, index: number) => (
                  <button key={t.name} onClick={() => setSelectedTheme(index)} className={cls("w-full rounded-2xl border p-4 text-left transition", index === selectedTheme ? "border-brand-950 bg-brand-950 text-white shadow-lg" : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm")}> 
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-body-m">{t.name}</p>
                      </div>
                      <ChevronRight className="h-5 w-5" />
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-neutral-200/50">
                      <div className={cls("h-2 rounded-full transition-all duration-1000", t.sentiment >= 70 ? "bg-success-500" : t.sentiment >= 50 ? "bg-warning-500" : "bg-error-500")} style={{ width: `${t.sentiment}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-body-xs font-bold uppercase tracking-wider">
                      <span className="opacity-80">Sentiment {t.sentiment}%</span>
                      <span>{t.delta > 0 ? "+" : ""}{t.delta} pts</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm lg:col-span-8">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3"><h2 className="text-h4 font-bold text-neutral-900">{theme.name}</h2><SentimentPill value={theme.sentiment} /></div>
                  <p className="mt-1 text-body-s text-neutral-500 font-bold uppercase tracking-tight">Sub-themes explain why the theme sentiment moved.</p>
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sub-theme or keyword" className="rounded-full border-neutral-200 bg-neutral-100 pl-9 h-10 text-body-s outline-none focus:bg-white transition-all" />
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-12">
                <div className="lg:col-span-4 space-y-3">
                  <div>
                    <p className="mb-2 text-body-xs font-bold text-neutral-400 uppercase tracking-widest">1. Choose sub-theme</p>
                    {visibleSubthemes.map((s: any, idx: number) => (
                      <button
                        key={s.name}
                        onClick={() => {
                          setSelectedSubtheme(idx);
                          setSelectedKeyword(s.keywords?.[0]);
                        }}
                        className={cls(
                          'mb-2 w-full rounded-2xl border p-4 text-left transition-all',
                          subtheme?.name === s.name
                            ? 'border-brand-950 bg-brand-950 text-white shadow-lg'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        )}
                      >
                        <p className="font-bold text-body-m">{s.name}</p>
                        <p className="mt-1 text-body-xs font-bold uppercase tracking-tighter opacity-70">impact {s.impact} pts</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <p className="mb-2 text-body-xs font-bold text-neutral-400 uppercase tracking-widest">2. Explore keywords</p>
                  <div className="flex flex-wrap gap-2 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 min-h-[220px] content-start">
                    {subtheme?.keywords?.map((k: string) => (
                      <button
                        key={k}
                        onClick={() => setSelectedKeyword(k)}
                        className={cls(
                          'rounded-full px-4 py-2 text-body-s font-bold transition-all shadow-sm',
                          keyword === k
                            ? 'bg-neutral-950 text-white scale-105'
                            : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
                        )}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <p className="mb-2 text-body-xs font-bold text-neutral-400 uppercase tracking-widest">3. Representative reviews</p>
                  <div 
                    onClick={() => setViewMode('reviews')}
                    className="group cursor-pointer space-y-3 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 min-h-[220px] transition-all hover:border-brand-300 hover:bg-white hover:shadow-md"
                  >
                    {reviews.map((review, idx) => (
                      <div key={idx} className="rounded-2xl bg-white p-4 shadow-sm border border-neutral-100 transition-all group-hover:scale-[1.02]">
                        <div className="mb-2 flex items-center justify-between">
                          <span className={cls(
                            'rounded-full px-3 py-1 text-body-xs font-bold uppercase tracking-wider',
                            review.sentiment === 'Positive'
                              ? 'bg-success-500/10 text-success-500'
                              : review.sentiment === 'Negative'
                              ? 'bg-error-500/10 text-error-500'
                              : 'bg-warning-500/10 text-warning-500'
                          )}>
                            {review.sentiment}
                          </span>
                          <span className="text-body-xs font-bold text-neutral-400 uppercase tracking-tight">Keyword: {keyword}</span>
                        </div>
                        <p className="text-body-s font-medium leading-relaxed text-neutral-700">“{review.text}”</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-3xl border-0 shadow-sm lg:col-span-7">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div><h2 className="text-h4 font-bold text-neutral-900">Sentiment movement</h2><p className="text-body-s text-neutral-500 uppercase font-bold tracking-tight">Overall vs selected theme trend.</p></div>
                <BarChart3 className="h-5 w-5 text-neutral-400" />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={data.timeline} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" />
                    <YAxis domain={[20, 90]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sentiment" name="Overall sentiment" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="maintenance" name={theme.name} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm lg:col-span-5 transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="mb-4"><h2 className="text-h4 font-bold text-neutral-900">Correlation drivers</h2><p className="text-body-s text-neutral-500 font-bold uppercase tracking-tight">Which sub-themes strongly explain sentiment decline.</p></div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.correlation} layout="vertical" margin={{ top: 4, right: 20, left: 32, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5E5" />
                    <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis dataKey="driver" type="category" width={110} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip />
                    <Bar dataKey="correlation" name="Correlation strength" fill="var(--color-neutral-400)" radius={[0, 10, 10, 0]}>
                      {data.correlation.map((entry: any) => <Cell key={entry.driver} fill={entry.correlation > 0.7 ? 'var(--color-neutral-900)' : 'var(--color-neutral-400)'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-0 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-h4 font-bold text-neutral-900">Strengths & Weaknesses</h2>
                <p className="text-body-s text-neutral-500 font-bold uppercase tracking-tight">Estimated impact of each theme and sub-theme on overall review rating and survey NPS rating.</p>
              </div>
              <div className="rounded-full bg-neutral-100 px-4 py-2 text-body-xs font-bold text-neutral-600 uppercase tracking-widest">
                Impact model: sentiment × mentions × correlation
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-success-100 bg-success-500/5 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-success-700">Strengths lifting ratings</h3>
                    <p className="text-body-s text-success-600 font-bold uppercase tracking-tight">Themes/sub-themes creating positive rating and NPS lift.</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-success-500" />
                </div>
                <div className="space-y-3">
                  {(strengths.length ? strengths : strengthWeaknessRows.filter((row: any) => row.sentiment >= data.sentiment).slice(0, 4)).map((row: any) => (
                    <div key={`strength-${row.name}`} className="rounded-2xl bg-white p-4 shadow-sm border border-success-500/10">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-body-xs font-bold uppercase tracking-wide text-success-500">{row.type}</p>
                          <p className="mt-1 font-bold text-neutral-950">{row.name}</p>
                          <p className="mt-1 text-body-xs font-bold text-neutral-400 uppercase tracking-tight">{row.mentions.toLocaleString()} mentions · sentiment {row.sentiment}/100</p>
                        </div>
                        <SentimentPill value={row.sentiment} />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl bg-success-500/5 p-3">
                          <p className="text-body-xs font-bold uppercase tracking-tight text-success-600">Review rating impact</p>
                          <p className="mt-1 text-h4 font-bold text-success-700">+{Math.abs(row.reviewImpact || 1)} pts</p>
                        </div>
                        <div className="rounded-2xl bg-success-500/5 p-3">
                          <p className="text-body-xs font-bold uppercase tracking-tight text-success-600">Survey NPS impact</p>
                          <p className="mt-1 text-h4 font-bold text-success-700">+{Math.abs(row.npsImpact || 2)} pts</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-error-100 bg-error-500/5 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-error-700">Weaknesses dragging ratings</h3>
                    <p className="text-body-s text-error-600 font-bold uppercase tracking-tight">Themes/sub-themes with the highest negative review and NPS impact.</p>
                  </div>
                  <TrendingDown className="h-5 w-5 text-error-500" />
                </div>
                <div className="space-y-3">
                  {weaknesses.map((row) => (
                    <div key={`weakness-${row.name}`} className="rounded-2xl bg-white p-4 shadow-sm border border-error-500/10">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-body-xs font-bold uppercase tracking-wide text-error-500">{row.type}</p>
                          <p className="mt-1 font-bold text-neutral-950">{row.name}</p>
                          <p className="mt-1 text-body-xs font-bold text-neutral-400 uppercase tracking-tight">{row.mentions.toLocaleString()} mentions · sentiment {row.sentiment}/100</p>
                        </div>
                        <SentimentPill value={row.sentiment} />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl bg-error-500/5 p-3">
                          <p className="text-body-xs font-bold uppercase tracking-tight text-error-600">Review rating impact</p>
                          <p className="mt-1 text-h4 font-bold text-error-700">{row.reviewImpact} pts</p>
                        </div>
                        <div className="rounded-2xl bg-error-500/5 p-3">
                          <p className="text-body-xs font-bold uppercase tracking-tight text-error-600">Survey NPS impact</p>
                          <p className="mt-1 text-h4 font-bold text-error-700">{row.npsImpact} pts</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-h4 font-bold text-neutral-900">Location Leaderboard</h2>
                <p className="text-body-s text-neutral-500 font-bold uppercase tracking-tight">Compare sentiment by location across sub-themes, grouped by theme and organizational hierarchy.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <select className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-body-s font-bold text-neutral-700 outline-none">
                  {leaderboardData.groupings.map((group: string) => <option key={group}>{`Group by: ${group}`}</option>)}
                </select>
                <Input placeholder="Search location" className="w-56 rounded-2xl border-neutral-200 h-10 text-body-s" />
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-[1400px] w-full text-body-s">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-100 font-bold text-neutral-500 uppercase tracking-widest text-body-xs">
                      <th rowSpan={2} className="sticky left-0 z-20 bg-neutral-100 p-4 text-left">Rank</th>
                      <th rowSpan={2} className="sticky left-[72px] z-20 bg-neutral-100 p-4 text-left">Location</th>
                      <th rowSpan={2} className="p-4 text-left">Overall Sentiment</th>
                      {data.themes.map((theme: any) => (
                        <th key={theme.name} colSpan={theme.subthemes.length} className="border-l border-neutral-200 p-4 text-center text-neutral-700">
                          {theme.name}
                        </th>
                      ))}
                    </tr>
                    <tr className="border-b border-neutral-200 bg-neutral-100 text-[10px] text-neutral-400 font-bold uppercase tracking-tight">
                      {data.themes.flatMap((theme: any) =>
                        theme.subthemes.map((sub: any) => (
                          <th key={`${theme.name}-${sub.name}`} className="border-l border-neutral-200 p-3 text-center">
                            {sub.name}
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.rows.map((row: any, index: number) => (
                      <tr key={row.name} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                        <td className="sticky left-0 z-10 bg-white p-4 text-center font-bold text-neutral-400">{index + 1}</td>
                        <td className="sticky left-[72px] z-10 bg-white p-4 font-bold text-neutral-900 border-r border-neutral-100">
                          <div>
                            <p>{row.name}</p>
                            <p className="text-body-xs font-bold uppercase tracking-tight text-neutral-400">{row.group}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="inline-flex min-w-[70px] items-center gap-2 rounded-xl bg-success-500/10 px-3 py-2 font-bold text-success-500">
                            <div className="h-8 w-1 rounded-full bg-success-500" />
                            {row.overall}
                          </div>
                        </td>
                        {leaderboardColumns.map((col: any) => {
                          const val = row[col] || 0;
                          return (
                            <td key={`${row.name}-${col}`} className="p-4 text-center border-l border-neutral-100">
                              <div className={cls(
                                'mx-auto inline-flex min-w-[74px] items-center gap-2 rounded-xl px-3 py-2 font-bold',
                                val >= 75 ? 'bg-success-500/10 text-success-500' : val >= 55 ? 'bg-warning-500/10 text-warning-500' : 'bg-error-500/10 text-error-500'
                              )}>
                                <div className={cls(
                                  'h-8 w-1 rounded-full',
                                  val >= 75 ? 'bg-success-500' : val >= 55 ? 'bg-warning-500' : 'bg-error-500'
                                )} />
                                {val}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

      </>
      )}
      </div>
    </div>
  );
}
