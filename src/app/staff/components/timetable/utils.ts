import { ClassSchedule } from "@/types"

export const getSubjectColor = (name: string) => {
  const colorMap: Record<string, string> = {
    // ===== CORE SUBJECTS =====
    english: "bg-red-100 text-red-800 border-red-200",
    mathematics: "bg-green-100 text-green-800 border-green-200",
    "basic science": "bg-orange-100 text-orange-800 border-orange-200",
    "basic technology": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "social studies": "bg-blue-100 text-blue-800 border-blue-200",
    "civic education": "bg-sky-100 text-sky-800 border-sky-200",
    "computer studies": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "ict": "bg-indigo-100 text-indigo-800 border-indigo-200",

    // ===== PRIMARY SCHOOL =====
    "verbal reasoning": "bg-teal-100 text-teal-800 border-teal-200",
    "quantitative reasoning": "bg-lime-100 text-lime-800 border-lime-200",
    handwriting: "bg-rose-100 text-rose-800 border-rose-200",
    spelling: "bg-violet-100 text-violet-800 border-violet-200",
    "creative arts": "bg-pink-100 text-pink-800 border-pink-200",
    "moral instruction": "bg-amber-100 text-amber-800 border-amber-200",
    "basic science and technology": "bg-emerald-100 text-emerald-800 border-emerald-200",

    // ===== LANGUAGE SUBJECTS =====
    "french": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "yoruba": "bg-purple-100 text-purple-800 border-purple-200",
    "igbo": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    "hausa": "bg-lime-100 text-lime-800 border-lime-200",
    "arabic": "bg-blue-100 text-blue-800 border-blue-200",

    // ===== SCIENCES =====
    "physics": "bg-purple-100 text-purple-800 border-purple-200",
    "chemistry": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "biology": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "agricultural science": "bg-green-100 text-green-800 border-green-200",
    "health education": "bg-teal-100 text-teal-800 border-teal-200",
    "physical education": "bg-teal-100 text-teal-800 border-teal-200",
    "home economics": "bg-pink-100 text-pink-800 border-pink-200",

    // ===== ARTS =====
    "literature in english": "bg-rose-100 text-rose-800 border-rose-200",
    "christian religious studies": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "islamic religious studies": "bg-sky-100 text-sky-800 border-sky-200",
    "visual arts": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    "music": "bg-purple-100 text-purple-800 border-purple-200",
    "drama": "bg-pink-100 text-pink-800 border-pink-200",
    "fine arts": "bg-rose-100 text-rose-800 border-rose-200",

    // ===== COMMERCIAL / BUSINESS =====
    "business studies": "bg-orange-100 text-orange-800 border-orange-200",
    "commerce": "bg-amber-100 text-amber-800 border-amber-200",
    "economics": "bg-lime-100 text-lime-800 border-lime-200",
    "book keeping": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "accounting": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "office practice": "bg-emerald-100 text-emerald-800 border-emerald-200",

    // ===== HUMANITIES =====
    "history": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "government": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "geography": "bg-pink-100 text-pink-800 border-pink-200",
    "current affairs": "bg-sky-100 text-sky-800 border-sky-200",

    // ===== VOCATIONAL / TECHNICAL =====
    "technical drawing": "bg-stone-100 text-stone-800 border-stone-200",
    "woodwork": "bg-amber-100 text-amber-800 border-amber-200",
    "metalwork": "bg-gray-100 text-gray-800 border-gray-200",
    "food and nutrition": "bg-green-100 text-green-800 border-green-200",
    "clothing and textile": "bg-rose-100 text-rose-800 border-rose-200",

    // ===== SPECIALIZED SECONDARY =====
    "further mathematics": "bg-slate-100 text-slate-800 border-slate-200",
    "data processing": "bg-sky-100 text-sky-800 border-sky-200",
    "catering craft": "bg-amber-100 text-amber-800 border-amber-200",
    "tourism": "bg-lime-100 text-lime-800 border-lime-200",

    // ===== GENERAL =====
    "moral education": "bg-amber-100 text-amber-800 border-amber-200",
    "cultural and creative arts": "bg-pink-100 text-pink-800 border-pink-200",
    "security education": "bg-stone-100 text-stone-800 border-stone-200",
    "entrepreneurship": "bg-green-100 text-green-800 border-green-200",
    "agric science": "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  return (
    colorMap[name.toLowerCase()] ||
    "bg-gray-100 text-gray-600 border-gray-200"
  );
};

export const groupSchedulesByDay = (schedules: ClassSchedule[]) => {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const grouped: Record<string, ClassSchedule[]> = {};
  days.forEach((day) => {
    grouped[day] = schedules.filter(
      (s) => s.day.toLowerCase() === day.toLowerCase()
    );
  });
  return grouped;
};

export const getCurrentClassesInfo = (schedules: ClassSchedule[]) => {
  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
  const todaySchedules = schedules.filter(
    (s) => s.day.toLowerCase() === currentDay.toLowerCase()
  );

  const currentClass = todaySchedules.find((s) => {
    const start = new Date(s.startTime);
    const end = new Date(s.endTime);
    return now >= start && now <= end;
  });

  const nextClass = todaySchedules.find((s) => new Date(s.startTime) > now);
  const completedClasses = todaySchedules.filter(
    (s) => new Date(s.endTime) < now
  ).length;

  return { currentClass, nextClass, completedClasses, totalToday: todaySchedules.length };
};