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
    default: "bg-neutral-100 text-neutral-500 border-neutral-200",
    blue: "bg-info-500/10 text-info-500 border-info-500/20",
    green: "bg-success-500/10 text-success-500 border-success-500/20",
    amber: "bg-warning-500/10 text-warning-500 border-warning-500/20",
    red: "bg-error-500/10 text-error-500 border-error-500/20",
  };
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-body-xs font-bold uppercase tracking-wider ${tones[tone] || tones.default}`}>{children}</span>;
}

function Metric({ label, value, helper }: { label: string, value: string | number, helper: string }) {
  return (
    <Card className="rounded-2xl border-neutral-200 shadow-sm">
      <CardContent className="p-5">
        <p className="text-body-s font-medium text-neutral-500">{label}</p>
        <p className="mt-2 text-h1 font-bold text-neutral-900">{value}</p>
        <p className="mt-1 text-body-xs text-neutral-400">{helper}</p>
      </CardContent>
    </Card>
  );
}

function ActionDrawer({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="fixed right-6 top-6 z-50 w-[420px] max-w-[calc(100vw-48px)] rounded-3xl border bg-white p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-body-xs font-bold uppercase tracking-widest text-brand-800">Guided workflow</p>
          <h3 className="mt-1 text-h4 font-bold text-neutral-950">{title}</h3>
        </div>
        <button onClick={onClose} className="rounded-full bg-neutral-100 p-2 text-neutral-500 hover:text-neutral-900 transition-colors"><X className="h-4 w-4" /></button>
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
  const [newTopicName, setNewTopicName] = useState("");
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

  const saveTopic = () => {
    const title = newTopicName.trim() || "New Topic";
    const newTopic = {
      id: `topic-${Date.now()}`,
      title,
      confidence: 100,
      volume: 0,
      trend: "+0%",
      sentiment: "Neutral",
      subtopics: [],
    };
    setTopics([...topics, newTopic]);
    setNewTopicName("");
    setSelectedTopic(newTopic);
    setWorkflow(null);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {workflow === "addSubtopic" && (
        <ActionDrawer title="Add a subtopic" onClose={() => setWorkflow(null)}>
          <div className="space-y-4">
            <p className="text-body-m font-medium text-neutral-600">Create a focused child theme under <strong>{selectedTopic?.title || "selected topic"}</strong>. Use this when AI found a broad topic but the CX team needs a more actionable breakdown.</p>
            <label className="block">
              <span className="text-body-xs font-bold text-neutral-400 uppercase tracking-widest">Subtopic name</span>
              <input value={newSubtopicName} onChange={(e) => setNewSubtopicName(e.target.value)} placeholder="e.g. Missed callbacks" className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-body-s font-bold text-neutral-700 outline-none focus:border-brand-800 transition-all" />
            </label>
            <label className="block">
              <span className="text-body-xs font-bold text-neutral-400 uppercase tracking-widest">Seed phrases</span>
              <textarea value={newSubtopicSeed} onChange={(e) => setNewSubtopicSeed(e.target.value)} placeholder="callback never came, no one followed up, promised a call" className="mt-2 h-24 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-body-s font-bold text-neutral-700 outline-none focus:border-brand-800 transition-all" />
              <p className="mt-1 text-body-xs font-bold text-neutral-400 uppercase tracking-tight">Separate phrases with commas. These will map future comments to this subtopic.</p>
            </label>
            <div className="rounded-2xl bg-neutral-100 p-4 text-body-s text-neutral-600 border border-neutral-200">
              <p className="font-bold text-neutral-900 uppercase tracking-tight">Workflow</p>
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
      {workflow === "addTopic" && (
        <ActionDrawer title="Add a main topic" onClose={() => setWorkflow(null)}>
          <div className="space-y-4">
            <p className="text-body-m font-medium text-neutral-600">Create a new top-level category for your feedback taxonomy. Topics represent major business areas like Billing, Logistics, or Product Quality.</p>
            <label className="block">
              <span className="text-body-xs font-bold text-neutral-400 uppercase tracking-widest">Topic title</span>
              <input value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} placeholder="e.g. Mobile Experience" className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-body-s font-bold text-neutral-700 outline-none focus:border-brand-800 transition-all" />
            </label>
            <div className="rounded-2xl bg-neutral-100 p-4 text-body-s text-neutral-600 border border-neutral-200 shadow-sm">
              <p className="font-bold text-neutral-900 uppercase tracking-tight">Next steps</p>
              <p className="mt-2">After creating this topic, you can add subtopics and mapping phrases to start categorizing feedback.</p>
            </div>
            <Button onClick={saveTopic} className="h-11 w-full rounded-2xl"><Check className="mr-2 h-4 w-4" /> Create topic</Button>
          </div>
        </ActionDrawer>
      )}
      {workflow === "subtopicAdded" && (
        <ActionDrawer title="Subtopic added" onClose={() => setWorkflow(null)}>
          <div className="space-y-4">
            <div className="rounded-2xl border border-success-500/20 bg-success-500/10 p-4 text-body-s font-bold text-success-700 uppercase tracking-tight shadow-sm">The new subtopic is now selected. Add more phrases, validate comments, or elevate it to a main topic if it becomes strategically important.</div>
            <Button onClick={() => setWorkflow("addPhrase")} className="h-11 w-full rounded-2xl"><Plus className="mr-2 h-4 w-4" /> Add phrases now</Button>
          </div>
        </ActionDrawer>
      )}
      {workflow === "addPhrase" && (
        <ActionDrawer title="Add phrases to a subtopic" onClose={() => setWorkflow(null)}>
          <div className="space-y-4">
            <p className="text-body-m font-medium text-neutral-600">Phrases are the matching rules that connect raw customer comments to <strong>{selectedSubtopic?.title || "selected subtopic"}</strong>. Add exact language customers use, not internal labels.</p>
            <div className="rounded-2xl bg-neutral-100 p-4 text-body-s text-neutral-600 border border-neutral-200 shadow-sm">
              <p className="font-bold text-neutral-900 uppercase tracking-tight">What the user does</p>
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
            <h1 className="text-h1 font-bold tracking-tight text-neutral-950">Customer feedback theme workspace</h1>
            <p className="mt-3 max-w-3xl text-body-l text-neutral-600">
              Select reviews, survey comments, tickets, chats, or call notes from a specific period. Generate themes on demand, then curate the topic taxonomy before publishing it to dashboards and CX workflows.
            </p>
          </div>
        </motion.div>

        

        <div className="mb-6 rounded-[32px] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Pill tone="blue"><Filter className="mr-1 h-3 w-3" /> Feedback scope</Pill>
              </div>
              <h2 className="text-h4 font-bold text-neutral-950">Filter customer feedback before generating themes</h2>
              <p className="mt-1 text-body-s text-neutral-500">Choose the data source, date range, and volume of customer feedback to analyze.</p>
            </div>
            <Button onClick={generateThemes} className="h-12 rounded-2xl px-6 shadow-sm bg-brand-950 hover:bg-brand-900 text-white" disabled={isGenerating}>
              <Wand2 className="mr-2 h-4 w-4" /> {isGenerating ? "Generating..." : "Generate themes"}
            </Button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="relative">
              <label className="mb-2 block text-body-xs font-bold text-neutral-500 uppercase tracking-widest">Customer data source</label>
              <button
                onClick={() => setIsDataSourceOpen(!isDataSourceOpen)}
                className="flex w-full items-center justify-between rounded-[24px] border border-neutral-200 bg-neutral-100 px-5 py-4 text-left transition hover:border-neutral-300 hover:bg-white"
              >
                <div>
                  <p className="font-bold text-neutral-950 text-body-m">{selectedDataSource.label}</p>
                  <p className="text-body-xs font-bold uppercase tracking-tight text-neutral-400">{selectedDataSource.count}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-neutral-400 transition ${isDataSourceOpen ? "rotate-180" : ""}`} />
              </button>

              {isDataSourceOpen && (
                <div className="absolute z-20 mt-2 w-full rounded-[24px] border border-neutral-200 bg-white p-2 shadow-xl">
                  {customerDataSources.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => {
                        setSelectedDataSource(source);
                        setIsDataSourceOpen(false);
                      }}
                      className={`mb-2 w-full rounded-[18px] border px-4 py-4 text-left transition last:mb-0 ${selectedDataSource.id === source.id ? "border-brand-300 bg-brand-50" : "border-transparent hover:bg-neutral-100"}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-neutral-950 text-body-m">{source.label}</p>
                        {selectedDataSource.id === source.id && <Check className="h-4 w-4 text-brand-800" />}
                      </div>
                      <p className="mt-1 text-body-xs font-bold uppercase tracking-tight text-neutral-500">{source.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-body-xs font-bold text-neutral-500 uppercase tracking-widest">From date</label>
              <div className="flex items-center rounded-[24px] border border-neutral-200 bg-neutral-100 px-5 py-4 text-body-s font-bold text-neutral-400 uppercase tracking-widest">
                <CalendarDays className="mr-3 h-4 w-4 text-neutral-400" /> Apr 15
              </div>
            </div>

            <div>
              <label className="mb-2 block text-body-xs font-bold text-neutral-500 uppercase tracking-widest">To date</label>
              <div className="flex items-center rounded-[24px] border border-neutral-200 bg-neutral-100 px-5 py-4 text-body-s font-bold text-neutral-400 uppercase tracking-widest">
                <CalendarDays className="mr-3 h-4 w-4 text-neutral-400" /> Jul 14
              </div>
            </div>

            <div>
              <label className="mb-2 block text-body-xs font-bold text-neutral-500 uppercase tracking-widest">Feedback volume</label>
              <div className="rounded-[24px] border border-neutral-200 bg-neutral-100 px-5 py-4 text-body-s font-bold text-neutral-400 uppercase tracking-widest">
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
            <Card className="mt-6 rounded-3xl border-neutral-200 shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-h4 font-bold text-neutral-900"><Sparkles className="h-5 w-5 text-warning-500" /> Trending suggestions</h2>
                    <p className="mt-1 text-body-s text-neutral-500 font-bold uppercase tracking-tight">AI suggests topics that are growing but not yet in your taxonomy.</p>
                  </div>
                  <Pill tone="amber">{suggestedTopics.length} suggestions</Pill>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {suggestedTopics.map((item) => (
                    <div key={item.title} className="rounded-[28px] border border-warning-100 bg-warning-500/5 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-neutral-950 text-body-m">{item.title}</p>
                          <p className="mt-2 text-body-s text-neutral-600 font-medium leading-relaxed">{item.reason}</p>
                        </div>
                        <Pill tone="amber">{item.volume}</Pill>
                      </div>
                      <Button variant="outline" className="mt-5 rounded-2xl bg-white shadow-sm font-bold border-neutral-200 hover:border-brand-800">
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
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[36px] border border-dashed border-neutral-300 bg-white px-8 py-16 text-center shadow-lg">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 shadow-inner">
              <Sparkles className="h-10 w-10 text-brand-800" />
            </div>
            <h2 className="mt-6 text-h2 font-bold text-neutral-950">Ready to generate themes</h2>
            <p className="mx-auto mt-3 max-w-2xl text-body-m text-neutral-500 font-medium leading-relaxed">
              Start by choosing the customer data source, date range, and feedback volume above. When you click <strong>Generate themes</strong>, the system will populate scorecards, suggested themes, subthemes, phrases, and evidence comments.
            </p>
            </motion.div>
        ) : (
        <div className="space-y-6">
            <Card className="rounded-3xl border-neutral-200 shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 border-b border-neutral-100 pb-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-h4 font-bold text-neutral-950"><Layers3 className="h-5 w-5 text-brand-800" /> Generated topic taxonomy</h2>
                    <p className="mt-1 text-body-s text-neutral-500 font-bold uppercase tracking-tight">Review, rename, merge, elevate, or remove topics before publishing.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-2xl border-neutral-200 font-bold"><GitMerge className="mr-2 h-4 w-4" /> Merge selected</Button>
                    <Button variant="outline" className="rounded-2xl border-neutral-200 font-bold" onClick={() => setWorkflow("addTopic")}><Plus className="mr-2 h-4 w-4" /> New topic</Button>
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
                            ? "border-brand-800 bg-white shadow-lg ring-2 ring-brand-800/10" 
                            : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
                        }`}
                      >
                        <button
                          onClick={() => chooseTopic(topic)}
                          className={`flex w-full items-center justify-between p-6 text-left transition-colors ${
                            isExpanded ? "bg-neutral-100/50" : "hover:bg-neutral-100/30"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors bg-neutral-200 text-neutral-900 border-neutral-300 shadow-sm`}>
                              <Layers3 className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-h1 font-bold text-neutral-900">{topic.title}</p>
                              <p className="text-body-s font-medium text-neutral-500">{topic.volume} comments · {topic.subtopics.length} subthemes</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="hidden items-center gap-6 md:flex">
                              <div className="text-right">
                                <p className="text-body-m font-bold text-neutral-950">{topic.volume}</p>
                                <p className="text-body-xs font-bold uppercase tracking-wider text-neutral-400">Volume</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-body-m font-bold ${topic.trend.startsWith("+") ? "text-success-500" : "text-error-500"}`}>
                                  {topic.trend}
                                </p>
                                <p className="text-body-xs font-bold uppercase tracking-wider text-neutral-400">Trend</p>
                              </div>
                              <div className="text-right">
                                <p className="text-body-m font-bold text-neutral-950">{topic.sentiment}</p>
                                <p className="text-body-xs font-bold uppercase tracking-wider text-neutral-400">Sentiment</p>
                              </div>
                            </div>
                            <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
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
                          <div className="border-t border-neutral-100 bg-white p-6">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
                              {/* Subtopics List */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <p className="text-body-s font-bold text-neutral-900 uppercase tracking-wider">Subthemes</p>
                                  <Button onClick={(e) => { e.stopPropagation(); addSubtopic(); }} variant="outline" size="sm" className="h-8 rounded-xl bg-white shadow-sm font-bold text-body-xs uppercase">
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
                                            ? "border-brand-800 bg-brand-800/5 shadow-sm" 
                                            : "border-neutral-100 bg-neutral-100/50 hover:border-neutral-200 hover:bg-white"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <p className={`font-bold text-body-m transition-colors ${isSubSelected ? "text-brand-950" : "text-neutral-900"}`}>
                                            {sub.title}
                                          </p>
                                          <div className={`rounded-full px-2 py-0.5 text-body-xs font-bold uppercase tracking-wider transition-colors ${
                                            isSubSelected ? "bg-brand-800/10 text-brand-800" : "bg-neutral-200 text-neutral-500 group-hover:bg-neutral-100"
                                          }`}>
                                            {sub.volume} docs
                                          </div>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                          {sub.phrases.slice(0, 3).map((phrase: string) => (
                                            <span key={phrase} className="rounded-lg bg-white/60 px-2 py-0.5 text-body-xs font-medium text-neutral-500 border border-neutral-100">
                                              {phrase}
                                            </span>
                                          ))}
                                          {sub.phrases.length > 3 && (
                                            <span className="rounded-lg px-2 py-0.5 text-body-xs font-bold text-neutral-400">
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
                              <div className="rounded-[28px] border border-neutral-100 bg-neutral-100/30 p-6">
                                {selectedSubtopic && isExpanded ? (
                                  <div className="space-y-6">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <div className="h-2 w-2 rounded-full bg-neutral-950 animate-pulse" />
                                          <p className="text-body-xs font-bold uppercase tracking-widest text-neutral-400">Theme Editor</p>
                                        </div>
                                        <input
                                          className="mt-2 w-full border-none bg-transparent p-0 text-h4 font-bold text-neutral-900 focus:outline-none focus:ring-0"
                                          value={selectedSubtopic.title}
                                          readOnly
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 bg-neutral-200 text-neutral-950 border-none font-bold text-body-xs uppercase">
                                          <div className="flex items-center">
                                            <Layers3 className="mr-1.5 h-3.5 w-3.5" /> Elevate
                                          </div>
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 bg-white font-bold text-body-xs uppercase">
                                          <GitMerge className="mr-1.5 h-3.5 w-3.5" /> Merge
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
                                      <div className="flex items-center justify-between mb-4">
                                        <div>
                                          <p className="text-body-m font-bold text-neutral-900">Matching Phrases</p>
                                          <p className="text-body-xs text-neutral-400 text-balance uppercase font-bold tracking-tight">Keywords that categorize comments into this theme</p>
                                        </div>
                                        <Pill tone="blue">{phrases.length}</Pill>
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-2 mb-4">
                                        {phrases.map((phrase) => (
                                          <button
                                            key={phrase}
                                            onClick={() => removePhrase(phrase)}
                                            className="inline-flex items-center rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-body-xs font-bold text-neutral-600 transition-colors hover:border-error-500 hover:bg-error-500/5 hover:text-error-500"
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
                                          className="h-10 flex-1 rounded-xl border border-neutral-200 bg-neutral-100 px-4 text-body-s focus:border-brand-800 focus:bg-white focus:outline-none transition-all"
                                        />
                                        <Button onClick={addPhrase} size="sm" className="h-10 rounded-xl px-4 bg-neutral-950 hover:bg-neutral-900 text-white border-none font-bold">
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-2xl bg-neutral-100 p-4 border border-neutral-200 shadow-sm">
                                      <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-neutral-200">
                                          <Trash2 className="h-4 w-4 text-neutral-400" />
                                        </div>
                                        <div>
                                          <p className="text-body-s font-bold text-neutral-900">Archive Topic</p>
                                          <p className="text-body-xs text-neutral-400 uppercase font-bold tracking-tight">Remove from taxonomy</p>
                                        </div>
                                      </div>
                                      <Button variant="outline" size="sm" className="rounded-xl border-error-500/20 text-error-500 font-bold hover:bg-error-500/5 hover:border-error-500/40">
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                                    <div className="rounded-full bg-neutral-100 p-4 mb-4">
                                      <Layers3 className="h-8 w-8 text-neutral-200" />
                                    </div>
                                    <p className="text-body-m font-bold text-neutral-900">Select a subtopic</p>
                                    <p className="text-body-xs text-neutral-400 mt-1 uppercase font-bold tracking-tight">Pick a subtheme on the left to edit its rules</p>
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
            <Card className="rounded-3xl border-neutral-200 shadow-sm transition-all hover:shadow-md">
                <CardContent className="p-5">
                  <h2 className="flex items-center gap-2 text-h4 font-bold text-neutral-900"><MessageSquareText className="h-5 w-5 text-brand-800" /> Evidence comments</h2>
                  <p className="mt-1 text-body-s text-neutral-500 font-bold uppercase tracking-tight">Use real customer text to validate and refine each theme.</p>
                  <div className="mt-4 space-y-3">
                    {comments.map((comment, idx) => (
                      <div key={idx} className="rounded-2xl border border-neutral-100 bg-white p-4 text-body-s leading-relaxed text-neutral-700 shadow-sm transition-all hover:shadow-md hover:border-brand-800">
                        “{comment}”
                        <div className="mt-3 flex gap-2"><Pill tone="rose">Negative</Pill><Pill>Matched to {selectedSubtopic?.title || "selected subtopic"}</Pill></div>
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
