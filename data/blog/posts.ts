import {
  heading as h,
  list,
  paragraph as p,
  quote,
  type BlogPost,
} from "./schema"

export const blogPosts: BlogPost[] = [
  {
    id: "introduction-to-neuro-symbolic-ai",
    categories: ["neuro", "ai", "research"],
    date: "2026-11-10",
    cover: 0,
    title: {
      en: "Introduction to Neuro-Symbolic AI",
      bn: "নিউরো-সিম্বলিক এআই পরিচিতি",
    },
    excerpt: {
      en: "Neuro-symbolic AI combines the pattern recognition of neural networks with explicit rules. A greenhouse example shows where each approach helps and why separating observation from inference makes a system easier to inspect.",
      bn: "নিউরো-সিম্বলিক এআই নিউরাল নেটওয়ার্কের প্যাটার্ন চেনার ক্ষমতার সঙ্গে স্পষ্ট নিয়ম যোগ করে। গ্রিনহাউসের একটি উদাহরণে দেখা যাক, কোন কাজটি কোন অংশের এবং পর্যবেক্ষণ ও সিদ্ধান্ত আলাদা রাখলে কী সুবিধা হয়।",
    },
    tags: {
      en: ["Symbolic reasoning", "Neural networks", "Knowledge representation"],
      bn: ["সাংকেতিক যুক্তি", "নিউরাল নেটওয়ার্ক", "জ্ঞান উপস্থাপন"],
    },
    minutes: { en: 2, bn: 2 },
    content: {
      en: [
        h("Let the model observe and the rules infer"),
        p(
          "Consider a greenhouse camera that spots irregular patches on leaves. A neural network can propose where the patches are and estimate their confidence, even when lighting changes. Rules can then combine that observation with other facts, such as the recent humidity and when the leaf was last inspected. Keeping those inputs explicit makes a surprising alert easier to investigate."
        ),
        h("What a minimal pipeline looks like", 3),
        list(
          [
            "Record a lesion candidate and its confidence rather than forcing a diagnosis.",
            "Use a small, documented rule set to combine observations and context.",
            "Return a review flag with the observations and rules that triggered it.",
          ],
          true
        ),
        p(
          "Treat missing observations as ",
          { kind: "strong", text: "uncertainty" },
          ". If the sensor stopped reporting humidity, the rule engine should say it lacks information rather than infer that the air was dry. Conflicting rules need an explicit resolution policy, such as requesting human review."
        ),
        quote(
          "A trace tells you how a decision was reached. You still need evidence that the decision is reliable."
        ),
        p(
          "Evaluate the pipeline against a neural-only baseline on greenhouse data held out by location. Check where the rules recover useful cases, where they suppress correct alerts, and how often the system abstains. That comparison reveals whether the extra structure earns its maintenance cost."
        ),
      ],
      bn: [
        h("মডেল পর্যবেক্ষণ করবে, নিয়ম সিদ্ধান্তে সাহায্য করবে"),
        p(
          "গ্রিনহাউসের ক্যামেরায় পাতার ওপর অসমান দাগ দেখা গেল। আলোর পরিবর্তন সত্ত্বেও নিউরাল নেটওয়ার্ক দাগের অবস্থান ও শনাক্তকরণের আস্থার মাত্রা জানাতে পারে। নিয়মভিত্তিক অংশটি সেই তথ্যের সঙ্গে সাম্প্রতিক আর্দ্রতা ও আগের পরিদর্শনের সময় মিলিয়ে দেখে। ফলে কোনো অপ্রত্যাশিত সতর্কতা এলে তার কারণ খুঁজে পাওয়া সহজ হয়।"
        ),
        h("ছোট একটি কার্যপ্রবাহ", 3),
        list(
          [
            "সরাসরি রোগ নির্ধারণের বদলে সন্দেহজনক দাগ ও আস্থার মাত্রা লিখে রাখুন।",
            "পর্যবেক্ষণ ও প্রাসঙ্গিক তথ্য মেলাতে অল্প কয়েকটি লিখিত নিয়ম ব্যবহার করুন।",
            "কোন তথ্য ও নিয়ম পর্যালোচনার সংকেত দিয়েছে, ফলাফলে তা দেখান।",
          ],
          true
        ),
        p(
          "তথ্য না থাকলে ",
          { kind: "strong", text: "অনিশ্চয়তা" },
          " প্রকাশ করুন। আর্দ্রতার সেন্সর বন্ধ থাকলে বাতাস শুষ্ক ধরে নেওয়ার কারণ নেই। দুটি নিয়ম পরস্পরবিরোধী হলে মানুষের পর্যালোচনায় পাঠানোর মতো সুস্পষ্ট নীতি রাখুন।"
        ),
        quote(
          "সিদ্ধান্তের ধাপগুলো জানা যায় ব্যাখ্যা থেকে। সিদ্ধান্তটি ভরসাযোগ্য কি না, তা যাচাই করতে আলাদা প্রমাণ লাগে।"
        ),
        p(
          "ভিন্ন গ্রিনহাউসের তথ্য পরীক্ষার জন্য আলাদা রাখুন এবং শুধুই নিউরাল মডেলের সঙ্গে তুলনা করুন। কোথায় নিয়ম কাজে দিয়েছে, কোথায় সঠিক সতর্কতা আটকে দিয়েছে এবং কতবার সিস্টেম সিদ্ধান্ত স্থগিত করেছে, আলাদা করে লিখুন। তবেই বাড়তি কাঠামোর রক্ষণাবেক্ষণ সার্থক কি না বোঝা যাবে।"
        ),
      ],
    },
  },
  {
    id: "explainable-ai-in-medical-image-diagnosis",
    categories: ["ai", "research"],
    date: "2026-10-28",
    cover: 1,
    title: {
      en: "Explainable AI in Medical Image Diagnosis",
      bn: "চিকিৎসা-চিত্র বিশ্লেষণে ব্যাখ্যাযোগ্য এআই",
    },
    excerpt: {
      en: "A classifier can highlight regions of a chest radiograph, but a plausible heat map is only the start. Here’s how to design a research evaluation that tests what the model actually relies on.",
      bn: "বুকের এক্স-রের কিছু অংশ শ্রেণিবিন্যাসকারী মডেল রঙ দিয়ে দেখাতে পারে। দেখতে যুক্তিসংগত মানচিত্র পেলেই কাজ শেষ নয়। মডেল আসলে কিসের ওপর নির্ভর করে, তা যাচাইয়ের জন্য একটি গবেষণা পরিকল্পনা করা যাক।",
    },
    tags: {
      en: ["Medical imaging", "Grad-CAM", "Model evaluation"],
      bn: ["চিকিৎসা-চিত্র", "Grad-CAM", "মডেল মূল্যায়ন"],
    },
    minutes: { en: 2, bn: 2 },
    content: {
      en: [
        h("Start with the research question"),
        p(
          "For a research prototype, ask whether the model relies on image regions relevant to its classification task. A technique such as Grad-CAM highlights spatial regions associated with a prediction. It can reveal suspicious attention to a corner label, but it does not establish that the highlighted tissue explains the outcome."
        ),
        h("Design the check before looking at examples", 3),
        list(
          [
            "Split the dataset by patient, then reserve a different hospital or acquisition setup if available.",
            "Inspect ordinary cases, errors, and low-confidence cases instead of selecting the most convincing maps.",
            "Compare predictions after masking highlighted areas with predictions after masking equally sized control areas.",
          ],
          true
        ),
        p(
          "Keep an error taxonomy alongside the images. Note whether a prediction changes with a text marker, a positioning artifact, or a preprocessing choice. If the model is right for the wrong reason, revisit the data pipeline before adjusting the visualization."
        ),
        p(
          "Report the split, uncertainty, failure cases, and limitations in plain language. This educational example uses a synthetic illustration. It provides no patient data, clinical validation, or guidance for medical decisions."
        ),
      ],
      bn: [
        h("গবেষণার প্রশ্ন আগে ঠিক করুন"),
        p(
          "গবেষণামূলক প্রোটোটাইপে প্রশ্ন হতে পারে, শ্রেণিবিন্যাসের জন্য মডেল ছবির প্রাসঙ্গিক অংশ ব্যবহার করছে কি না। Grad-CAM পূর্বানুমানের সঙ্গে সম্পর্কিত কিছু অঞ্চল দেখায়। ছবির কোণে লেখা লেবেলে অস্বাভাবিক গুরুত্ব দেওয়া এতে ধরা পড়তে পারে। তবে রঙিন অঞ্চল দেখেই বলা যায় না যে সেখানকার টিস্যু ফলাফলের কারণ।"
        ),
        h("ছবি দেখার আগেই যাচাইয়ের পরিকল্পনা", 3),
        list(
          [
            "একই রোগীর ছবি এক ভাগে রাখুন। সম্ভব হলে অন্য হাসপাতাল বা যন্ত্রের তথ্য আলাদা পরীক্ষায় রাখুন।",
            "আকর্ষণীয় মানচিত্র বাছাই না করে সাধারণ, ভুল এবং কম আস্থার ফলও পরীক্ষা করুন।",
            "রঙিন অঞ্চল ঢেকে পাওয়া ফলের সঙ্গে সমান আকারের অন্য অঞ্চল ঢেকে পাওয়া ফল তুলনা করুন।",
          ],
          true
        ),
        p(
          "ছবির সঙ্গে ভুলের ধরন নথিভুক্ত করুন। লেখার চিহ্ন, রোগীর অবস্থান কিংবা পূর্বপ্রক্রিয়াকরণ বদলালে ফল বদলায় কি না দেখুন। ভুল কারণে সঠিক ফল এলে দৃশ্যায়ন বদলানোর আগে তথ্য প্রস্তুতির ধাপ পরীক্ষা করুন।"
        ),
        p(
          "তথ্য ভাগ করার পদ্ধতি, অনিশ্চয়তা, ভুলের উদাহরণ ও সীমাবদ্ধতা স্পষ্ট করে জানান। শিক্ষামূলক এই উদাহরণের ছবিটি কৃত্রিম। এতে রোগীর তথ্য, ক্লিনিক্যাল যাচাই বা চিকিৎসা সিদ্ধান্তের নির্দেশনা নেই।"
        ),
      ],
    },
  },
  {
    id: "agricultural-computer-vision",
    categories: ["agriculture", "research"],
    date: "2026-10-20",
    cover: 2,
    title: { en: "Agricultural Computer Vision", bn: "কৃষিতে কম্পিউটার ভিশন" },
    excerpt: {
      en: "Crop imagery can help prioritize field inspections. The hard part is collecting examples that reflect real lighting, growth stages, and field conditions, then turning model output into a useful observation.",
      bn: "ফসলের ছবি মাঠ পরিদর্শনের অগ্রাধিকার ঠিক করতে সাহায্য করে। আসল চ্যালেঞ্জ হলো বিভিন্ন আলো, বৃদ্ধি পর্যায় ও মাঠের অবস্থার নমুনা নেওয়া এবং মডেলের ফলকে কাজে লাগার মতো পর্যবেক্ষণে রূপ দেওয়া।",
    },
    tags: {
      en: ["Crop monitoring", "Drones", "Field validation"],
      bn: ["ফসল পর্যবেক্ষণ", "ড্রোন", "মাঠপর্যায়ে যাচাই"],
    },
    minutes: { en: 2, bn: 2 },
    content: {
      en: [
        h("Collect variation on purpose"),
        p(
          "A hundred nearly identical images from the same drone pass tell you less than a smaller set covering different fields, times of day, and growth stages. Keep the field identifier, capture conditions, and camera height with each image. Those records make it possible to trace surprising results back to how the data was collected."
        ),
        h("Evaluate where someone will use the result", 3),
        p(
          "Hold out complete fields or capture sessions. A random image-level split can put neighboring frames from a single flight on both sides of the evaluation. For a crop monitoring task, also track whether alerts arrive often enough to be useful without creating too many unnecessary visits."
        ),
        list([
          "Define whether the unit of action is a leaf, a plant, or a field zone.",
          "Keep examples of shadows, wet soil, and other visually confusing negatives.",
          "Give field staff a way to mark an alert as reviewed or uncertain.",
        ]),
        p(
          "Start with a map of proposed inspection zones and make the original image easy to open. Review the first alerts with someone who knows the site. Their feedback will tell you whether to improve the model, change the labels, or adjust the workflow around it."
        ),
      ],
      bn: [
        h("পরিকল্পনা করে বৈচিত্র্য সংগ্রহ করুন"),
        p(
          "ড্রোনের একই যাত্রায় তোলা একশো প্রায় অভিন্ন ছবির চেয়ে আলাদা মাঠ, সময় ও বৃদ্ধি পর্যায়ের অল্প কিছু ছবি বেশি কাজে দেয়। প্রতিটি ছবির সঙ্গে মাঠের পরিচয়, ছবি তোলার পরিবেশ ও ক্যামেরার উচ্চতা লিখে রাখুন। পরে অপ্রত্যাশিত ফল এলে কীভাবে তথ্য সংগ্রহ হয়েছিল তা খুঁজে পাওয়া যাবে।"
        ),
        h("ব্যবহারক্ষেত্রের সঙ্গে পরীক্ষা মিলিয়ে নিন", 3),
        p(
          "পুরো মাঠ বা ছবি তোলার একটি পূর্ণ সেশন পরীক্ষার জন্য আলাদা রাখুন। এলোমেলোভাবে ছবি ভাগ করলে একই যাত্রার পাশাপাশি তোলা ছবি প্রশিক্ষণ ও পরীক্ষায় ঢুকে যেতে পারে। সতর্কবার্তা কাজে লাগার মতো ঘন ঘন আসছে কি না এবং তা অকারণে মাঠে যাওয়ার সংখ্যা বাড়াচ্ছে কি না, দেখুন।"
        ),
        list([
          "কাজের একক পাতা, গাছ নাকি মাঠের অঞ্চল, তা ঠিক করুন।",
          "ছায়া, ভেজা মাটি ও দেখতে বিভ্রান্তিকর অন্য উদাহরণ রাখুন।",
          "মাঠকর্মী যেন সংকেতকে যাচাই করা হয়েছে বা অনিশ্চিত হিসেবে চিহ্নিত করতে পারেন।",
        ]),
        p(
          "প্রথমে পরিদর্শনের জন্য প্রস্তাবিত অঞ্চলগুলোর মানচিত্র দিন এবং মূল ছবি খোলার ব্যবস্থা রাখুন। মাঠ চেনেন এমন কারও সঙ্গে প্রথম ফলগুলো দেখুন। মডেল, লেবেল নাকি কাজের পদ্ধতি উন্নত করা দরকার, সেই মতামতই পথ দেখাবে।"
        ),
      ],
    },
  },
  {
    id: "building-scalable-applications-with-nextjs",
    categories: ["web", "engineering", "tutorial"],
    date: "2026-10-12",
    cover: 3,
    title: {
      en: "Building Scalable Applications with Next.js",
      bn: "Next.js দিয়ে বড় পরিসরের অ্যাপ তৈরি",
    },
    excerpt: {
      en: "Keep shared content on the server, ship client JavaScript only for interaction, and define cache rules around how fresh the data needs to be. An article listing makes a useful starting point.",
      bn: "সবার জন্য একই কনটেন্ট সার্ভারে রাখুন, শুধু মিথস্ক্রিয়ার জন্য ক্লায়েন্টে JavaScript পাঠান এবং তথ্য কতটা নতুন থাকা দরকার তা দেখে ক্যাশের নিয়ম ঠিক করুন। নিবন্ধের তালিকা দিয়ে শুরু করা যায়।",
    },
    tags: {
      en: ["Next.js", "React", "Server Components"],
      bn: ["Next.js", "React", "সার্ভার কম্পোনেন্ট"],
    },
    minutes: { en: 3, bn: 3 },
    content: {
      en: [
        h("Decide where each concern belongs"),
        p(
          "Public article metadata can often be rendered on the server. Put controls such as a live search field or a preference switch in a small Client Component. Passing only the data needed for an interaction keeps the browser bundle and serialized page data easier to reason about."
        ),
        {
          kind: "image",
          src: "/blog/desk.webp",
          width: 960,
          height: 492,
          alt: "A laptop, books, a mug, and a plant",
          caption: "An editorial illustration for the development notes.",
        },
        h("Separate cache freshness from rendering", 3),
        p(
          "An archive that changes once a week and a personal dashboard require different cache policies. Write down who may see the data and how long a stale response is acceptable. Reserve shared caching for public content. Measure server response times and client bundle size before introducing another cache."
        ),
        {
          kind: "code",
          language: "TSX",
          code: "export default async function Page() {\n  const posts = await getPublishedPosts()\n  return <ArticleList posts={posts} />\n}",
          caption:
            "The page loads public articles on the server and passes them to a list component. getPublishedPosts represents your own data access function.",
        },
        p(
          "Start with a small route and check the browser’s network panel with a cold cache. For the framework’s rendering boundaries, see the ",
          {
            kind: "link",
            href: "https://nextjs.org/docs/app/getting-started/server-and-client-components",
            text: "Next.js Server and Client Components guide",
          },
          "."
        ),
      ],
      bn: [
        h("কোন কাজ কোথায় হবে আগে ঠিক করুন"),
        p(
          "সর্বসাধারণের জন্য প্রকাশিত নিবন্ধের তথ্য সার্ভারেই দেখানো যায়। সঙ্গে সঙ্গে ফল বদলানো অনুসন্ধান বা পছন্দের ভাষা বদলানোর নিয়ন্ত্রণ ছোট একটি ক্লায়েন্ট কম্পোনেন্টে রাখুন। মিথস্ক্রিয়ার জন্য শুধু প্রয়োজনীয় তথ্য পাঠালে ব্রাউজারের বান্ডল ও পাতার সঙ্গে পাঠানো ডেটার আকার বোঝা সহজ হয়।"
        ),
        {
          kind: "image",
          src: "/blog/desk.webp",
          width: 960,
          height: 492,
          alt: "ল্যাপটপ, বই, মগ ও একটি গাছ",
          caption: "ডেভেলপমেন্ট নোটের জন্য তৈরি অলংকরণ।",
        },
        h("রেন্ডারিং আর ক্যাশ কতক্ষণ থাকবে, আলাদা করে ভাবুন", 3),
        p(
          "সপ্তাহে একবার বদলানো আর্কাইভ ও ব্যক্তিগত ড্যাশবোর্ডে একই ক্যাশ নীতি মানায় না। তথ্য কে দেখতে পারবেন এবং কতক্ষণ পুরোনো ফল গ্রহণযোগ্য, লিখে রাখুন। শুধু প্রকাশ্য তথ্যের জন্য সবার মধ্যে ভাগ করা ক্যাশ ব্যবহার করুন। আরেকটি ক্যাশ যোগ করার আগে সার্ভারের সাড়া দেওয়ার সময় ও ক্লায়েন্ট বান্ডলের আকার মাপুন।"
        ),
        {
          kind: "code",
          language: "TSX",
          code: "export default async function Page() {\n  const posts = await getPublishedPosts()\n  return <ArticleList posts={posts} />\n}",
          caption:
            "পাতাটি সার্ভারে প্রকাশিত নিবন্ধ নিয়ে তালিকা কম্পোনেন্টে পাঠায়। getPublishedPosts হলো আপনার নিজের তথ্য আনার ফাংশনের জায়গা।",
        },
        p(
          "ছোট একটি রুট দিয়ে শুরু করে খালি ক্যাশে ব্রাউজারের নেটওয়ার্ক প্যানেল দেখুন। রেন্ডারিংয়ের সীমানা বুঝতে পড়ুন ",
          {
            kind: "link",
            href: "https://nextjs.org/docs/app/getting-started/server-and-client-components",
            text: "Next.js-এর সার্ভার ও ক্লায়েন্ট কম্পোনেন্ট নির্দেশিকা",
          },
          "।"
        ),
      ],
    },
  },
  {
    id: "machine-learning-fundamentals",
    categories: ["ml", "tutorial"],
    date: "2026-10-05",
    cover: 4,
    title: { en: "Machine Learning Fundamentals", bn: "মেশিন লার্নিংয়ের ভিত্তি" },
    excerpt: {
      en: "Start with a question, choose a baseline, and protect the test split. Those three habits matter more than choosing an elaborate algorithm for your first experiment.",
      bn: "একটি প্রশ্ন দিয়ে শুরু করুন, তুলনার জন্য সাধারণ পদ্ধতি বেছে নিন এবং পরীক্ষার তথ্য আলাদা রাখুন। প্রথম পরীক্ষায় জটিল অ্যালগরিদম বাছাইয়ের চেয়ে এই তিন অভ্যাস বেশি জরুরি।",
    },
    tags: {
      en: ["Baselines", "Data leakage", "Classification"],
      bn: ["তুলনার ভিত্তি", "তথ্য ফাঁস", "শ্রেণিবিন্যাস"],
    },
    minutes: { en: 2, bn: 2 },
    content: {
      en: [
        h("Define success before training"),
        p(
          "Imagine predicting which support tickets need immediate attention. Overall accuracy can look high if urgent tickets are rare. Decide how costly missed urgent tickets and false alarms are, then pick a metric or threshold policy that makes that tradeoff visible."
        ),
        h("Build an honest baseline", 3),
        p(
          "Compare your first model with a majority-class predictor or a small keyword rule. A baseline should be easy to explain and evaluated on the same data as your candidate. If the new model only improves one slice of the data, describe that slice and inspect the errors elsewhere."
        ),
        list(
          [
            "Reserve test examples before choosing features.",
            "Fit preprocessing on training data only.",
            "Use validation examples for tuning and keep the test set for the final comparison.",
          ],
          true
        ),
        p(
          "Look for data leakage before celebrating a high score. A field such as ",
          { kind: "code", text: "resolved_at" },
          " might reveal what happened after the prediction would have been made. Run your experiment again without future information and compare the result to the original baseline."
        ),
      ],
      bn: [
        h("প্রশিক্ষণের আগে সাফল্যের সংজ্ঞা দিন"),
        p(
          "ধরুন কোন সাপোর্ট টিকিটে দ্রুত সাড়া দরকার, তা অনুমান করবেন। জরুরি টিকিট কম হলে সবগুলোকে সাধারণ বলেও মোট নির্ভুলতা বেশি দেখাতে পারে। জরুরি টিকিট বাদ পড়া ও ভুল সতর্কতার ক্ষতি কতটা, তা ভেবে এমন মাপকাঠি বাছুন যাতে এই দুই ধরনের ভুল দেখা যায়।"
        ),
        h("ন্যায্য তুলনার ভিত্তি তৈরি করুন", 3),
        p(
          "প্রথম মডেলের সঙ্গে সংখ্যাগরিষ্ঠ শ্রেণি বলার পদ্ধতি বা কয়েকটি শব্দের নিয়ম তুলনা করুন। সহজ পদ্ধতিটি বোঝানো সহজ হতে হবে এবং নতুন মডেলের মতো একই তথ্য দিয়ে যাচাই করতে হবে। তথ্যের কেবল একটি অংশে উন্নতি হলে সেই অংশের পরিচয় দিন এবং অন্য অংশের ভুল দেখুন।"
        ),
        list(
          [
            "ফিচার বাছাইয়ের আগে চূড়ান্ত পরীক্ষার নমুনা আলাদা করুন।",
            "শুধু প্রশিক্ষণের তথ্য দিয়ে পূর্বপ্রক্রিয়াকরণ শিখুন।",
            "বৈধতা যাচাইয়ের নমুনা দিয়ে সমন্বয় করুন এবং চূড়ান্ত তুলনার জন্য পরীক্ষার তথ্য রেখে দিন।",
          ],
          true
        ),
        p(
          "বেশি স্কোর পেলেই আগে দেখুন তথ্য ফাঁস হয়েছে কি না। ",
          { kind: "code", text: "resolved_at" },
          " ফিল্ডটি পূর্বানুমানের সময় যা জানার কথা নয়, এমন ভবিষ্যতের তথ্য জানিয়ে দিতে পারে। এই ধরনের ফিল্ড বাদ দিয়ে আবার চালান এবং সহজ পদ্ধতির সঙ্গে তুলনা করুন।"
        ),
      ],
    },
  },
  {
    id: "full-stack-development-with-django-and-react",
    categories: ["web", "engineering", "tutorial"],
    date: "2026-09-27",
    cover: 5,
    title: {
      en: "Full-Stack Development with Django and React",
      bn: "Django ও React দিয়ে ফুল-স্ট্যাক ডেভেলপমেন্ট",
    },
    excerpt: {
      en: "A predictable API contract helps a Django backend and a React interface evolve together. Begin with a single user workflow and account for what happens when a request fails.",
      bn: "স্পষ্ট API চুক্তি থাকলে Django ব্যাকএন্ড এবং React ইন্টারফেস একসঙ্গে পরিবর্তন করা সহজ হয়। একটি ব্যবহারকারী প্রবাহ দিয়ে শুরু করুন এবং অনুরোধ ব্যর্থ হলে কী হবে সেটিও ভেবে রাখুন।",
    },
    tags: {
      en: ["Django", "React", "API contracts"],
      bn: ["Django", "React", "API চুক্তি"],
    },
    minutes: { en: 2, bn: 2 },
    content: {
      en: [
        h("Build one workflow through both layers"),
        p(
          "For a reading list, let a user add one book and see it appear. Write down the request, success response, and validation response before building a second screen. Django owns the persistence and validation rules. React gives immediate feedback and can keep a draft intact when saving fails."
        ),
        h("Make errors part of the contract", 3),
        list([
          "Name validation fields consistently on the server and in the form.",
          "Show waiting, success, and error states explicitly.",
          "Avoid accidental duplicate writes when users retry or click twice.",
        ]),
        p(
          "Keep a test for invalid input beside the successful case. A green response on a valid request says little about a missing title, a repeated submission, or a lost connection. Use the ",
          {
            kind: "link",
            href: "https://docs.djangoproject.com/en/stable/topics/testing/overview/",
            text: "Django testing guide",
          },
          " to cover the server contract, then exercise the same states in the browser."
        ),
        p(
          "Once the first workflow is reliable, the second one can follow the same patterns. Code gained through repetition at that point reflects the application’s needs rather than guesses made before it was used."
        ),
      ],
      bn: [
        h("একটি কাজ সামনে থেকে পেছন পর্যন্ত তৈরি করুন"),
        p(
          "পাঠতালিকায় একটি বই যোগ করে তালিকায় দেখার কাজটি আগে তৈরি করুন। দ্বিতীয় পর্দায় যাওয়ার আগে অনুরোধ, সফল উত্তর ও ভুল তথ্যের উত্তর লিখে ফেলুন। তথ্য সংরক্ষণ ও যাচাইয়ের নিয়ম Django-তে থাকবে। React দ্রুত অবস্থা জানাবে এবং সংরক্ষণ ব্যর্থ হলেও অসম্পূর্ণ লেখা ধরে রাখতে পারবে।"
        ),
        h("ভুলের উত্তরও চুক্তির অংশ", 3),
        list([
          "সার্ভার ও ফর্মে যাচাইয়ের ফিল্ডের নাম একই রাখুন।",
          "অপেক্ষা, সাফল্য ও ব্যর্থতা স্পষ্ট করে দেখান।",
          "আবার চেষ্টা বা দুইবার ক্লিক করলে যেন অনিচ্ছায় তথ্য দুবার লেখা না হয়।",
        ]),
        p(
          "সফল অনুরোধের পাশাপাশি ভুল তথ্যের জন্যও পরীক্ষা রাখুন। সঠিক অনুরোধ কাজ করলেই শিরোনাম না থাকা, পুনরায় জমা দেওয়া কিংবা সংযোগ বিচ্ছিন্ন হওয়ার আচরণ বোঝা যায় না। সার্ভারের চুক্তি পরীক্ষা করতে ",
          {
            kind: "link",
            href: "https://docs.djangoproject.com/en/stable/topics/testing/overview/",
            text: "Django টেস্টিং নির্দেশিকা",
          },
          " দেখুন। পরে ব্রাউজারেও একই অবস্থাগুলো পরীক্ষা করুন।"
        ),
        p(
          "প্রথম কাজটি নির্ভরযোগ্য হলে দ্বিতীয়টিতে একই পদ্ধতি কাজে লাগান। তখন পুনরাবৃত্ত ধাপ থেকে যে যৌথ কোড তৈরি হবে, তা অনুমানের বদলে ব্যবহারের অভিজ্ঞতা থেকে আসবে।"
        ),
      ],
    },
  },
  {
    id: "deep-learning-in-real-world-applications",
    categories: ["ml", "ai"],
    date: "2026-09-15",
    cover: 4,
    title: {
      en: "Deep Learning for Real-World Applications",
      bn: "বাস্তব কাজে ডিপ লার্নিং",
    },
    excerpt: {
      en: "A good benchmark is only one milestone. Consider latency, data drift, and how people will handle uncertain predictions before deploying a deep-learning model.",
      bn: "পরীক্ষায় ভালো ফল একটি ধাপ মাত্র। ডিপ লার্নিং মডেল ব্যবহারে আনার আগে সাড়া দেওয়ার সময়, তথ্যের পরিবর্তন ও অনিশ্চিত পূর্বানুমান মানুষ কীভাবে সামলাবেন, তা ভাবতে হয়।",
    },
    tags: {
      en: ["Deep learning", "Latency", "Data drift"],
      bn: ["ডিপ লার্নিং", "বিলম্ব", "তথ্যের পরিবর্তন"],
    },
    minutes: { en: 2, bn: 2 },
    content: {
      en: [
        h("Work backwards from an operating constraint"),
        p(
          "Suppose a camera needs to flag visibly damaged items on a sorting line. Measure the time from capture to a usable signal, including image decoding and preprocessing. A smaller model that returns a result before the item moves past the diverter can outperform a more accurate but slower model in practice."
        ),
        h("Know what happens when conditions change", 3),
        p(
          "Camera replacement or new packaging may shift the data the model sees. Record the deployment conditions, track confidence and correction rates, and keep a sample of outcomes that can be reviewed safely. A drop in confidence is a clue to investigate, not proof that the model has become worse."
        ),
        list([
          "Set a latency budget on the intended hardware.",
          "Define when the system should defer to a person.",
          "Test a fallback that still works during outages.",
        ]),
        p(
          "Run the model in ",
          { kind: "emphasis", text: "observation mode" },
          " before letting it change the workflow. Compare its flags with the current process and decide how to roll back. This gives the team a practical way to judge usefulness without committing to an untested operating change."
        ),
      ],
      bn: [
        h("বাস্তব সীমাবদ্ধতা থেকে শুরু করুন"),
        p(
          "ধরুন বাছাই লাইনে দৃশ্যত ক্ষতিগ্রস্ত পণ্য ক্যামেরা দিয়ে চিহ্নিত করতে হবে। ছবি নেওয়া থেকে ব্যবহারযোগ্য সংকেত আসা পর্যন্ত সময় মাপুন। ছবি ডিকোড ও পূর্বপ্রক্রিয়াকরণের সময়ও ধরুন। বাছাইয়ের স্থান পার হওয়ার আগে ফল দিতে পারে এমন ছোট মডেল বাস্তবে ধীর অথচ বেশি নির্ভুল মডেলের চেয়ে উপযোগী হতে পারে।"
        ),
        h("পরিস্থিতি বদলালে কী হবে", 3),
        p(
          "ক্যামেরা পাল্টালে বা নতুন মোড়ক এলে মডেলের দেখা তথ্য বদলাতে পারে। ব্যবহারের পরিবেশ লিখে রাখুন, আস্থার মাত্রা ও সংশোধনের হার অনুসরণ করুন এবং নিরাপদে পর্যালোচনা করা যায় এমন নমুনা রাখুন। আস্থা কমে যাওয়া অনুসন্ধানের সংকেত, কর্মক্ষমতা খারাপ হওয়ার চূড়ান্ত প্রমাণ নয়।"
        ),
        list([
          "যে যন্ত্রে মডেল চলবে, সেখানেই সময়ের সীমা ঠিক করুন।",
          "কখন মানুষের হাতে সিদ্ধান্ত ছেড়ে দিতে হবে, নির্ধারণ করুন।",
          "বিভ্রাটের মধ্যেও চলবে এমন বিকল্প পরীক্ষা করুন।",
        ]),
        p(
          "কাজের ধারা বদলানোর আগে মডেলকে ",
          { kind: "emphasis", text: "শুধু পর্যবেক্ষণে" },
          " রাখুন। বর্তমান পদ্ধতির ফলের সঙ্গে মডেলের সংকেত তুলনা করুন এবং প্রয়োজন হলে আগের পদ্ধতিতে ফেরার পথ রাখুন। এতে অপরীক্ষিত পরিবর্তন চালু না করেও মডেলের উপযোগিতা বোঝা যায়।"
        ),
      ],
    },
  },
  {
    id: "computer-vision-in-smart-agriculture",
    categories: ["agriculture", "ml"],
    date: "2026-09-03",
    cover: 2,
    title: {
      en: "Computer Vision in Smart Agriculture",
      bn: "স্মার্ট কৃষিতে কম্পিউটার ভিশন",
    },
    excerpt: {
      en: "A detection model is one part of a smart-agriculture workflow. Connecting detections across dates and giving field teams useful context makes monitoring more actionable.",
      bn: "শনাক্তকরণ মডেল স্মার্ট কৃষির কাজের একটি অংশ। আলাদা দিনের ফল মিলিয়ে দেখলে এবং মাঠকর্মীদের কাজে লাগার মতো প্রাসঙ্গিক তথ্য দিলে পর্যবেক্ষণ থেকে সিদ্ধান্ত নেওয়া সহজ হয়।",
    },
    tags: {
      en: ["Time series", "Precision agriculture", "Image alignment"],
      bn: ["সময়ক্রম", "নির্ভুল কৃষি", "ছবি মিলিয়ে দেখা"],
    },
    minutes: { en: 2, bn: 2 },
    content: {
      en: [
        h("Treat the field as a timeline"),
        p(
          "Single-frame detections are useful, but changes over time often shape what field teams do. Define stable field zones, align repeat captures to those zones, and note when a zone could not be observed. A map should distinguish an unobserved zone from one that was observed and had no anomaly."
        ),
        h("Put human observations beside the imagery", 3),
        p(
          "Attach dated notes from field inspections when available. A change in canopy color might reflect lighting, seasonal growth, or a genuine condition. Comparing the latest image with a previous one and a field note gives reviewers evidence that an isolated detection cannot supply."
        ),
        list([
          "Show the latest trustworthy image and the capture date.",
          "Keep unresolved detections separate from confirmed observations.",
          "Group nearby alerts into a review task when they refer to one zone.",
        ]),
        p(
          "Evaluate how well reviewers can prioritize inspections using the dashboard. Track time to review and repeated false alerts alongside model metrics. If it creates more noise than the current workflow, adjust the alert threshold or grouping before collecting another training dataset."
        ),
      ],
      bn: [
        h("মাঠকে সময়ের ধারায় দেখুন"),
        p(
          "একটি ছবির শনাক্তকরণ কাজে দেয়, তবে সময় ধরে পরিবর্তনই অনেক সময় পরিদর্শনের কাজ ঠিক করে। মাঠের স্থায়ী অঞ্চলগুলো চিহ্নিত করুন এবং বারবার তোলা ছবি সেই অঞ্চলের সঙ্গে মিলিয়ে নিন। যে অঞ্চল দেখা যায়নি, মানচিত্রে তাকে দেখা হয়েছে কিন্তু অস্বাভাবিকতা নেই এমন অঞ্চল থেকে আলাদা দেখান।"
        ),
        h("ছবির পাশে মাঠের পর্যবেক্ষণ রাখুন", 3),
        p(
          "মাঠ পরিদর্শনের তারিখসহ নোট পেলে ছবির সঙ্গে যুক্ত করুন। পাতার আবরণের রং আলো, ঋতুভিত্তিক বৃদ্ধি বা কোনো বাস্তব সমস্যার কারণে বদলাতে পারে। আগের ছবি ও মাঠের নোটের সঙ্গে নতুন ছবি মিলিয়ে দেখলে একটি বিচ্ছিন্ন সংকেতের চেয়ে বেশি প্রমাণ পাওয়া যায়।"
        ),
        list([
          "সাম্প্রতিক নির্ভরযোগ্য ছবি ও তার তারিখ দেখান।",
          "অমীমাংসিত সংকেত ও নিশ্চিত পর্যবেক্ষণ আলাদা রাখুন।",
          "একই অঞ্চলের কাছাকাছি সংকেতগুলো একটি পর্যালোচনা কাজে একত্র করুন।",
        ]),
        p(
          "ড্যাশবোর্ড দিয়ে পরিদর্শনের অগ্রাধিকার ঠিক করা কতটা সহজ, তা যাচাই করুন। মডেলের স্কোরের পাশাপাশি পর্যালোচনার সময় ও বারবার আসা ভুল সংকেত গুনুন। আগের পদ্ধতির চেয়ে বেশি অপ্রয়োজনীয় সংকেত এলে নতুন তথ্য সংগ্রহের আগে সীমা বা সংকেত গুচ্ছ করার পদ্ধতি বদলান।"
        ),
      ],
    },
  },
  {
    id: "cnn-architectures-and-image-classification",
    categories: ["ml", "ai", "tutorial"],
    date: "2026-08-21",
    cover: 0,
    title: {
      en: "CNN Architectures and Image Classification",
      bn: "CNN স্থাপত্য ও ছবি শ্রেণিবিন্যাস",
    },
    excerpt: {
      en: "Convolutions learn local patterns, while deeper layers combine them into features. Use controlled comparisons to understand which architecture choices matter for a given image dataset.",
      bn: "কনভলিউশন ছবির স্থানীয় বিন্যাস শেখে, আর গভীর স্তর সেগুলো মিলিয়ে ফিচার তৈরি করে। নিয়ন্ত্রিত তুলনা করে বুঝুন, নির্দিষ্ট ছবির ডেটাসেটে স্থাপত্যের কোন সিদ্ধান্তগুলো গুরুত্বপূর্ণ।",
    },
    tags: {
      en: ["CNN", "Transfer learning", "Image classification"],
      bn: ["CNN", "ট্রান্সফার লার্নিং", "ছবি শ্রেণিবিন্যাস"],
    },
    minutes: { en: 2, bn: 2 },
    content: {
      en: [
        h("From local patterns to a class score"),
        p(
          "A convolution applies a learned filter across an image or feature map. Early layers can respond to simple edges and textures. Later layers combine information across a larger spatial region. How much context a layer can see depends on choices such as filter size, stride, and depth."
        ),
        h("Choose a comparison you can interpret", 3),
        p(
          "Train a small CNN and compare it with a pretrained backbone on the same train and validation splits. Keep image preprocessing consistent and write down the compute budget. A pretrained network can offer a head start, but may need adaptation when the target images look very different from its training data."
        ),
        list([
          "Compare validation behavior alongside training loss.",
          "Use a confusion matrix to identify commonly mixed classes.",
          "Check memory use and inference time on the target device.",
        ]),
        p(
          "Change one thing at a time. If increasing resolution helps, inspect whether the model is using fine details or simply seeing more background. A class-by-class error review is more useful for your next experiment than a single top-line number."
        ),
      ],
      bn: [
        h("স্থানীয় বিন্যাস থেকে শ্রেণির স্কোর"),
        p(
          "কনভলিউশনে শেখা ফিল্টার ছবির বা ফিচার মানচিত্রের বিভিন্ন স্থানে প্রয়োগ করা হয়। শুরুর স্তর সাধারণ প্রান্ত ও পৃষ্ঠের বিন্যাস ধরতে পারে। পরের স্তর বড় অঞ্চলের তথ্য মেলায়। ফিল্টারের আকার, স্ট্রাইড ও স্তরের গভীরতার ওপর নির্ভর করে একটি স্তর ছবির কতটুকু দেখতে পাবে।"
        ),
        h("যে তুলনার ফল ব্যাখ্যা করা যায়", 3),
        p(
          "একটি ছোট CNN প্রশিক্ষণ দিয়ে একই প্রশিক্ষণ ও বৈধতা যাচাইয়ের ভাগে আগে প্রশিক্ষিত মডেলের সঙ্গে তুলনা করুন। ছবির পূর্বপ্রক্রিয়াকরণ এক রাখুন ও গণনার বাজেট লিখে রাখুন। আগে প্রশিক্ষিত মডেল শুরুতে এগিয়ে থাকতে পারে, তবে নতুন ছবিগুলো দেখতে খুব আলাদা হলে তাকে মানিয়ে নিতে হয়।"
        ),
        list([
          "প্রশিক্ষণ ক্ষতির সঙ্গে বৈধতা যাচাইয়ের আচরণ তুলনা করুন।",
          "কোন শ্রেণিগুলো গুলিয়ে যায়, কনফিউশন ম্যাট্রিক্সে দেখুন।",
          "যে যন্ত্রে মডেল চলবে সেখানে মেমরি ব্যবহার ও একটি ফল আসতে কত সময় লাগে তা মাপুন।",
        ]),
        p(
          "একবারে একটি পরিবর্তন করুন। ছবির রেজোলিউশন বাড়িয়ে লাভ হলে মডেল সূক্ষ্ম বৈশিষ্ট্য ধরছে নাকি বেশি পটভূমি দেখছে, পরীক্ষা করুন। সব শ্রেণির একটি মোট স্কোরের চেয়ে শ্রেণি অনুযায়ী ভুল দেখা পরের পরীক্ষার পরিকল্পনায় বেশি কাজে দেয়।"
        ),
      ],
    },
  },
  {
    id: "the-future-of-artificial-intelligence",
    categories: ["ai", "research", "engineering"],
    date: "2026-08-09",
    cover: 5,
    title: {
      en: "The Future of Artificial Intelligence",
      bn: "কৃত্রিম বুদ্ধিমত্তার ভবিষ্যৎ",
    },
    excerpt: {
      en: "What could make AI systems more useful over the next few years? Three areas are worth watching: evaluation in context, verifiable workflows, and systems that know when to ask for help.",
      bn: "আগামী কয়েক বছরে কীভাবে এআই আরও কাজে লাগতে পারে? প্রেক্ষাপটভিত্তিক মূল্যায়ন, যাচাইযোগ্য কার্যপ্রবাহ এবং কখন সাহায্য চাইতে হবে তা বোঝে এমন সিস্টেম, এই তিন দিকে নজর দেওয়া যায়।",
    },
    tags: {
      en: ["AI evaluation", "Human review", "Accountability"],
      bn: ["এআই মূল্যায়ন", "মানব পর্যালোচনা", "জবাবদিহি"],
    },
    minutes: { en: 2, bn: 2 },
    content: {
      en: [
        h("Evaluate the task in context"),
        p(
          "A strong benchmark can tell us something about model capability. The harder question is whether a system improves a particular workflow for the people using it. Measure what happens after a prediction or draft is delivered, including how often someone corrects it or has to redo the work."
        ),
        h("Make it possible to inspect the work", 3),
        p(
          "A useful system can keep track of which sources informed an answer, which computations were verified, and which steps involved a judgment call. That record helps people review decisions. It also gives teams something concrete to improve when an evaluation fails."
        ),
        h("Design a clear handoff", 3),
        p(
          "Better model quality does not remove the need to handle uncertainty. A system that asks a precise question or hands off at the right time can be easier to trust and operate than one that always replies immediately. Give reviewers enough context to take over without reconstructing the entire task."
        ),
        p(
          "These are design priorities, not predictions. The most informative evidence will come from well-described deployments that report improvements and failure modes together."
        ),
      ],
      bn: [
        h("কাজের প্রেক্ষাপটে মূল্যায়ন করুন"),
        p(
          "ভালো বেঞ্চমার্ক মডেলের ক্ষমতা সম্পর্কে কিছু জানায়। কঠিন প্রশ্ন হলো, ব্যবহারকারীর নির্দিষ্ট কাজের ধারা সিস্টেমটি উন্নত করছে কি না। পূর্বানুমান বা খসড়া দেওয়ার পর কী ঘটে তা মাপুন। কতবার কেউ সংশোধন করেন বা গোটা কাজ আবার করতে হয়, সেটিও ধরুন।"
        ),
        h("কাজ পরীক্ষা করার পথ রাখুন", 3),
        p(
          "উত্তরে কোন সূত্র কাজে লেগেছে, কোন হিসাব যাচাই হয়েছে এবং কোথায় বিচারবুদ্ধি প্রয়োগ হয়েছে, সিস্টেমটি তা লিখে রাখতে পারে। এই নথি সিদ্ধান্ত পর্যালোচনায় সাহায্য করে। মূল্যায়নে ভুল ধরা পড়লে দলও বুঝতে পারে নির্দিষ্ট কোন জায়গায় উন্নতি দরকার।"
        ),
        h("দায়িত্ব হস্তান্তরের স্পষ্ট ব্যবস্থা", 3),
        p(
          "মডেল ভালো হলেও অনিশ্চয়তা সামলানোর প্রয়োজন থাকে। সব সময় সঙ্গে সঙ্গে উত্তর দেওয়ার চেয়ে সুনির্দিষ্ট প্রশ্ন করতে পারে বা ঠিক সময়ে মানুষের হাতে কাজ তুলে দেয় এমন সিস্টেম পরিচালনা করা সহজ হতে পারে। পর্যালোচককে এতটা প্রেক্ষাপট দিন যাতে তাঁকে গোটা কাজ নতুন করে বুঝতে না হয়।"
        ),
        p(
          "এগুলো পূর্বাভাস নয়, নকশার অগ্রাধিকার। কোথায় উন্নতি হয়েছে এবং কোথায় ব্যর্থতা রয়ে গেছে, দুই দিকই জানায় এমন বাস্তব ব্যবহারের বিবরণ থেকে সবচেয়ে বেশি শেখা যাবে।"
        ),
      ],
    },
  },
]
