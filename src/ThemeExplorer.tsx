import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Filter,
  GitMerge,
  Layers3,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const topicData = [
  {
    id: "service",
    title: "Customer Service & Support",
    confidence: 94,
    volume: 486,
    trend: "+18%",
    sentiment: "Mostly negative",
    subtopics: [
      {
        title: "Long wait times",
        volume: 142,
        phrases: ["on hold too long", "waited 45 minutes", "no callback", "support queue"],
      },
      {
        title: "Agent resolution quality",
        volume: 111,
        phrases: ["agent could not help", "unresolved issue", "kept transferring me", "wrong information"],
      },
      {
        title: "Cancellation friction",
        volume: 89,
        phrases: ["hard to cancel", "retention call", "kept charging", "cancel my service"],
      },
    ],
  },
  {
    id: "pickup",
    title: "Pickup Reliability",
    confidence: 91,
    volume: 392,
    trend: "+9%",
    sentiment: "Negative",
    subtopics: [
      {
        title: "Missed pickup",
        volume: 188,
        phrases: ["trash not picked up", "missed collection", "still on curb", "driver skipped us"],
      },
      {
        title: "Schedule confusion",
        volume: 77,
        phrases: ["holiday schedule", "wrong pickup day", "no notification", "schedule changed"],
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Pricing",
    confidence: 88,
    volume: 351,
    trend: "+24%",
    sentiment: "Mixed",
    subtopics: [
      {
        title: "Unexpected price increases",
        volume: 137,
        phrases: ["bill went up", "fuel surcharge", "fees increased", "too expensive"],
      },
      {
        title: "Payment and invoice clarity",
        volume: 83,
        phrases: ["unclear invoice", "charged twice", "autopay issue", "billing mistake"],
      },
    ],
  },
];

const generatedTopicData = [
  ...topicData,
  {
    id: "digital",
    title: "Digital Self-Service Gaps",
    confidence: 84,
    volume: 218,
    trend: "+31%",
    sentiment: "Mixed",
    subtopics: [
      {
        title: "Portal and login issues",
        volume: 96,
        phrases: ["cannot log in", "portal error", "password reset", "account access"],
      },
      {
        title: "App support limitations",
        volume: 64,
        phrases: ["app did not update", "no chat option", "mobile app issue", "could not submit request"],
      },
    ],
  },
];

const suggestedTopics = [
  { title: "Digital self-service gaps", reason: "Rising mentions of portal, app, chat, and account login", volume: 118 },
  { title: "Communication before service changes", reason: "Customers mention missed alerts before schedule or pricing changes", volume: 96 },
  { title: "Competitor price comparison", reason: "Feedback increasingly references cheaper alternatives", volume: 73 },
];

const comments = [
  "I was on hold for 40 minutes trying to cancel and still did not get a confirmation email.",
  "Our trash was not picked up again this week. The bin has been on the curb since Monday.",
  "The new invoice has multiple fees I do not understand, and the total is much higher than last month.",
];

const customerDataSources = [
  {
    id: "reviews",
    label: "Reviews",
    description: "App store, Google, marketplace, product, or location reviews",
    count: "1,420 comments",
  },
  {
    id: "surveys",
    label: "Survey comments",
    description: "NPS, CSAT, CES, post-purchase, and relationship survey verbatims",
    count: "980 comments",
  },
  {
    id: "social",
    label: "Social data",
    description: "Public social posts, brand mentions, DMs, and community comments",
    count: "440 comments",
  },
];

function Pill({ children, tone = "default" }: { children: React.ReactNode, tone?: string }) {
  const tones: Record<string, string> = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-rose-50 text-rose-700 border-rose-100",
  };
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tones[tone] || tones.default}`}>{children}</span>;
}

function Metric({ label, value, helper }: { label: string, value: string | number, helper: string }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{helper}</p>
      </CardContent>
    </Card>
  );
}

function ActionDrawer({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="fixed right-6 top-6 z-50 w-[420px] max-w-[calc(100vw-48px)] rounded-3xl border bg-white p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Guided workflow</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950">{title}</h3>
        </div>
        <button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:text-slate-900"><X className="h-4 w-4" /></button>
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

export default function ThemeExplorer() {
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<any>(null);
  const [phrases, setPhrases] = useState<string[]>([]);
  const [customPhrase, setCustomPhrase] = useState("");
  const [workflow, setWorkflow] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newSubtopicName, setNewSubtopicName] = useState("");
  const [newSubtopicSeed, setNewSubtopicSeed] = useState("");
  const [selectedDataSource, setSelectedDataSource] = useState(customerDataSources[0]);
  const [isDataSourceOpen, setIsDataSourceOpen] = useState(false);
  const [hasGeneratedThemes, setHasGeneratedThemes] = useState(false);


  const chooseTopic = (topic: any) => {
    if (selectedTopic?.id === topic.id) {
      setSelectedTopic(null);
      setSelectedSubtopic(null);
      setPhrases([]);
      return;
    }
    const firstSubtopic = topic.subtopics?.[0] || { title: "Uncategorized", volume: 0, phrases: [] };
    setSelectedTopic(topic);
    setSelectedSubtopic(firstSubtopic);
    setPhrases(firstSubtopic.phrases || []);
  };

  const chooseSubtopic = (subtopic: any) => {
    setSelectedSubtopic(subtopic);
    setPhrases(subtopic.phrases || []);
  };

  const updateSelectedSubtopicPhrases = (nextPhrases: string[]) => {
    if (!selectedTopic || !selectedSubtopic) return;
    const updatedSubtopic = { ...selectedSubtopic, phrases: nextPhrases };
    const updatedTopic = {
      ...selectedTopic,
      subtopics: (selectedTopic?.subtopics || []).map((subtopic: any) =>
        subtopic.title === selectedSubtopic.title ? updatedSubtopic : subtopic
      ),
    };
    setPhrases(nextPhrases);
    setSelectedSubtopic(updatedSubtopic);
    setSelectedTopic(updatedTopic);
    setTopics(topics.map((topic) => (topic.id === selectedTopic?.id ? updatedTopic : topic)));
  };

  const addPhrase = () => {
    if (!customPhrase.trim()) {
      setWorkflow("addPhrase");
      return;
    }
    const nextPhrases = Array.from(new Set([...phrases, customPhrase.trim()]));
    updateSelectedSubtopicPhrases(nextPhrases);
    setCustomPhrase("");
    setWorkflow("phraseAdded");
  };

  const removePhrase = (phraseToRemove: string) => {
    updateSelectedSubtopicPhrases(phrases.filter((phrase) => phrase !== phraseToRemove));
  };

  const generateThemes = () => {
    setHasGeneratedThemes(false);
    setWorkflow("generate");
    setIsGenerating(true);
    setTimeout(() => {
      const nextTopics = generatedTopicData;
      const newTopic = nextTopics.find((topic) => topic.id === "digital") || nextTopics[0];
      const firstSubtopic = newTopic.subtopics?.[0] || { title: "Uncategorized", volume: 0, phrases: [] };
      setHasGeneratedThemes(true);
      setTopics(nextTopics);
      setSelectedTopic(newTopic);
      setSelectedSubtopic(firstSubtopic);
      setPhrases(firstSubtopic.phrases || []);
      setIsGenerating(false);
      setWorkflow("generated");
    }, 900);
  };

  const addSubtopic = () => {
    setWorkflow("addSubtopic");
  };

  const saveSubtopic = () => {
    if (!selectedTopic) return;
    const title = newSubtopicName.trim() || "New customer-created subtopic";
    const seedPhrases = newSubtopicSeed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const newSubtopic = {
      title,
      volume: 0,
      phrases: seedPhrases.length ? seedPhrases : ["sample phrase", "customer mention"],
    };
    const updatedTopic = { ...selectedTopic, subtopics: [...(selectedTopic?.subtopics || []), newSubtopic] };
    const updatedTopics = topics.map((topic) => (topic.id === selectedTopic?.id ? updatedTopic : topic));
    setTopics(updatedTopics);
    setSelectedTopic(updatedTopic);
    setSelectedSubtopic(newSubtopic);
    setPhrases(newSubtopic.phrases);
    setNewSubtopicName("");
    setNewSubtopicSeed("");
    setWorkflow("subtopicAdded");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {workflow === "addSubtopic" && (
        <ActionDrawer title="Add a subtopic" onClose={() => setWorkflow(null)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Create a focused child theme under <strong>{selectedTopic?.title || "selected topic"}</strong>. Use this when AI found a broad topic but the CX team needs a more actionable breakdown.</p>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Subtopic name</span>
              <input value={newSubtopicName} onChange={(e) => setNewSubtopicName(e.target.value)} placeholder="e.g. Missed callbacks" className="mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Seed phrases</span>
              <textarea value={newSubtopicSeed} onChange={(e) => setNewSubtopicSeed(e.target.value)} placeholder="callback never came, no one followed up, promised a call" className="mt-2 h-24 w-full rounded-2xl border bg-white px-4 py-3 text-sm" />
              <p className="mt-1 text-xs text-slate-500">Separate phrases with commas. These will map future comments to this subtopic.</p>
            </label>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Workflow</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>Name the business issue clearly.</li>
                <li>Add phrases customers actually use.</li>
                <li>Review matched evidence comments after saving.</li>
              </ol>
            </div>
            <Button onClick={saveSubtopic} className="h-11 w-full rounded-2xl"><Plus className="mr-2 h-4 w-4" /> Save subtopic</Button>
          </div>
        </ActionDrawer>
      )}
      {workflow === "subtopicAdded" && (
        <ActionDrawer title="Subtopic added" onClose={() => setWorkflow(null)}>
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">The new subtopic is now selected. Add more phrases, validate comments, or elevate it to a main topic if it becomes strategically important.</div>
            <Button onClick={() => setWorkflow("addPhrase")} className="h-11 w-full rounded-2xl"><Plus className="mr-2 h-4 w-4" /> Add phrases now</Button>
          </div>
        </ActionDrawer>
      )}
      {workflow === "addPhrase" && (
        <ActionDrawer title="Add phrases to a subtopic" onClose={() => setWorkflow(null)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Phrases are the matching rules that connect raw customer comments to <strong>{selectedSubtopic?.title || "selected subtopic"}</strong>. Add exact language customers use, not internal labels.</p>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">What the user does</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>Review current phrases and evidence comments.</li>
                <li>Type a new phrase such as “no one called me back”.</li>
                <li>Click Add phrase to include it in future tagging.</li>
                <li>Remove noisy phrases by clicking the × on a phrase chip.</li>
              </ol>
            </div>
            <div className="rounded-2xl border bg-white p-4">
              <p className="text-sm font-medium text-slate-900">Suggested phrases from nearby comments</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["no one followed up", "support never responded", "could not reach anyone", "agent promised callback"].map((phrase) => (
                  <button key={phrase} onClick={() => setCustomPhrase(phrase)} className="rounded-full border bg-white px-3 py-2 text-sm hover:bg-blue-50">{phrase}</button>
                ))}
              </div>
            </div>
          </div>
        </ActionDrawer>
      )}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Pill tone="blue"><Sparkles className="mr-1 h-3 w-3" /> AI theme exploration</Pill>
              <Pill>Works across industries</Pill>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Customer feedback theme workspace</h1>
            <p className="mt-3 max-w-3xl text-base text-slate-600">
              Select reviews, survey comments, tickets, chats, or call notes from a specific period. Generate themes on demand, then curate the topic taxonomy before publishing it to dashboards and CX workflows.
            </p>
          </div>
        </motion.div>

        

        <div className="mb-6 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Pill tone="blue"><Filter className="mr-1 h-3 w-3" /> Feedback scope</Pill>
              </div>
              <h2 className="text-lg font-semibold text-slate-950">Filter customer feedback before generating themes</h2>
              <p className="mt-1 text-sm text-slate-500">Choose the data source, date range, and volume of customer feedback to analyze.</p>
            </div>
            <Button onClick={generateThemes} className="h-12 rounded-2xl px-6 shadow-sm bg-[#090909] hover:bg-[#090909]/90 text-white" disabled={isGenerating}>
              <Wand2 className="mr-2 h-4 w-4" /> {isGenerating ? "Generating..." : "Generate themes"}
            </Button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-slate-700">Customer data source</label>
              <button
                onClick={() => setIsDataSourceOpen(!isDataSourceOpen)}
                className="flex w-full items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:border-slate-300 hover:bg-white"
              >
                <div>
                  <p className="font-medium text-slate-950">{selectedDataSource.label}</p>
                  <p className="text-xs text-slate-500">{selectedDataSource.count}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition ${isDataSourceOpen ? "rotate-180" : ""}`} />
              </button>

              {isDataSourceOpen && (
                <div className="absolute z-20 mt-2 w-full rounded-[24px] border border-slate-200 bg-white p-2 shadow-xl">
                  {customerDataSources.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => {
                        setSelectedDataSource(source);
                        setIsDataSourceOpen(false);
                      }}
                      className={`mb-2 w-full rounded-[18px] border px-4 py-4 text-left transition last:mb-0 ${selectedDataSource.id === source.id ? "border-blue-300 bg-blue-50" : "border-transparent hover:bg-slate-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-950">{source.label}</p>
                        {selectedDataSource.id === source.id && <Check className="h-4 w-4 text-blue-600" />}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{source.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">From date</label>
              <div className="flex items-center rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                <CalendarDays className="mr-3 h-4 w-4 text-slate-400" /> Apr 15
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">To date</label>
              <div className="flex items-center rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                <CalendarDays className="mr-3 h-4 w-4 text-slate-400" /> Jul 14
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Feedback volume</label>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                Latest 3,000 comments
              </div>
            </div>
          </div>
          {hasGeneratedThemes && (
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <Metric label="Feedback selected" value={selectedDataSource.count.split(" ")[0]} helper={selectedDataSource.label} />
              <Metric label="Date range" value="90 days" helper="Apr 15 – Jul 14" />
              <Metric label="Themes found" value={topics.length} helper={`${suggestedTopics.length} suggested themes`} />
            </div>
          )}

          {hasGeneratedThemes && (
            <Card className="mt-6 rounded-3xl border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold"><Sparkles className="h-5 w-5" /> Trending suggestions</h2>
                    <p className="mt-1 text-sm text-slate-500">AI suggests topics that are growing but not yet in your taxonomy.</p>
                  </div>
                  <Pill tone="amber">{suggestedTopics.length} suggestions</Pill>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {suggestedTopics.map((item) => (
                    <div key={item.title} className="rounded-[28px] border border-amber-100 bg-amber-50/60 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-950">{item.title}</p>
                          <p className="mt-2 text-sm text-slate-600">{item.reason}</p>
                        </div>
                        <Pill tone="amber">{item.volume}</Pill>
                      </div>
                      <Button variant="outline" className="mt-5 rounded-2xl bg-white shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Add topic
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {!hasGeneratedThemes ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[36px] border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <Sparkles className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-slate-950">Ready to generate themes</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
              Start by choosing the customer data source, date range, and feedback volume above. When you click <strong>Generate themes</strong>, the system will populate scorecards, suggested themes, subthemes, phrases, and evidence comments.
            </p>
            </motion.div>
        ) : (
        <div className="space-y-6">
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-semibold"><Layers3 className="h-5 w-5" /> Generated topic taxonomy</h2>
                    <p className="mt-1 text-sm text-slate-500">Review, rename, merge, elevate, or remove topics before publishing.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-2xl"><GitMerge className="mr-2 h-4 w-4" /> Merge selected</Button>
                    <Button variant="outline" className="rounded-2xl"><Plus className="mr-2 h-4 w-4" /> New topic</Button>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {topics.map((topic) => {
                    const isExpanded = selectedTopic?.id === topic.id;
                    
                    return (
                      <div 
                        key={topic.id} 
                        className={`overflow-hidden rounded-[32px] border transition-all duration-300 ${
                          isExpanded 
                            ? "border-blue-300 bg-white shadow-lg ring-2 ring-blue-100" 
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <button
                          onClick={() => chooseTopic(topic)}
                          className={`flex w-full items-center justify-between p-6 text-left transition-colors ${
                            isExpanded ? "bg-slate-50/50" : "hover:bg-slate-50/30"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors bg-[#d8dadd] text-[#0a0a0a]`}>
                              <Layers3 className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-[#090909]">{topic.title}</p>
                              <p className="text-sm text-slate-500">{topic.volume} comments · {topic.subtopics.length} subthemes</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="hidden items-center gap-6 md:flex">
                              <div className="text-right">
                                <p className="text-sm font-semibold text-slate-950">{topic.volume}</p>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400">Volume</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-semibold ${topic.trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>
                                  {topic.trend}
                                </p>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400">Trend</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-slate-950">{topic.sentiment}</p>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400">Sentiment</p>
                              </div>
                            </div>
                            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                          </div>
                        </button>

                        <motion.div
                          initial={false}
                          animate={{ 
                            height: isExpanded ? "auto" : 0,
                            opacity: isExpanded ? 1 : 0
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 bg-white p-6">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
                              {/* Subtopics List */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Subthemes</p>
                                  <Button onClick={(e) => { e.stopPropagation(); addSubtopic(); }} variant="outline" size="sm" className="h-8 rounded-xl bg-white shadow-sm">
                                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
                                  </Button>
                                </div>
                                
                                <div className="space-y-2">
                                  {topic.subtopics.map((sub: any) => {
                                    const isSubSelected = selectedSubtopic?.title === sub.title && isExpanded;
                                    return (
                                      <button
                                        key={sub.title}
                                        onClick={() => chooseSubtopic(sub)}
                                        className={`group w-full rounded-2xl border p-4 text-left transition-all ${
                                          isSubSelected 
                                            ? "border-blue-300 bg-blue-50/50 shadow-sm" 
                                            : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <p className={`font-medium transition-colors ${isSubSelected ? "text-blue-700" : "text-slate-900"}`}>
                                            {sub.title}
                                          </p>
                                          <div className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                                            isSubSelected ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500 group-hover:bg-slate-100"
                                          }`}>
                                            {sub.volume} docs
                                          </div>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                          {sub.phrases.slice(0, 3).map((phrase: string) => (
                                            <span key={phrase} className="rounded-lg bg-white/60 px-2 py-0.5 text-[10px] text-slate-500 border border-slate-100">
                                              {phrase}
                                            </span>
                                          ))}
                                          {sub.phrases.length > 3 && (
                                            <span className="rounded-lg px-2 py-0.5 text-[10px] text-slate-400">
                                              +{sub.phrases.length - 3}
                                            </span>
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Selected Subtopic Detail Editor */}
                              <div className="rounded-[28px] border border-slate-100 bg-slate-50/30 p-6">
                                {selectedSubtopic && isExpanded ? (
                                  <div className="space-y-6">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <div className="h-2 w-2 rounded-full bg-[#040404] animate-pulse" />
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#030303]">Theme Editor</p>
                                        </div>
                                        <input
                                          className="mt-2 w-full border-none bg-transparent p-0 text-2xl font-bold text-slate-900 focus:outline-none focus:ring-0"
                                          value={selectedSubtopic.title}
                                          readOnly
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 bg-[#e7e9ed] text-[#090909] border-none">
                                          <div className="flex items-center">
                                            <div className="flex items-center">
                                              <Layers3 className="mr-1.5 h-3.5 w-3.5" /> Elevate
                                            </div>
                                          </div>
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 bg-white">
                                          <GitMerge className="mr-1.5 h-3.5 w-3.5" /> Merge
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                      <div className="flex items-center justify-between mb-4">
                                        <div>
                                          <p className="font-semibold text-slate-900">Matching Phrases</p>
                                          <p className="text-xs text-slate-500 text-balance">Keywords that categorize comments into this theme</p>
                                        </div>
                                        <Pill tone="blue">{phrases.length}</Pill>
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-2 mb-4">
                                        {phrases.map((phrase) => (
                                          <button
                                            key={phrase}
                                            onClick={() => removePhrase(phrase)}
                                            className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                          >
                                            {phrase}
                                            <X className="ml-1.5 h-3 w-3 opacity-40" />
                                          </button>
                                        ))}
                                      </div>

                                      <div className="flex gap-2">
                                        <input
                                          value={customPhrase}
                                          onFocus={() => setWorkflow("addPhrase")}
                                          onChange={(e) => setCustomPhrase(e.target.value)}
                                          placeholder="Add phrase..."
                                          className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:border-blue-300 focus:bg-white focus:outline-none transition-all"
                                        />
                                        <Button onClick={addPhrase} size="sm" className="h-10 rounded-xl px-4 bg-[#040404] hover:bg-[#040404]/90 text-white border-none">
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
                                      <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                                          <Trash2 className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-slate-900">Archive Topic</p>
                                          <p className="text-xs text-slate-500">Remove from taxonomy</p>
                                        </div>
                                      </div>
                                      <Button variant="outline" size="sm" className="rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200">
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                                    <div className="rounded-full bg-slate-100 p-4 mb-4">
                                      <Layers3 className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">Select a subtopic</p>
                                    <p className="text-xs text-slate-500 mt-1">Pick a subtheme on the left to edit its rules</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

              </CardContent>
            </Card>

            <div>
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <h2 className="flex items-center gap-2 text-lg font-semibold"><MessageSquareText className="h-5 w-5" /> Evidence comments</h2>
                  <p className="mt-1 text-sm text-slate-500">Use real customer text to validate and refine each theme.</p>
                  <div className="mt-4 space-y-3">
                    {comments.map((comment, idx) => (
                      <div key={idx} className="rounded-2xl border bg-white p-4 text-sm leading-6 text-slate-700">
                        “{comment}”
                        <div className="mt-3 flex gap-2"><Pill tone="red">Negative</Pill><Pill>Matched to {selectedSubtopic?.title || "selected subtopic"}</Pill></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card></div>
          </div>
        )}
      </div>
    </div>
  );
}
