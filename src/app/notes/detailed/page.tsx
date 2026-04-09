'use client';

import { useState, useEffect, Suspense } from "react";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { TestPaywall } from "@/components/test-paywall";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ─── DATA ────────────────────────────────────────────────────────────────────

const MODULES = [
  {
    id: 1,
    title: "Teaching & Training",
    color: "#1B4F72",
    accent: "#D6EAF8",
    sections: [
      {
        heading: "1.1 Concept of Teaching",
        content: [
          { type: "para", text: "Teaching is a complex, interactive process involving the planned transmission of knowledge, skills, and values from an instructor to learners. It is not merely telling or lecturing — it is facilitating understanding." },
          { type: "h3", text: "Key Definitions" },
          { type: "keyterm", term: "Teaching (Narrow Sense)", def: "Imparting information, instruction, or knowledge to a learner." },
          { type: "keyterm", term: "Teaching (Broader Sense)", def: "A three-way interactive process involving the teacher, the learner, and the curriculum/content, aimed at bringing about desired changes in learner behaviour." },
          { type: "keyterm", term: "Training", def: "A structured process of acquiring specific skills or behaviours through practice and repetition. More task-specific than teaching." },
          { type: "h3", text: "Characteristics of Good Teaching" },
          { type: "bullet", text: "Goal-directed: every teaching session has clear, measurable objectives" },
          { type: "bullet", text: "Interactive: involves two-way communication between teacher and learner" },
          { type: "bullet", text: "Adaptive: teacher adjusts methods based on learner responses" },
          { type: "bullet", text: "Evaluative: involves continuous feedback and assessment" },
          { type: "bullet", text: "Motivating: stimulates curiosity and desire to learn" },
        ]
      },
      {
        heading: "1.2 Objectives of Teaching",
        content: [
          { type: "para", text: "Teaching objectives define what learners are expected to know, understand, or be able to do after instruction. They operate at three levels:" },
          { type: "h3", text: "Bloom's Taxonomy — Cognitive Domain" },
          { type: "boldbullet", term: "Knowledge (Remember)", def: "Recall facts, terms, and basic concepts — e.g., define Vata, list the eight limbs of Ashtanga Yoga" },
          { type: "boldbullet", term: "Comprehension (Understand)", def: "Explain ideas in one's own words — e.g., explain the principles of Panchakarma" },
          { type: "boldbullet", term: "Application (Apply)", def: "Use knowledge in new situations — e.g., apply dosha theory to a clinical case" },
          { type: "boldbullet", term: "Analysis (Analyse)", def: "Break information into components — e.g., differentiate between types of Prakriti" },
          { type: "boldbullet", term: "Synthesis/Evaluation (Evaluate)", def: "Make judgments and justify decisions — e.g., evaluate which treatment protocol is most appropriate" },
          { type: "boldbullet", term: "Creation (Create)", def: "Produce new work — e.g., design a research study on Rasayana therapy" },
          { type: "note", text: "In NTET context, clinical teaching in ISM emphasizes Application and Analysis levels, since students must apply classical theories to real patient scenarios." },
        ]
      },
      {
        heading: "1.3 Levels of Teaching",
        content: [
          { type: "h3", text: "Memory Level (Herbartian Level)" },
          { type: "para", text: "The lowest level of teaching. The teacher presents information and learners are expected to memorize it without necessarily understanding." },
          { type: "bullet", text: "Emphasis on rote learning and repetition" },
          { type: "bullet", text: "Teacher is active; learner is passive" },
          { type: "bullet", text: "Useful for learning classical shlokas, drug names, anatomical terms" },
          { type: "h3", text: "Understanding Level (Morrison Level)" },
          { type: "para", text: "The learner grasps the meaning, relationship, and significance of facts. Goes beyond memorization to comprehension." },
          { type: "bullet", text: "Learner understands principles, not just facts" },
          { type: "bullet", text: "Involves teaching for relationships and cause-effect" },
          { type: "bullet", text: "Useful for understanding pharmacological actions of Ayurvedic herbs" },
          { type: "h3", text: "Reflective Level (Hunt Level)" },
          { type: "para", text: "The highest level of teaching. Learner is engaged in critical thinking, problem-solving, and evaluation." },
          { type: "bullet", text: "Learner applies knowledge to novel, complex problems" },
          { type: "bullet", text: "Involves analysis, synthesis, and evaluation" },
          { type: "bullet", text: "Essential for clinical decision-making in ISM practice" },
          { type: "note", text: "Reflective level teaching is increasingly important in AYUSH education as practitioners must integrate classical knowledge with modern clinical evidence." },
        ]
      },
      {
        heading: "1.4 Teaching Methods",
        content: [
          { type: "h3", text: "Traditional / Classical Methods" },
          { type: "boldbullet", term: "Lecture Method", def: "Teacher-centred; most common in large classes. Effective for content delivery but low interaction. Can include demonstrations." },
          { type: "boldbullet", term: "Demonstration", def: "Teacher shows procedure while explaining steps. Critical in ISM for clinical procedures, pulse diagnosis, Panchakarma techniques." },
          { type: "boldbullet", term: "Tutorial", def: "Small-group discussion led by teacher. Encourages critical thinking and student participation." },
          { type: "boldbullet", term: "Seminar", def: "Students present on assigned topics; peer learning. Develops communication and research skills." },
          { type: "boldbullet", term: "Case-Based Learning (CBL)", def: "Real or simulated patient cases are discussed to integrate theory with practice." },
          { type: "h3", text: "Modern / Active Learning Methods" },
          { type: "boldbullet", term: "Problem-Based Learning (PBL)", def: "Students learn by solving complex real-world problems with minimal direct instruction. Promotes self-directed learning." },
          { type: "boldbullet", term: "Flipped Classroom", def: "Learners study content at home (videos/readings); class time is used for discussion and application." },
          { type: "boldbullet", term: "Simulation", def: "Controlled replication of clinical scenarios. Allows practice without risk to real patients." },
          { type: "boldbullet", term: "Role Play", def: "Students enact doctor-patient or teacher-student interactions. Builds empathy and communication skills." },
          { type: "boldbullet", term: "Think-Pair-Share", def: "Students think individually, then discuss in pairs, then share with the class. Promotes active participation." },
        ]
      },
      {
        heading: "1.5 Basic Teaching Skills (Microteaching)",
        content: [
          { type: "para", text: "Microteaching is a teacher-training technique where skills are practiced in a scaled-down environment (small group, short time)." },
          { type: "boldbullet", term: "Skill of Introduction", def: "Generating learner readiness and interest at the start of a lesson using hooks, questions, or demonstrations" },
          { type: "boldbullet", term: "Skill of Explaining", def: "Breaking down complex concepts clearly with examples, analogies, and logical sequencing" },
          { type: "boldbullet", term: "Skill of Questioning", def: "Using probing, divergent, and carnivorous questions to stimulate thinking and check understanding" },
          { type: "boldbullet", term: "Skill of Reinforcement", def: "Providing positive feedback (verbal, non-verbal) to encourage desired learner behaviour" },
          { type: "boldbullet", term: "Skill of Stimulus Variation", def: "Changing teaching stimuli (voice, movement, visual aids) to maintain attention" },
          { type: "boldbullet", term: "Skill of Closure", def: "Summarising the lesson and linking to future learning to consolidate understanding" },
          { type: "boldbullet", term: "Skill of Illustration", def: "Using examples, analogies, and demonstrations to make abstract content concrete" },
        ]
      },
      {
        heading: "1.6 Learner Characteristics",
        content: [
          { type: "h3", text: "Adolescent Learners (UG Medical Students)" },
          { type: "para", text: "Undergraduate ISM students (18–22 years) are typically adolescent-to-young-adult learners with the following characteristics:" },
          { type: "bullet", text: "Academic: Motivated by grades; learning is often surface-level unless intrinsically motivated" },
          { type: "bullet", text: "Social: Peer relationships strongly influence behaviour; collaborative learning is effective" },
          { type: "bullet", text: "Emotional: Prone to anxiety, particularly around clinical postings and exams" },
          { type: "bullet", text: "Cognitive: Abstract thinking is developing; benefit from concrete clinical examples" },
          { type: "bullet", text: "Identity development: Forming professional identity as a doctor of ISM" },
          { type: "h3", text: "Adult Learners (PG Students, Faculty in Training)" },
          { type: "bullet", text: "Self-directed: Prefer to take ownership of their learning goals" },
          { type: "bullet", text: "Experience-rich: Bring prior clinical and life experience to the classroom" },
          { type: "bullet", text: "Goal-oriented: Learn best when content is directly relevant to their professional role" },
          { type: "bullet", text: "Internally motivated: Driven by professional development rather than just grades" },
          { type: "bullet", text: "Problem-centred: Prefer learning organized around real clinical problems" },
          { type: "note", text: "NTET candidates are themselves adult learners — understanding andragogy is critical for their own exam preparation as well as their future teaching." },
        ]
      },
      {
        heading: "1.7 Factors Affecting Teaching",
        content: [
          { type: "h3", text: "Teacher-Related Factors" },
          { type: "bullet", text: "Subject mastery and command over content" },
          { type: "bullet", text: "Pedagogical skills and teaching experience" },
          { type: "bullet", text: "Personality, enthusiasm, and communication ability" },
          { type: "bullet", text: "Ability to adapt to diverse learners" },
          { type: "h3", text: "Learner-Related Factors" },
          { type: "bullet", text: "Prior knowledge and academic background" },
          { type: "bullet", text: "Learning style preferences (VARK)" },
          { type: "bullet", text: "Motivation — intrinsic vs extrinsic" },
          { type: "bullet", text: "Physical and psychological readiness" },
          { type: "bullet", text: "Socio-cultural background" },
          { type: "h3", text: "Support Material Factors" },
          { type: "bullet", text: "Availability of textbooks, reference materials" },
          { type: "bullet", text: "Access to digital resources and e-learning platforms" },
          { type: "bullet", text: "Quality of visual aids — models, charts, cadavers, specimens" },
          { type: "h3", text: "Environmental Factors" },
          { type: "bullet", text: "Physical environment: classroom size, ventilation, seating arrangement" },
          { type: "bullet", text: "Psychological environment: safety, inclusivity, respect" },
          { type: "bullet", text: "Institutional culture: encouragement of academic discussion" },
        ]
      },
      {
        heading: "1.8 Clinical & Bedside Teaching Methods",
        content: [
          { type: "para", text: "Clinical teaching is unique to medical education and is especially critical in ISM, where traditional techniques like Nadi Pariksha, Ashtavidha Pariksha, and Panchakarma must be demonstrated and practiced." },
          { type: "boldbullet", term: "Bedside Teaching", def: "Teaching conducted at the patient's bedside. Integrates history-taking, examination, and diagnosis in real time. Core to ISM clinical training." },
          { type: "boldbullet", term: "Ward Rounds", def: "Supervised teaching during clinical rounds. Faculty demonstrate clinical reasoning and patient interaction." },
          { type: "boldbullet", term: "OPD-Based Teaching", def: "High patient volume in OPDs provides exposure to diverse case presentations. Faculty supervise student consultations." },
          { type: "boldbullet", term: "One-Minute Preceptor", def: "A rapid 5-step teaching model: (1) Get a commitment, (2) Probe for supporting evidence, (3) Teach a general rule, (4) Reinforce positives, (5) Correct mistakes" },
          { type: "boldbullet", term: "SNAPPS Model", def: "Learner-centred clinical teaching: Summarize, Narrow differentials, Analyse, Probe, Plan, Select a learning issue" },
          { type: "note", text: "Clinical teaching in ISM must balance classical Ayurvedic/Unani/Siddha diagnostic principles with modern clinical reasoning. Effective ISM faculty integrate both seamlessly." },
        ]
      },
      {
        heading: "1.9 VARK Learning Styles",
        content: [
          { type: "para", text: "VARK is a model developed by Neil Fleming that categorizes learner preferences for receiving and processing information:" },
          { type: "boldbullet", term: "Visual (V)", def: "Prefer diagrams, charts, concept maps, flowcharts. In ISM context: anatomical diagrams, drug classification charts, Panchakarma flowcharts." },
          { type: "boldbullet", term: "Aural/Auditory (A)", def: "Prefer listening — lectures, discussions, podcasts, group study. Benefit from verbal explanations of classical shloka meanings." },
          { type: "boldbullet", term: "Read/Write (R)", def: "Prefer text-based learning — reading textbooks, writing notes, making lists. Excel in traditional ISM rote-learning contexts." },
          { type: "boldbullet", term: "Kinesthetic (K)", def: "Prefer hands-on experience — clinical procedures, lab practicals, simulations. Essential for learning Panchakarma, Nadi Pariksha." },
          { type: "note", text: "Most learners have a multimodal VARK profile. Effective ISM teachers design sessions that accommodate all four styles — using diagrams (V), demonstrations (A+K), and written summaries (R)." },
        ]
      },
    ]
  },
  {
    id: 2,
    title: "Communication",
    color: "#1A5276",
    accent: "#D5D8DC",
    sections: [
      {
        heading: "2.1 Meaning & Definition of Communication",
        content: [
          { type: "para", text: "Communication is the process of transmitting information, ideas, emotions, or meaning from one person (sender) to another (receiver) through a medium, resulting in shared understanding." },
          { type: "keyterm", term: "Communication", def: "A dynamic, two-way process of sharing meaning between sender and receiver through a channel, with feedback completing the loop." },
          { type: "h3", text: "Elements of the Communication Process" },
          { type: "boldbullet", term: "Sender", def: "The person who initiates the message (teacher/doctor)" },
          { type: "boldbullet", term: "Message", def: "The content/information being communicated" },
          { type: "boldbullet", term: "Encoding", def: "Converting thought into language, symbols, or gestures" },
          { type: "boldbullet", term: "Channel", def: "The medium through which the message travels (speech, writing, body language)" },
          { type: "boldbullet", term: "Receiver", def: "The person who receives and interprets the message (student/patient)" },
          { type: "boldbullet", term: "Decoding", def: "The receiver's interpretation of the message" },
          { type: "boldbullet", term: "Feedback", def: "The receiver's response — confirms or corrects understanding" },
          { type: "boldbullet", term: "Noise", def: "Any interference that distorts the message (physical, psychological, semantic, cultural)" },
        ]
      },
      {
        heading: "2.2 Types of Communication",
        content: [
          { type: "h3", text: "Verbal Communication" },
          { type: "boldbullet", term: "Oral Communication", def: "Face-to-face conversation, lectures, discussions, telephone. Immediate feedback possible." },
          { type: "boldbullet", term: "Written Communication", def: "Prescriptions, case records, textbooks, emails. Permanent and can be referred to later." },
          { type: "h3", text: "Non-Verbal Communication" },
          { type: "para", text: "Conveys meaning without words. Often more powerful than verbal communication." },
          { type: "boldbullet", term: "Kinesics", def: "Body movements — gestures, posture, facial expressions. A nod = agreement; crossed arms = defensiveness." },
          { type: "boldbullet", term: "Proxemics", def: "Use of personal space. Edward Hall's four zones: Intimate (0–18 inches), Personal (18 inches–4 feet), Social (4–12 feet), Public (12+ feet)." },
          { type: "boldbullet", term: "Paralanguage", def: "Vocal qualities — tone, pitch, pace, volume, pauses. How something is said matters as much as what is said." },
          { type: "boldbullet", term: "Haptics", def: "Communication through touch — handshake, reassuring pat. Important in doctor-patient relationships." },
          { type: "boldbullet", term: "Oculesics", def: "Eye contact. Maintains attention, shows respect, signals confidence." },
          { type: "boldbullet", term: "Chronemics", def: "Use of time — punctuality, pace of speech. Cultural interpretations vary." },
          { type: "h3", text: "Formal vs Informal Communication" },
          { type: "boldbullet", term: "Formal", def: "Follows official channels — faculty-student academic communication, institutional memos, case presentations" },
          { type: "boldbullet", term: "Informal", def: "Casual interaction — corridor conversations, peer discussions, social media groups" },
        ]
      },
      {
        heading: "2.3 Characteristics of Effective Communication",
        content: [
          { type: "bullet", text: "Clarity: message is unambiguous and easy to understand" },
          { type: "bullet", text: "Conciseness: delivers the message without unnecessary information" },
          { type: "bullet", text: "Completeness: all relevant information is included" },
          { type: "bullet", text: "Correctness: factually accurate and free of errors" },
          { type: "bullet", text: "Courtesy: respectful and considerate of the receiver's perspective" },
          { type: "bullet", text: "Concreteness: specific, with evidence and examples rather than vague generalities" },
          { type: "bullet", text: "Coherence: logically organized and connected" },
        ]
      },
      {
        heading: "2.4 Barriers to Communication",
        content: [
          { type: "h3", text: "Physical Barriers" },
          { type: "bullet", text: "Noise in the environment (traffic, poor acoustics, distractions)" },
          { type: "bullet", text: "Distance between teacher and learner" },
          { type: "bullet", text: "Poor lighting or visibility of teaching aids" },
          { type: "bullet", text: "Technical failures in digital communication" },
          { type: "h3", text: "Psychological Barriers" },
          { type: "bullet", text: "Prejudice or bias — preconceived notions about the speaker or topic" },
          { type: "bullet", text: "Emotional state — anxiety, anger, or sadness interferes with receiving messages" },
          { type: "bullet", text: "Selective perception — hearing only what confirms existing beliefs" },
          { type: "bullet", text: "Information overload — too much content delivered too quickly" },
          { type: "h3", text: "Semantic Barriers" },
          { type: "bullet", text: "Use of jargon or technical terminology unfamiliar to the learner" },
          { type: "bullet", text: "Ambiguous language — words with multiple meanings" },
          { type: "bullet", text: "Different interpretations of the same word in different cultures" },
          { type: "bullet", text: "In ISM: Sanskrit shloka-based teaching may create semantic barriers for students without classical background" },
          { type: "h3", text: "Cultural Barriers" },
          { type: "bullet", text: "Differences in communication norms (eye contact, personal space, directness)" },
          { type: "bullet", text: "Language barriers in multilingual classrooms" },
          { type: "bullet", text: "Cultural taboos around discussing certain diseases or body parts" },
          { type: "h3", text: "Organisational Barriers" },
          { type: "bullet", text: "Rigid hierarchies that discourage questions from students" },
          { type: "bullet", text: "Information filtered as it passes through layers of administration" },
          { type: "bullet", text: "Lack of feedback mechanisms" },
        ]
      },
      {
        heading: "2.5 Inter-Cultural Communication",
        content: [
          { type: "para", text: "Inter-cultural communication involves exchanging information between people from different cultural backgrounds. In ISM colleges, teachers encounter students from diverse states, languages, and cultural backgrounds." },
          { type: "h3", text: "Key Dimensions (Hofstede's Model)" },
          { type: "boldbullet", term: "Power Distance", def: "High PD cultures (common in India) accept hierarchy; low PD cultures expect equality. This affects how students question teachers." },
          { type: "boldbullet", term: "Individualism vs Collectivism", def: "Collectivist cultures (India) prefer group learning; individualist cultures prefer independent work." },
          { type: "boldbullet", term: "Uncertainty Avoidance", def: "High UA learners prefer structured, rule-based teaching; low UA learners are comfortable with ambiguity." },
          { type: "h3", text: "Strategies for Effective Inter-Cultural Communication" },
          { type: "bullet", text: "Use simple, clear language free of region-specific idioms" },
          { type: "bullet", text: "Be aware of and respect cultural norms around gender, religion, and age" },
          { type: "bullet", text: "Encourage diverse perspectives in classroom discussions" },
          { type: "bullet", text: "Use universal examples in addition to region-specific ones" },
        ]
      },
      {
        heading: "2.6 Group Communication",
        content: [
          { type: "para", text: "Group communication involves interaction among three or more people toward a common goal — e.g., group tutorials, case discussions, seminars." },
          { type: "boldbullet", term: "Group Dynamics", def: "The social processes and forces that operate within a group. Includes leadership, norms, cohesion, and conflict." },
          { type: "boldbullet", term: "Groupthink", def: "A phenomenon where desire for conformity suppresses critical thinking. Teachers must encourage dissenting views." },
          { type: "boldbullet", term: "Effective Group Communication Tips", def: "Set clear objectives; assign roles (moderator, note-taker); encourage all voices; manage dominant members; summarize at the end" },
        ]
      },
      {
        heading: "2.7 Mass Media & Society",
        content: [
          { type: "para", text: "Mass media refers to channels that communicate to large audiences simultaneously — TV, radio, print, internet, social media." },
          { type: "h3", text: "Role in ISM Education" },
          { type: "bullet", text: "Online lectures and webinars reach students in remote areas" },
          { type: "bullet", text: "Health information dissemination to public about AYUSH treatments" },
          { type: "bullet", text: "Documentary films on traditional medicine practices" },
          { type: "bullet", text: "Social media for sharing research updates" },
          { type: "h3", text: "Concerns" },
          { type: "bullet", text: "Misinformation about AYUSH treatments on social media" },
          { type: "bullet", text: "Commercialisation and misrepresentation of ISM" },
          { type: "bullet", text: "Digital divide — not all students have equal internet access" },
        ]
      },
      {
        heading: "2.8 Teacher-Learner & Doctor-Patient Communication",
        content: [
          { type: "h3", text: "Teacher-Learner Communication" },
          { type: "para", text: "Effective teacher-learner communication creates a psychological safe space where students can ask questions, make mistakes, and learn." },
          { type: "bullet", text: "Use open-ended questions to stimulate thinking rather than closed yes/no questions" },
          { type: "bullet", text: "Practice active listening — maintain eye contact, nod, summarize student responses" },
          { type: "bullet", text: "Give constructive feedback: specific, timely, balanced between positive and improvement areas" },
          { type: "bullet", text: "Avoid sarcasm, humiliation, or dismissiveness — these destroy psychological safety" },
          { type: "bullet", text: "Be approachable — invite questions and show genuine interest in student progress" },
          { type: "h3", text: "Doctor-Patient Communication (Relevant to ISM Clinical Teaching)" },
          { type: "para", text: "ISM faculty must model and teach effective doctor-patient communication during clinical postings." },
          { type: "bullet", text: "Build rapport: introduce yourself, use the patient's name, show empathy" },
          { type: "bullet", text: "Use plain language: avoid medical jargon when speaking to patients" },
          { type: "bullet", text: "Explain diagnosis and treatment in terms the patient can understand" },
          { type: "bullet", text: "Ensure informed consent — patient understands procedures and risks" },
          { type: "bullet", text: "Cultural sensitivity — respect patient's beliefs, including their faith in traditional medicine" },
          { type: "note", text: "In the NTET exam, Teacher-Learner communication and Doctor-Patient communication are often tested together as the ISM faculty must model both types simultaneously during clinical teaching." },
        ]
      },
    ]
  },
  {
    id: 3,
    title: "Classroom Management",
    color: "#145A32",
    accent: "#D5F5E3",
    sections: [
      {
        heading: "3.1 Concept of Classroom Management",
        content: [
          { type: "para", text: "Classroom management refers to the set of skills, strategies, and techniques a teacher uses to maintain a positive, productive, and organized learning environment. It encompasses physical setup, time management, student engagement, and discipline." },
          { type: "keyterm", term: "Classroom Management", def: "A broad concept encompassing all teacher actions and decisions to create an environment that facilitates learning — including physical arrangement, rules, routines, student engagement strategies, and responses to misbehaviour." },
        ]
      },
      {
        heading: "3.2 Classroom Management Strategies",
        content: [
          { type: "h3", text: "Preventive Strategies (Proactive)" },
          { type: "para", text: "Implemented before problems arise to create a positive learning environment." },
          { type: "boldbullet", term: "Clear Rules and Routines", def: "Establish expectations at the start of the academic year. Post rules prominently. Consistently enforce them." },
          { type: "boldbullet", term: "Effective Planning", def: "Well-prepared lessons minimize off-task time. Transitions between activities should be smooth and quick." },
          { type: "boldbullet", term: "Positive Classroom Climate", def: "Greet students, use names, celebrate achievements. Students who feel valued behave better." },
          { type: "boldbullet", term: "Proximity Control", def: "Move around the classroom rather than staying at the front. Physical presence near students reduces off-task behaviour." },
          { type: "boldbullet", term: "Strategic Seating", def: "Seat students with attention or behaviour issues near the front. Arrange seating to facilitate the intended activity (U-shape for discussion, rows for lectures)." },
          { type: "h3", text: "Supportive Strategies (Reactive)" },
          { type: "para", text: "Implemented in response to emerging issues to redirect behaviour." },
          { type: "boldbullet", term: "Nonverbal Cues", def: "Eye contact, a gentle hand gesture, or moving closer to a disruptive student without interrupting the lesson" },
          { type: "boldbullet", term: "Redirection", def: "Engage an off-task student with a question relevant to the lesson" },
          { type: "boldbullet", term: "Behaviour-Specific Praise", def: "Recognise desired behaviour immediately and specifically — 'Thank you for raising your hand, Priya'" },
          { type: "boldbullet", term: "Private Correction", def: "Address misbehaviour quietly and individually rather than publicly humiliating the student" },
        ]
      },
      {
        heading: "3.3 Engagement & Motivation Strategies",
        content: [
          { type: "h3", text: "Theories of Motivation" },
          { type: "boldbullet", term: "Maslow's Hierarchy of Needs", def: "Students cannot engage academically if lower-order needs (safety, belonging) are unmet. ISM teachers must ensure a physically and psychologically safe classroom." },
          { type: "boldbullet", term: "Self-Determination Theory (Deci & Ryan)", def: "People are motivated when three basic psychological needs are met: Autonomy (choice), Competence (feeling capable), and Relatedness (feeling connected)." },
          { type: "boldbullet", term: "Expectancy-Value Theory", def: "Students are motivated when they believe they can succeed (expectancy) AND when they find the task valuable (value). Make content relevant to students' future clinical practice." },
          { type: "h3", text: "Practical Engagement Strategies" },
          { type: "bullet", text: "Use varied teaching methods — alternate lecture with discussion, demonstration, case studies" },
          { type: "bullet", text: "Connect content to real-world clinical scenarios relevant to ISM practice" },
          { type: "bullet", text: "Use technology — interactive quizzes (Kahoot, Mentimeter), video demonstrations" },
          { type: "bullet", text: "Gamification — points, leaderboards, badge systems for participation" },
          { type: "bullet", text: "Collaborative learning — pair work, small group discussions, jigsaws" },
          { type: "bullet", text: "Student choice — allow students to choose topics for seminars or case presentations" },
        ]
      },
      {
        heading: "3.4 Creating Positive Learning Environments",
        content: [
          { type: "h3", text: "Physical Environment" },
          { type: "bullet", text: "Adequate lighting, ventilation, and temperature control" },
          { type: "bullet", text: "Accessible seating for students with disabilities" },
          { type: "bullet", text: "Visible teaching aids, bulletin boards with relevant academic content" },
          { type: "bullet", text: "Clean and organised clinical labs and simulation centres" },
          { type: "h3", text: "Psychological Environment" },
          { type: "bullet", text: "Psychological safety: students feel safe to ask questions, make mistakes, and disagree respectfully" },
          { type: "bullet", text: "Growth mindset culture: intelligence and skill can be developed through effort" },
          { type: "bullet", text: "Inclusive: all students — regardless of gender, caste, region, language — feel equally valued" },
          { type: "bullet", text: "Zero tolerance for bullying, ragging, or harassment" },
        ]
      },
      {
        heading: "3.5 Managing Disciplinary Problems",
        content: [
          { type: "h3", text: "Common Discipline Issues in Medical Colleges" },
          { type: "bullet", text: "Late arrival to clinical postings" },
          { type: "bullet", text: "Mobile phone use during lectures" },
          { type: "bullet", text: "Academic dishonesty — copying in exams, plagiarism" },
          { type: "bullet", text: "Disrespectful behaviour toward faculty or support staff" },
          { type: "bullet", text: "Ragging — a serious legal and ethical issue in Indian medical colleges" },
          { type: "h3", text: "Principles of Effective Discipline" },
          { type: "boldbullet", term: "Consistency", def: "Rules must be enforced the same way for all students, every time" },
          { type: "boldbullet", term: "Immediacy", def: "Address misbehaviour promptly — delays reduce effectiveness" },
          { type: "boldbullet", term: "Dignity", def: "Discipline should correct behaviour, not demean the student" },
          { type: "boldbullet", term: "Proportionality", def: "Consequences should match the severity of the infraction" },
          { type: "boldbullet", term: "Documentation", def: "Keep records of repeated incidents — important for escalation" },
        ]
      },
      {
        heading: "3.6 Managing Diverse Classrooms",
        content: [
          { type: "para", text: "ISM colleges are inherently diverse — students come from different states, languages, educational backgrounds, and cultural practices." },
          { type: "boldbullet", term: "Academic Diversity", def: "Students with different levels of prior knowledge. Strategy: differentiated instruction — varying content complexity." },
          { type: "boldbullet", term: "Linguistic Diversity", def: "Students whose first language may not be Hindi or English. Strategy: use visual aids, bilingual resources, encourage questions in native language." },
          { type: "boldbullet", term: "Gender Diversity", def: "Both male and female students in clinical settings. Strategy: gender-sensitive examples, address gender bias in clinical discussions." },
          { type: "boldbullet", term: "Disability/Special Needs", def: "Students with learning disabilities, physical disabilities, or mental health conditions. Strategy: Universal Design for Learning (UDL)." },
          { type: "boldbullet", term: "Cultural/Religious Diversity", def: "Dietary restrictions, festival obligations, religious observance. Strategy: flexible scheduling, cultural sensitivity in examples." },
        ]
      },
      {
        heading: "3.7 Managing Clinical & Special Environments",
        content: [
          { type: "h3", text: "Clinical Teaching Environments" },
          { type: "boldbullet", term: "OPD (Out-Patient Department)", def: "High patient volume; quick consultations. Assign students specific cases; debrief after each patient; maintain patient confidentiality." },
          { type: "boldbullet", term: "IPD (In-Patient Department) / Wards", def: "Longer patient interactions; ideal for bedside teaching. Ensure patient consent before conducting student teaching rounds." },
          { type: "boldbullet", term: "Panchakarma / Procedure Rooms", def: "Controlled settings for demonstrating invasive ISM procedures. Strict hygiene protocols; demonstrate first, then supervise student practice." },
          { type: "h3", text: "Laboratory Management" },
          { type: "bullet", text: "Clear safety protocols prominently displayed" },
          { type: "bullet", text: "Supervised practicals with defined student roles" },
          { type: "bullet", text: "Regular maintenance and calibration of equipment" },
          { type: "bullet", text: "Herbarium, drug preparation labs — ISM specific; proper specimen labelling" },
          { type: "h3", text: "Community-Based Teaching" },
          { type: "bullet", text: "Village health surveys, rural camps — ISM students must experience community-level medicine" },
          { type: "bullet", text: "Cultural sensitivity when interacting with rural populations" },
          { type: "bullet", text: "Supervise students closely in unfamiliar community settings" },
        ]
      },
    ]
  },
  {
    id: 4,
    title: "Assessment Methods",
    color: "#6E2C00",
    accent: "#FDEBD0",
    sections: [
      {
        heading: "4.1 Concept of Assessment in Education",
        content: [
          { type: "para", text: "Assessment is the systematic process of gathering, interpreting, and using evidence about learner performance to make judgments about the extent of learning and guide future instruction." },
          { type: "h3", text: "Key Distinctions" },
          { type: "table", headers: ["Term", "Definition", "Purpose"], rows: [
            ["Assessment", "Gathering evidence of learning", "Understand where the learner is"],
            ["Evaluation", "Making a value judgment about learning", "Determine quality/worth of performance"],
            ["Measurement", "Quantifying performance (marks, scores)", "Assign a number to performance"],
            ["Testing", "A specific instrument for measurement", "Collect data at a point in time"],
          ]},
        ]
      },
      {
        heading: "4.2 Formative vs Summative Assessment",
        content: [
          { type: "table", headers: ["Feature", "Formative Assessment", "Summative Assessment"], rows: [
            ["Purpose", "Improve learning during the process", "Judge learning at the end of a period"],
            ["Timing", "During instruction (ongoing)", "At the end of a unit, term, or course"],
            ["Stakes", "Low stakes — no formal grades usually", "High stakes — marks, grades, certification"],
            ["Feedback", "Immediate, detailed, specific", "Delayed, summary judgment"],
            ["Examples", "Quizzes, class discussions, MCQ practice", "University exams, board exams, NTET, OSCE"],
            ["ISM Context", "Internal assessment, ward reports, case write-ups", "Final university exam, Roga Nidana practical, OSCE"],
          ]},
        ]
      },
      {
        heading: "4.3 Types of Assessment",
        content: [
          { type: "boldbullet", term: "Diagnostic Assessment", def: "Conducted before instruction to identify learners' prior knowledge and misconceptions. Example: pre-test at the start of a semester." },
          { type: "boldbullet", term: "Criterion-Referenced Assessment", def: "Performance measured against a fixed standard. Example: NTET — must score 50% to qualify, regardless of how others perform." },
          { type: "boldbullet", term: "Norm-Referenced Assessment", def: "Performance measured relative to peers. Example: ranking students within a class." },
          { type: "boldbullet", term: "Continuous/Internal Assessment", def: "Ongoing assessment throughout the academic year — internal exams, assignments, seminars, clinical logs." },
          { type: "boldbullet", term: "Competency-Based Assessment", def: "Assesses ability to perform specific clinical competencies rather than knowledge recall alone. Core to modern ISM education reforms." },
        ]
      },
      {
        heading: "4.4 Assessment in Choice-Based Credit System (CBCS)",
        content: [
          { type: "para", text: "CBCS was introduced in Indian higher education to provide flexibility in course selection and standardize credit-based evaluation across institutions." },
          { type: "h3", text: "Key Features of CBCS Evaluation" },
          { type: "bullet", text: "Credits assigned to each course based on contact hours" },
          { type: "bullet", text: "Grade Point Average (GPA) and Cumulative GPA (CGPA) replace raw marks" },
          { type: "bullet", text: "Continuous Internal Assessment (CIA) contributes 25-40% of total marks" },
          { type: "bullet", text: "End-Semester Examination (ESE) contributes the remaining 60-75%" },
          { type: "bullet", text: "Grade points: O (Outstanding), A+, A, B+, B, C, P, F" },
          { type: "note", text: "NTET-qualified faculty in ISM colleges must understand CBCS evaluation to correctly design internal assessment and grade students. NCISM has been implementing CBCS in ISM curriculum reforms." },
        ]
      },
      {
        heading: "4.5 Computer-Based Testing (CBT)",
        content: [
          { type: "para", text: "CBT is the mode of the NTET examination itself. Understanding CBT is relevant both for the exam and for designing modern assessments in ISM colleges." },
          { type: "h3", text: "Features of CBT" },
          { type: "bullet", text: "Questions delivered on a computer terminal — multiple choice, multiple select" },
          { type: "bullet", text: "Randomization of questions and answer options — reduces copying" },
          { type: "bullet", text: "Immediate provisional results possible after key generation" },
          { type: "bullet", text: "Reduces paper, logistics, and human error in evaluation" },
          { type: "bullet", text: "Accessibility features — larger text, screen readers for differently-abled candidates" },
          { type: "h3", text: "Advantages of CBT in Medical Education" },
          { type: "bullet", text: "Efficient assessment of large batches of students" },
          { type: "bullet", text: "Immediate feedback possible (formative CBT quizzes)" },
          { type: "bullet", text: "Data analytics — identify questions with poor discrimination, revise item bank" },
          { type: "bullet", text: "Standardization across examination centres" },
          { type: "h3", text: "Challenges" },
          { type: "bullet", text: "Digital literacy requirements — students must be comfortable with computers" },
          { type: "bullet", text: "Infrastructure requirement — computers, stable internet, power supply" },
          { type: "bullet", text: "Cannot easily test higher-order procedural skills (for clinical skills, use OSCE)" },
        ]
      },
      {
        heading: "4.6 Clinical Competence Assessment — Miller's Pyramid",
        content: [
          { type: "para", text: "Clinical competence assessment is central to ISM education — future practitioners must be assessed not only on knowledge, but on their ability to perform clinical tasks safely and effectively." },
          { type: "boldbullet", term: "Knows (Knowledge)", def: "Assessed by MCQs, written exams. 'What is the definition of Vata?'" },
          { type: "boldbullet", term: "Knows How (Competence)", def: "Assessed by MEQs (Modified Essay Questions), case vignettes. 'How would you manage a Vata-predominant condition?'" },
          { type: "boldbullet", term: "Shows How (Performance)", def: "Assessed by OSCE, direct observation. 'Demonstrate Nadi Pariksha on this patient.'" },
          { type: "boldbullet", term: "Does (Action)", def: "Assessed by workplace-based assessment — what the student actually does in real clinical settings." },
        ]
      },
      {
        heading: "4.7 OSCE (Objective Structured Clinical Examination)",
        content: [
          { type: "para", text: "OSCE is a structured clinical assessment where students rotate through a series of stations, each testing a specific clinical skill or competency." },
          { type: "h3", text: "Structure of OSCE" },
          { type: "bullet", text: "Multiple stations (typically 8–20), each 3–10 minutes long" },
          { type: "bullet", text: "Each station has a standardized task with a structured checklist" },
          { type: "bullet", text: "Examiner uses the checklist — reduces subjectivity" },
          { type: "bullet", text: "Stations may include: history-taking, clinical examination, procedural skill, communication, interpretation of investigation reports" },
          { type: "h3", text: "ISM-Specific OSCE Stations" },
          { type: "bullet", text: "Demonstrate Nadi Pariksha (pulse examination) — Ayurveda" },
          { type: "bullet", text: "Perform Ashtavidha Pariksha (eight-fold examination)" },
          { type: "bullet", text: "Identify and describe specimens in Dravyaguna (Ayurvedic pharmacognosy)" },
          { type: "bullet", text: "Demonstrate Ilaj-bil-tadbeer (regimenal therapy) — Unani" },
          { type: "bullet", text: "Conduct a doctor-patient communication station for ISM context" },
          { type: "note", text: "OSCE is increasingly being adopted in ISM colleges as part of curriculum reform. NTET-qualified faculty must understand how to design, conduct, and evaluate OSCE stations." },
        ]
      },
      {
        heading: "4.8 Long Case & Short Case Assessment",
        content: [
          { type: "h3", text: "Long Case" },
          { type: "bullet", text: "Student takes a full history, performs examination, arrives at diagnosis and management plan for one patient" },
          { type: "bullet", text: "Duration: 30–60 minutes with the patient, followed by viva-voce with examiners" },
          { type: "bullet", text: "Tests holistic clinical competence and reasoning" },
          { type: "bullet", text: "Limitation: subjectivity and variability between examiners" },
          { type: "h3", text: "Short Case" },
          { type: "bullet", text: "Student examines one or more patients for a focused task (e.g., 'Examine the abdomen of this patient')" },
          { type: "bullet", text: "Duration: 10–15 minutes per case" },
          { type: "bullet", text: "Tests specific examination skills" },
          { type: "bullet", text: "Multiple short cases together provide broader coverage of clinical skills" },
        ]
      },
    ]
  },
  {
    id: 5,
    title: "Educational Technologies",
    color: "#4A235A",
    accent: "#E8DAEF",
    sections: [
      {
        heading: "5.1 ICT in Education — Overview",
        content: [
          { type: "para", text: "ICT encompasses all digital technologies used to create, store, process, and exchange information. In education, ICT transforms both how content is delivered and how students interact with knowledge." },
        ]
      },
      {
        heading: "5.2 Internet in Medical Education",
        content: [
          { type: "boldbullet", term: "Online Databases", def: "PubMed, Google Scholar, Ayush Research Portal — accessing peer-reviewed ISM research" },
          { type: "boldbullet", term: "Digital Libraries", def: "E-books, journal subscriptions — students access Charaka Samhita, Sushruta Samhita, and modern research simultaneously" },
          { type: "boldbullet", term: "Virtual Patients", def: "Online case simulations where students diagnose and manage virtual patients — useful for ISM clinical reasoning training" },
          { type: "boldbullet", term: "Video Lectures", def: "YouTube channels, institutional LMS — recorded lectures accessible anytime, anywhere" },
          { type: "boldbullet", term: "Collaborative Tools", def: "Google Workspace, Microsoft Teams — group assignments, peer review, faculty collaboration" },
        ]
      },
      {
        heading: "5.3 Intranet in Educational Institutions",
        content: [
          { type: "para", text: "An intranet is a private internal network within an institution. In ISM colleges, intranets provide:" },
          { type: "bullet", text: "Secure access to course materials, timetables, and faculty resources" },
          { type: "bullet", text: "Internal communication between faculty and students" },
          { type: "bullet", text: "Hospital Information Systems (HIS) for clinical record access" },
          { type: "bullet", text: "Internal assessment portals" },
        ]
      },
      {
        heading: "5.4 Email as an Educational Tool",
        content: [
          { type: "bullet", text: "Formal communication channel between faculty and students" },
          { type: "bullet", text: "Submitting assignments and receiving feedback" },
          { type: "bullet", text: "Institutional announcements and notifications" },
          { type: "bullet", text: "Professional email etiquette should be taught as part of ISM professional development" },
        ]
      },
      {
        heading: "5.5 Audio/Video Conferencing",
        content: [
          { type: "boldbullet", term: "Synchronous Learning", def: "Live, real-time interaction via Zoom, Google Meet, Microsoft Teams. Allows geographically dispersed students to attend lectures." },
          { type: "boldbullet", term: "Webinars", def: "Large-scale online seminars — useful for national/international expert guest lectures on ISM topics" },
          { type: "boldbullet", term: "Telemedicine in ISM", def: "AYUSH practitioners increasingly deliver remote consultations. Understanding video communication technology is professionally relevant." },
          { type: "boldbullet", term: "Recorded Sessions", def: "Faculty record lectures; students revisit complex topics — especially useful for understanding complex classical texts" },
        ]
      },
      {
        heading: "5.6 Online vs Offline Teaching Methods",
        content: [
          { type: "table", headers: ["Feature", "Online Teaching", "Offline (Face-to-Face) Teaching"], rows: [
            ["Flexibility", "High — asynchronous options available", "Low — fixed time and location"],
            ["Interaction", "Limited (text chat, breakout rooms)", "Rich — body language, immediate feedback"],
            ["Clinical Skills", "Cannot replace hands-on training", "Essential for procedures, OSCEs, labs"],
            ["Reach", "Can reach students anywhere globally", "Limited to students on campus"],
            ["Technology", "High — requires device and internet", "Low — classroom and teacher"],
            ["Best For", "Theory, conceptual content, flipped prep", "Clinical teaching, practical skills, case discussions"],
          ]},
        ]
      },
      {
        heading: "5.7 SWAYAM & MOOCs",
        content: [
          { type: "para", text: "SWAYAM (Study Webs of Active Learning for Young Aspiring Minds) is the Government of India's platform for free online courses offered by Indian universities and institutions." },
          { type: "h3", text: "Key Features of SWAYAM" },
          { type: "bullet", text: "Free access to courses from IITs, IIMs, central universities" },
          { type: "bullet", text: "Video lectures, reading material, self-assessment quizzes, discussion forums" },
          { type: "bullet", text: "Courses credit-transferable to formal degrees (credit transfer policy)" },
          { type: "bullet", text: "Some AYUSH and medical education courses available" },
          { type: "h3", text: "MOOCs (Massive Open Online Courses)" },
          { type: "boldbullet", term: "Global Platforms", def: "Coursera, edX, FutureLearn — international courses on medical education, pedagogy, clinical skills" },
          { type: "boldbullet", term: "Benefits for ISM Faculty", def: "Access to cutting-edge teaching methodologies, medical education courses, and global research" },
          { type: "boldbullet", term: "Key Characteristics", def: "Massive scale (thousands of students), Open access, Online delivery, Structured course format" },
          { type: "note", text: "NTET candidates should be familiar with both SWAYAM and MOOCs as the ISM education ecosystem increasingly integrates these platforms for faculty development and student learning." },
        ]
      },
      {
        heading: "5.8 Teaching Support Systems",
        content: [
          { type: "h3", text: "Traditional Teaching Aids" },
          { type: "boldbullet", term: "Blackboard/Whiteboard", def: "Flexible, interactive, allows real-time diagramming. Still widely used in Indian ISM colleges." },
          { type: "boldbullet", term: "Charts, Models, Specimens", def: "Anatomical models, Dravyaguna specimens, herbal herbarium — essential for ISM visual learning" },
          { type: "boldbullet", term: "Flash Cards", def: "Quick recall aids — especially useful for drug names, properties (Rasa, Guna, Virya, Vipaka), and classical shloka associations" },
          { type: "h3", text: "Modern Teaching Aids" },
          { type: "boldbullet", term: "LCD Projector / Smart Board", def: "Projects digital presentations, videos, live internet demonstrations" },
          { type: "boldbullet", term: "PowerPoint Presentations", def: "Most common modern teaching aid in ISM colleges — should follow principles of visual design (minimal text, high-quality images)" },
          { type: "boldbullet", term: "Videos/Animations", def: "Demonstrate procedures (Panchakarma therapies, Unani Ilaj methods), clinical examinations, pharmacological actions" },
          { type: "h3", text: "ICT-Based Teaching Aids" },
          { type: "boldbullet", term: "Learning Management Systems (LMS)", def: "Moodle, Google Classroom — centralize course content, assignments, grades, and communication" },
          { type: "boldbullet", term: "Interactive Response Systems", def: "Clickers, Kakoot, Mentimeter — real-time student response during lectures to check understanding" },
          { type: "boldbullet", term: "Virtual Reality (VR)", def: "Emerging technology — 3D anatomical exploration, virtual Panchakarma procedure simulation" },
          { type: "boldbullet", term: "Podcasts & Audio Resources", def: "Accessible learning for commuting students — Sanskrit shloka recitations, conceptual explanations" },
        ]
      },
    ]
  },
  {
    id: 6,
    title: "Educational Psychology",
    color: "#922B21",
    accent: "#FADBD8",
    sections: [
      {
        heading: "6.1 Educational Psychology as a Discipline",
        content: [
          { type: "keyterm", term: "Educational Psychology", def: "A branch of psychology that applies psychological principles, theories, and research methods to the study of human learning, instruction, and education. It bridges psychology and educational practice." },
          { type: "h3", text: "Scope of Educational Psychology" },
          { type: "bullet", text: "Understanding learner characteristics — cognitive, emotional, social development" },
          { type: "bullet", text: "Study of learning processes — how knowledge is acquired, retained, and transferred" },
          { type: "bullet", text: "Instructional design — applying psychological principles to create effective teaching" },
          { type: "bullet", text: "Assessment and evaluation — measuring learning outcomes" },
          { type: "bullet", text: "Motivation and engagement — understanding what drives or inhibits learning" },
          { type: "bullet", text: "Classroom management — using behaviour principles to maintain order" },
          { type: "bullet", text: "Individual differences — addressing diverse learning needs" },
        ]
      },
      {
        heading: "6.2 Cognitive Development: Piaget's Theory",
        content: [
          { type: "para", text: "Jean Piaget proposed that children move through four sequential stages of cognitive development, each characterized by different ways of thinking." },
          { type: "table", headers: ["Stage", "Age Range", "Key Characteristics", "ISM Relevance"], rows: [
            ["Sensorimotor", "0–2 years", "Object permanence; learning through senses and motor action", "Not directly relevant to ISM students"],
            ["Preoperational", "2–7 years", "Symbolic thinking; egocentric; cannot yet think logically", "Not directly relevant"],
            ["Concrete Operational", "7–11 years", "Logical thinking about concrete objects; conservation", "Background for understanding how thinking develops"],
            ["Formal Operational", "12+ years", "Abstract, hypothetical thinking; systematic reasoning", "ISM students (18+) operate at this stage — can handle classical ISM theory and clinical reasoning"],
          ]},
          { type: "h3", text: "Implications for ISM Teaching" },
          { type: "bullet", text: "Students in ISM colleges are formal operational thinkers — capable of abstract and hypothetical reasoning" },
          { type: "bullet", text: "Use case-based learning to engage formal operational thinking" },
          { type: "bullet", text: "Challenge students with complex, open-ended clinical problems rather than rote memorization" },
          { type: "bullet", text: "Recognize that ISM classical texts require abstract interpretation — scaffolding is important" },
        ]
      },
      {
        heading: "6.3 Vygotsky's Sociocultural Theory",
        content: [
          { type: "para", text: "Lev Vygotsky emphasized the social nature of learning — knowledge is constructed through interaction with others and through cultural tools like language." },
          { type: "h3", text: "Key Concepts" },
          { type: "boldbullet", term: "Zone of Proximal Development (ZPD)", def: "The gap between what a learner can do independently and what they can do with guidance. Effective teaching targets the ZPD." },
          { type: "boldbullet", term: "Scaffolding", def: "Temporary support provided by a more knowledgeable other (teacher, peer) to help the learner accomplish tasks beyond their independent ability. Support is gradually withdrawn as competence grows." },
          { type: "boldbullet", term: "More Knowledgeable Other (MKO)", def: "Anyone with greater knowledge or skill — teacher, senior student, or even an educational resource. In ISM, senior residents and faculty serve as MKOs during clinical training." },
          { type: "boldbullet", term: "Internalization", def: "Social learning becomes internal cognitive function through practice and reflection." },
          { type: "h3", text: "Implications for ISM Teaching" },
          { type: "bullet", text: "Identify each student's ZPD through formative assessment — neither too easy nor too difficult" },
          { type: "bullet", text: "Use scaffolding in clinical teaching: demonstrate → guide → observe → release" },
          { type: "bullet", text: "Promote peer learning — students in Vygotsky's model can be each other's MKOs" },
          { type: "bullet", text: "Group clinical discussions help students learn through social discourse" },
        ]
      },
      {
        heading: "6.4 Bronfenbrenner's Ecological Systems Theory",
        content: [
          { type: "para", text: "Urie Bronfenbrenner proposed that human development is shaped by multiple nested environmental systems, each interacting with the others." },
          { type: "h3", text: "Five Systems" },
          { type: "boldbullet", term: "Microsystem", def: "Direct environments — family, classroom, clinical ward. Most immediate influence on the learner." },
          { type: "boldbullet", term: "Mesosystem", def: "Connections between microsystems — e.g., relationship between home life and college performance" },
          { type: "boldbullet", term: "Exosystem", def: "Indirect environments that affect the learner — college management policies, NMC/NCISM regulations" },
          { type: "boldbullet", term: "Macrosystem", def: "Cultural and societal beliefs — attitudes toward AYUSH, gender norms, caste influences on learning" },
          { type: "boldbullet", term: "Chronosystem", def: "The dimension of time — historical changes in ISM education (from Gurukul to modern college system)" },
          { type: "h3", text: "Implications for ISM Teaching" },
          { type: "bullet", text: "Student learning is affected by factors beyond the classroom — understand home situation, peer groups" },
          { type: "bullet", text: "Institutional policies (exosystem) affect teacher behaviour — NCISM standards, NAAC accreditation" },
          { type: "bullet", text: "Cultural attitudes toward ISM (macrosystem) affect both student motivation and patient interactions" },
        ]
      },
      {
        heading: "6.5 Theories of Learning",
        content: [
          { type: "h3", text: "Behaviourism (Pavlov, Skinner, Watson)" },
          { type: "boldbullet", term: "Classical Conditioning (Pavlov)", def: "Neutral stimulus paired with conditioned stimulus evokes response. Application: creating positive associations with clinical learning environments." },
          { type: "boldbullet", term: "Operant Conditioning (Skinner)", def: "Behaviour is shaped by consequences. Positive reinforcement (praise, good grades) increases desired behaviour. Punishment decreases undesired behaviour." },
          { type: "boldbullet", term: "Classroom Application", def: "Token economies, praise, grades, structured practice with immediate feedback" },
          { type: "h3", text: "Cognitivism" },
          { type: "boldbullet", term: "Information Processing Theory", def: "Mind as computer: input (perception) → processing (working memory) → storage (long-term memory). Teaching should reduce cognitive load and aid encoding." },
          { type: "boldbullet", term: "Cognitive Load Theory (Sweller)", def: "Working memory has limited capacity. Good instruction manages intrinsic load (complexity), extraneous load (poor design), and germane load (learning effort)." },
          { type: "h3", text: "Constructivism (Piaget, Vygotsky)" },
          { type: "para", text: "Learners actively construct knowledge by connecting new information to prior experience." },
          { type: "boldbullet", term: "Classroom Application", def: "Problem-based learning, inquiry-based learning, case studies, discussion-based teaching" },
          { type: "h3", text: "Humanism (Maslow, Rogers)" },
          { type: "boldbullet", term: "Carl Rogers — Student-Centred Learning", def: "Teacher as facilitator rather than authority. Emphasizes learner autonomy, empathy, and genuine human relationships." },
        ]
      },
      {
        heading: "6.6 Role of Psychology in Learning and Teaching",
        content: [
          { type: "bullet", text: "Understanding motivation helps teachers design engaging, meaningful learning experiences" },
          { type: "bullet", text: "Knowledge of memory and cognitive load guides lesson planning — chunk information, use repetition, build on prior knowledge" },
          { type: "bullet", text: "Emotional intelligence helps teachers manage diverse student emotions and classroom dynamics" },
          { type: "bullet", text: "Understanding individual learning differences allows for differentiated instruction" },
          { type: "bullet", text: "Psychological safety in the classroom — created through psychological principles — enables risk-taking and deep learning" },
        ]
      },
    ]
  },
  {
    id: 7,
    title: "Andragogy in Education",
    color: "#0B5345",
    accent: "#D1F2EB",
    sections: [
      {
        heading: "7.1 Meaning of Andragogy",
        content: [
          { type: "para", text: "The term 'Andragogy' was popularized by Malcolm Knowles, an American educator, in the 1960s-70s. It refers to the art and science of helping adults learn, as distinct from pedagogy (the art of teaching children)." },
          { type: "keyterm", term: "Andragogy", def: "From Greek: 'andr' (man/adult) + 'agogos' (leading). The theory and practice of adult education, emphasizing the unique characteristics of adult learners and how these should shape instructional design." },
          { type: "keyterm", term: "Pedagogy", def: "From Greek: 'paed' (child) + 'agogos'. The science of teaching children. Teacher-directed, curriculum-centered." },
        ]
      },
      {
        heading: "7.2 Knowles' 6 Assumptions of Adult Learners",
        content: [
          { type: "table", headers: ["Assumption", "Description", "Implication for ISM Teaching"], rows: [
            ["Self-Concept", "Adults are self-directed — they take responsibility for their own learning", "Give ISM PG students choice in research topics, elective clinical postings"],
            ["Experience", "Adults bring rich prior experience to learning", "Use ISM students' clinical experience as a teaching resource — invite them to share cases"],
            ["Readiness to Learn", "Adults learn when they need to know something for their real life or work", "Connect ISM content directly to clinical scenarios they will encounter as practitioners"],
            ["Orientation to Learning", "Adults are problem-centred, not subject-centred", "Organise teaching around clinical problems rather than subject chapters"],
            ["Motivation to Learn", "Adults are primarily internally motivated", "Appeal to professional growth, competence, and meaning rather than just grades"],
            ["Need to Know", "Adults need to know WHY they are learning something before they begin", "Always explain the clinical relevance of content at the start of each session"],
          ]},
        ]
      },
      {
        heading: "7.3 Importance of Andragogy in ISM Education",
        content: [
          { type: "para", text: "NTET is specifically designed for postgraduate ISM professionals who aspire to teach. Their students will be adult learners (PG students, interns, junior faculty). Therefore, NTET candidates must deeply understand andragogical principles." },
          { type: "bullet", text: "ISM PG students are mature professionals with considerable clinical experience — treat them accordingly" },
          { type: "bullet", text: "Andragogical teaching methods include: case-based discussion, problem-based learning, research projects, self-directed learning modules" },
          { type: "bullet", text: "ISM Gurukul tradition has elements of andragogy — Shishya (student) takes self-directed responsibility under Guru's guidance" },
          { type: "bullet", text: "Modern ISM education must balance the traditional Guru-Shishya (pedagogical) model with contemporary andragogical approaches" },
        ]
      },
      {
        heading: "7.4 Principles of Andragogy",
        content: [
          { type: "boldbullet", term: "Principle of Relevance", def: "Adult learning must be directly relevant to the learner's life, work, or problems. In ISM: every topic should link to clinical practice." },
          { type: "boldbullet", term: "Principle of Self-Direction", def: "Adults prefer to have control over their learning. In ISM: give learners choice in case selection, research topics, self-assessment." },
          { type: "boldbullet", term: "Principle of Prior Experience", def: "Adult learning builds on existing experience. In ISM: use case discussions where students draw on their own clinical encounters." },
          { type: "boldbullet", term: "Principle of Problem-Centred Orientation", def: "Adults prefer learning organised around real problems. In ISM: clinical case studies, problem-based learning, journal clubs." },
          { type: "boldbullet", term: "Principle of Internal Motivation", def: "Deep learning is driven by intrinsic motivation — curiosity, professional identity, meaning. External rewards (grades) are less effective for adults." },
          { type: "boldbullet", term: "Principle of Immediate Application", def: "Adults want to apply learning immediately. Provide opportunities to practice new clinical skills promptly after instruction." },
        ]
      },
      {
        heading: "7.5 Characteristics of Adult Learners",
        content: [
          { type: "bullet", text: "Bring decades of life and professional experience to the classroom" },
          { type: "bullet", text: "Have established habits of mind and may resist reconceptualization of deeply held views" },
          { type: "bullet", text: "Are often juggling multiple responsibilities — clinical duties, research, family. Time is a constraint." },
          { type: "bullet", text: "May have anxiety about returning to formal learning environments after a gap" },
          { type: "bullet", text: "Respond better to collaborative and facilitative teaching rather than authoritarian styles" },
          { type: "bullet", text: "Prefer learning environments where their prior experience and expertise are respected" },
          { type: "bullet", text: "Are often more self-critical and reflective about their learning than younger students" },
        ]
      },
      {
        heading: "7.6 Self-Directed Learning (SDL)",
        content: [
          { type: "keyterm", term: "Self-Directed Learning", def: "A process in which individuals take the initiative, with or without the help of others, in diagnosing their learning needs, formulating goals, identifying resources, implementing learning strategies, and evaluating outcomes." },
          { type: "h3", text: "SDL Competencies" },
          { type: "boldbullet", term: "Self-assessment", def: "Ability to identify one's own learning gaps and needs" },
          { type: "boldbullet", term: "Goal Setting", def: "Setting clear, achievable learning goals" },
          { type: "boldbullet", term: "Resource Identification", def: "Finding appropriate learning resources — textbooks, journals, online courses" },
          { type: "boldbullet", term: "Self-Monitoring", def: "Tracking progress toward learning goals" },
          { type: "boldbullet", term: "Self-Evaluation", def: "Critically assessing whether goals have been achieved" },
          { type: "h3", text: "Facilitating SDL in ISM Education" },
          { type: "bullet", text: "Provide learning contracts — students set their own goals and timelines" },
          { type: "bullet", text: "Introduce journal clubs — students independently find and critique ISM research papers" },
          { type: "bullet", text: "Reflective portfolios — students document and reflect on their clinical encounters" },
          { type: "bullet", text: "Allow student choice in seminar and dissertation topics" },
          { type: "bullet", text: "Encourage use of SWAYAM, MOOCs, and online databases for self-directed research" },
          { type: "note", text: "SDL is especially important for ISM faculty in training, as continuing medical education (CME) requires lifelong self-directed professional development — a skill that must be cultivated during PG training." },
        ]
      },
      {
        heading: "7.7 Andragogy vs Pedagogy — Comparison",
        content: [
          { type: "table", headers: ["Dimension", "Pedagogy (Children)", "Andragogy (Adults)"], rows: [
            ["Learner's Role", "Dependent on teacher", "Self-directed"],
            ["Role of Experience", "Little experience to draw on", "Rich resource for learning"],
            ["Readiness to Learn", "When told to", "When need arises (problem/task)"],
            ["Orientation", "Subject-centred", "Problem/life-centred"],
            ["Motivation", "External (grades, rewards)", "Internal (growth, competence)"],
            ["Teacher's Role", "Authority and knowledge transmitter", "Facilitator and resource guide"],
          ]},
        ]
      },
    ]
  },
  {
    id: 8,
    title: "Learning & Pedagogy",
    color: "#1A237E",
    accent: "#E8EAF6",
    sections: [
      {
        heading: "8.1 Concept of Pedagogy",
        content: [
          { type: "keyterm", term: "Pedagogy", def: "The art, science, and practice of teaching. In modern usage, it refers to the entire discipline of teaching methodology — how teachers interact with learners to facilitate learning. Includes curriculum design, instructional methods, and assessment." },
          { type: "h3", text: "Types of Pedagogy" },
          { type: "boldbullet", term: "Authoritative Pedagogy", def: "Teacher as central authority. Teacher decides what, when, and how to teach. Traditional ISM Gurukul model." },
          { type: "boldbullet", term: "Constructivist Pedagogy", def: "Learner actively builds knowledge. Teacher facilitates rather than transmits. Problem-based learning, inquiry-based learning." },
          { type: "boldbullet", term: "Critical Pedagogy", def: "Encourages learners to question assumptions and power structures. Socially transformative." },
          { type: "boldbullet", term: "Culturally Responsive Pedagogy", def: "Teaching that respects and incorporates students' cultural backgrounds. Relevant in diverse ISM college populations." },
        ]
      },
      {
        heading: "8.2 Critical Pedagogy",
        content: [
          { type: "para", text: "Critical Pedagogy was developed primarily by Paulo Freire, a Brazilian educator, who argued that traditional education was 'banking education' — teachers depositing knowledge into passive learners." },
          { type: "keyterm", term: "Banking Education (Freire)", def: "A metaphor for traditional education where teachers 'deposit' knowledge into passive students as if filling a bank account. Knowledge is treated as fixed and students as empty vessels." },
          { type: "keyterm", term: "Problem-Posing Education (Freire)", def: "The alternative to banking education — teacher and students engage in dialogue to critically examine reality and develop consciousness. Education as a practice of freedom." },
          { type: "h3", text: "Core Principles of Critical Pedagogy" },
          { type: "bullet", text: "Education is never politically neutral — it either maintains or challenges the status quo" },
          { type: "bullet", text: "Learners should question, analyze, and challenge the knowledge presented to them" },
          { type: "bullet", text: "Dialogue between teacher and student is central — both are learners" },
          { type: "bullet", text: "Education should be connected to social reality and aim for transformation" },
          { type: "bullet", text: "Teachers must acknowledge and examine power dynamics in the classroom" },
          { type: "h3", text: "Application in ISM Education" },
          { type: "bullet", text: "Encourage students to critically evaluate classical ISM claims in light of modern scientific evidence" },
          { type: "bullet", text: "Discuss the socio-political history of ISM — marginalisation during colonial period, current AYUSH promotion" },
          { type: "bullet", text: "Challenge gender biases in classical ISM texts — engage students in critical analysis" },
          { type: "bullet", text: "Promote dialogue about the integration of ISM and modern medicine (integrative medicine)" },
          { type: "note", text: "Critical pedagogy is particularly relevant in ISM because students must navigate tension between classical ISM doctrines and evidence-based medicine — critical analysis helps them develop professional judgment." },
        ]
      },
      {
        heading: "8.3 Pedagogical Analysis",
        content: [
          { type: "para", text: "Pedagogical analysis is the process of systematically analyzing a topic or concept to determine the most effective way to teach it. It helps teachers plan instruction that addresses the full complexity of the content." },
          { type: "h3", text: "Steps of Pedagogical Analysis" },
          { type: "boldbullet", term: "Step 1: Content Analysis", def: "Identify and organize the concepts, facts, principles, and skills to be taught. In ISM: map the topic to classical texts AND modern evidence." },
          { type: "boldbullet", term: "Step 2: Concept Mapping", def: "Identify relationships between concepts — which are prerequisite? Which are complementary? Create a visual map of the content structure." },
          { type: "boldbullet", term: "Step 3: Analysis of Learning Difficulties", def: "Anticipate misconceptions and points of confusion students typically encounter. In ISM: students often confuse similar-sounding Sanskrit terms." },
          { type: "boldbullet", term: "Step 4: Selection of Teaching Methods", def: "Based on the content analysis, choose methods that best match content type and learner needs." },
          { type: "boldbullet", term: "Step 5: Selection of Teaching Aids", def: "Choose appropriate visual aids, technology, and resources to support the selected methods." },
          { type: "boldbullet", term: "Step 6: Planning Assessment", def: "Design formative and summative assessment aligned with learning objectives." },
        ]
      },
      {
        heading: "8.4 Formulation of Learning Objectives",
        content: [
          { type: "para", text: "Learning objectives (also called learning outcomes) are precise statements of what learners will know, understand, or be able to do upon completion of a learning experience." },
          { type: "h3", text: "Characteristics of Good Learning Objectives (SMART)" },
          { type: "boldbullet", term: "Specific", def: "Clearly defines what the learner will be able to do" },
          { type: "boldbullet", term: "Measurable", def: "Observable and assessable — uses action verbs from Bloom's taxonomy" },
          { type: "boldbullet", term: "Achievable", def: "Realistic given the time, resources, and prior knowledge of learners" },
          { type: "boldbullet", term: "Relevant", def: "Aligned with course goals and real-world professional needs" },
          { type: "boldbullet", term: "Time-bound", def: "Achievable within the timeframe of the learning session or unit" },
          { type: "h3", text: "Writing Objectives Using Bloom's Action Verbs" },
          { type: "table", headers: ["Bloom's Level", "Action Verbs", "ISM Example Objective"], rows: [
            ["Remember", "List, define, state, name, recall", "List the eight limbs of Ashtanga Hridayam"],
            ["Understand", "Explain, describe, summarize, paraphrase", "Explain the concept of Tridosha theory in Ayurveda"],
            ["Apply", "Apply, use, demonstrate, calculate", "Apply Prakriti assessment principles to determine a patient's constitution"],
            ["Analyse", "Analyse, compare, differentiate, classify", "Differentiate between Vata, Pitta, and Kapha prakriti based on clinical features"],
            ["Evaluate", "Evaluate, justify, critique, assess", "Evaluate the suitability of Panchakarma therapy for a given clinical case"],
            ["Create", "Design, formulate, construct, plan", "Design a personalised treatment protocol for a Vata-Kapha patient"],
          ]},
        ]
      },
      {
        heading: "8.5 Three Domains of Learning Objectives",
        content: [
          { type: "h3", text: "Cognitive Domain (Knowledge)" },
          { type: "bullet", text: "Deals with intellectual skills and knowledge" },
          { type: "bullet", text: "Bloom's taxonomy covers this domain (Remember → Create)" },
          { type: "bullet", text: "Most NTET and ISM exam questions test cognitive domain" },
          { type: "h3", text: "Affective Domain (Attitudes & Values)" },
          { type: "para", text: "Deals with feelings, emotions, attitudes, and values. Developed by Krathwohl." },
          { type: "boldbullet", term: "Receiving", def: "Willingness to attend — e.g., student listens to lecture on ISM ethics" },
          { type: "boldbullet", term: "Responding", def: "Active participation — e.g., student participates in ethics discussions" },
          { type: "boldbullet", term: "Valuing", def: "Attaching worth to a concept — e.g., student values patient confidentiality" },
          { type: "boldbullet", term: "Organising", def: "Integrating values into a system — e.g., student develops a personal code of ISM professional ethics" },
          { type: "boldbullet", term: "Characterizing", def: "Values govern behaviour — e.g., student consistently demonstrates ethical ISM practice" },
          { type: "h3", text: "Psychomotor Domain (Skills)" },
          { type: "para", text: "Deals with physical skills and coordination. Especially critical in ISM for clinical procedures." },
          { type: "boldbullet", term: "Imitation", def: "Copying demonstrated skill — e.g., student watches Nadi Pariksha demonstration" },
          { type: "boldbullet", term: "Manipulation", def: "Performing skill with instruction — e.g., student performs Nadi Pariksha under supervision" },
          { type: "boldbullet", term: "Precision", def: "Performing skill accurately — e.g., correct pressure and finger placement in Nadi Pariksha" },
          { type: "boldbullet", term: "Articulation", def: "Combining multiple skills smoothly — e.g., conducting full Ashtavidha Pariksha independently" },
          { type: "boldbullet", term: "Naturalization", def: "Performing skill automatically — e.g., experienced ISM clinician conducts diagnostic examination effortlessly" },
        ]
      },
      {
        heading: "8.6 Lesson Planning",
        content: [
          { type: "para", text: "A lesson plan is a detailed guide for a single teaching session. It ensures logical flow, appropriate time allocation, and alignment between objectives, methods, and assessment." },
          { type: "h3", text: "Components of a Lesson Plan" },
          { type: "boldbullet", term: "Subject/Topic", def: "Specific topic to be taught — e.g., 'Panchakarma: Principles and Indications'" },
          { type: "boldbullet", term: "Class/Level", def: "Year of study, batch size — e.g., '2nd year BAMS, batch of 60'" },
          { type: "boldbullet", term: "Duration", def: "Length of the session — e.g., '60 minutes'" },
          { type: "boldbullet", term: "Learning Objectives", def: "SMART objectives using action verbs from Bloom's taxonomy" },
          { type: "boldbullet", term: "Previous Knowledge Required", def: "What must students already know to benefit from this lesson" },
          { type: "boldbullet", term: "Introduction (Set Induction)", def: "5–10 minutes — hook, relevance statement, linking to prior knowledge" },
          { type: "boldbullet", term: "Development (Main Teaching)", def: "35–40 minutes — sequenced presentation of content using chosen methods and aids" },
          { type: "boldbullet", term: "Application/Practice", def: "10 minutes — students apply what they learned — MCQs, quick case, group discussion" },
          { type: "boldbullet", term: "Closure (Summary)", def: "5 minutes — recap key points, preview next session, assign reading" },
          { type: "boldbullet", term: "Assessment Plan", def: "How learning will be evaluated — in-class questions, follow-up quiz, assignment" },
          { type: "boldbullet", term: "Teaching Aids & Resources", def: "PPT, whiteboard, models, handouts, clinical case sheets" },
        ]
      },
      {
        heading: "8.7 Curriculum in ISM Education",
        content: [
          { type: "para", text: "A curriculum is the totality of planned educational experiences offered to learners — including content, methods, assessment, and learning environment." },
          { type: "h3", text: "Types of Curriculum" },
          { type: "boldbullet", term: "Formal Curriculum", def: "Officially prescribed courses, syllabi, and textbooks — e.g., NCISM-prescribed BAMS curriculum" },
          { type: "boldbullet", term: "Hidden Curriculum", def: "Implicit lessons transmitted through institutional culture, teacher behaviour, and social norms — professional values, hierarchy, attitudes toward patients" },
          { type: "boldbullet", term: "Null Curriculum", def: "What is intentionally or unintentionally NOT taught — e.g., research methodology may be undertaught in traditional ISM colleges" },
          { type: "boldbullet", term: "Co-Curriculum", def: "Extracurricular activities that support overall development — cultural programs, sports, community service" },
          { type: "h3", text: "Curriculum Design Approaches" },
          { type: "boldbullet", term: "Competency-Based Curriculum", def: "Organized around clinical competencies rather than just subject knowledge. NCISM is moving ISM toward competency-based education." },
          { type: "boldbullet", term: "Integrated Curriculum", def: "Breaks silos between subjects — e.g., integrating Dravyaguna with Rasa Shastra and Clinical Pharmacology" },
          { type: "boldbullet", term: "Spiral Curriculum (Bruner)", def: "Key concepts are revisited repeatedly with increasing depth across years" },
        ]
      },
      {
        heading: "8.8 Education Policy Context: NEP 2020 & ISM",
        content: [
          { type: "para", text: "The National Education Policy 2020 has significant implications for ISM education:" },
          { type: "bullet", text: "Emphasis on multidisciplinary education — potential for ISM-Biomedicine integrated programmes" },
          { type: "bullet", text: "Flexible credit-based curriculum — CBCS expansion in ISM colleges" },
          { type: "bullet", text: "Promotion of Indian knowledge systems — explicitly supports AYUSH and traditional medicine" },
          { type: "bullet", text: "Research emphasis — encourages ISM faculty to engage in evidence-based research" },
          { type: "bullet", text: "Digital learning — SWAYAM, online education to supplement ISM college instruction" },
          { type: "bullet", text: "Teacher training emphasis — NTET is directly aligned with NEP 2020's focus on qualified, trained faculty" },
          { type: "note", text: "NTET is itself a product of India's policy commitment (through NCISM Act 2020 and NCH Act 2020) to ensuring quality teaching in ISM. Understanding NEP 2020 and NCISM policies helps NTET candidates contextualise the examination within broader educational reform." },
        ]
      },
    ]
  },
];

// ─── RENDERER ────────────────────────────────────────────────────────────────

function Table({ headers, rows }: { headers: string[], rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-6 border rounded-xl border-primary/20 bg-background/50">
      <table className="w-full border-collapse text-base md:text-lg">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="bg-primary text-primary-foreground p-4 text-left font-bold border border-primary/20">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-card" : "bg-muted/30"}>
              {row.map((cell, ci) => (
                <td key={ci} className="p-4 border border-primary/10 text-foreground align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContentBlock({ item }: { item: any }) {
  switch (item.type) {
    case "para":
      return <p className="mb-6 text-foreground/90 leading-relaxed text-base md:text-xl">{item.text}</p>;
    case "h3":
      return <h4 className="mt-10 mb-4 text-primary font-bold text-lg md:text-2xl border-b border-primary/20 pb-2">{item.text}</h4>;
    case "bullet":
      return (
        <div className="flex gap-3 mb-3 pl-2">
          <span className="text-primary font-bold text-lg md:text-xl">•</span>
          <span className="text-foreground/90 text-base md:text-xl leading-relaxed">{item.text}</span>
        </div>
      );
    case "boldbullet":
      return (
        <div className="flex gap-3 mb-4 pl-2">
          <span className="text-primary font-bold text-lg md:text-xl">•</span>
          <span className="text-foreground/90 text-base md:text-xl leading-relaxed">
            <strong className="text-primary font-bold">{item.term}: </strong>{item.def}
          </span>
        </div>
      );
    case "keyterm":
      return (
        <div className="bg-secondary/30 border-l-4 border-secondary p-5 my-6 rounded-r-xl">
          <div className="font-bold text-foreground text-lg md:text-2xl mb-1">{item.term}</div>
          <div className="text-foreground/90 text-base md:text-xl leading-relaxed">{item.def}</div>
        </div>
      );
    case "note":
      return (
        <div className="bg-accent/10 border-l-4 border-accent p-5 my-8 rounded-r-xl">
          <div className="font-bold text-accent text-lg md:text-xl mb-1">📌 Note</div>
          <div className="text-foreground/90 italic text-base md:text-xl leading-relaxed">{item.text}</div>
        </div>
      );
    case "table":
      return <Table headers={item.headers} rows={item.rows} />;
    default:
      return null;
  }
}

// ─── MAIN COMPONENT WRAPPER ──────────────────────────────────────────────────

function NotesContent() {
  const { user } = useUser();
  const db = useFirestore();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle module navigation from query parameters
  useEffect(() => {
    if (mounted) {
      const mParam = searchParams.get('m');
      if (mParam) {
        const modIdx = parseInt(mParam) - 1;
        if (modIdx >= 0 && modIdx < MODULES.length) {
          setActiveModule(modIdx);
          setExpandedSections({});
          window.scrollTo(0, 0);
        }
      }
    }
  }, [mounted, searchParams]);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userRef);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto py-12 pt-4 md:pt-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full mt-8" />
      </div>
    );
  }

  // Admin/Special access check
  const hasFullAccess = user?.email === 'bilachisachin06@gmail.com';
  const isPro = hasFullAccess || (userData?.subscriptionStatus === 'pro' && (
    !userData.subscriptionExpiresAt || new Date(userData.subscriptionExpiresAt) > new Date()
  ));

  if (!isPro) {
    return (
      <div className="flex flex-col gap-4 pt-4 md:pt-8">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
          <Link href="/notes">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notes
          </Link>
        </Button>
        <TestPaywall />
      </div>
    );
  }

  const mod = MODULES[activeModule];

  const toggleSection = (idx: number) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    mod.sections.forEach((_, i) => all[i] = true);
    setExpandedSections(all);
  };

  const collapseAll = () => setExpandedSections({});

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-4 md:pt-8 bg-background">
      <Button asChild variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-primary">
        <Link href="/notes">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Short Notes
        </Link>
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 md:p-10 mb-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-3">Master Study Guide</div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 flex items-center gap-4">
              NTET Complete Coverage <Crown className="w-8 h-8 text-amber-300" />
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl text-white/90 leading-relaxed">
              Professional pedagogical preparation across all 8 modules for Ayurveda, Unani, Siddha, and Homoeopathy practitioners.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:text-center w-full md:w-auto shrink-0">
            {[["100", "MCQs"], ["120", "Mins"], ["50%", "Pass"]].map(([v, l]) => (
              <div key={l} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-black text-white">{v}</div>
                <div className="text-[10px] md:text-xs uppercase font-bold opacity-70 text-white/80">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {MODULES.map((m, i) => (
          <button
            key={m.id}
            onClick={() => { setActiveModule(i); setExpandedSections({}); }}
            className={`px-5 py-3 rounded-full whitespace-nowrap text-sm font-bold transition-all border shadow-sm ${
              activeModule === i 
                ? "bg-primary text-primary-foreground border-primary shadow-primary/20 scale-105" 
                : "bg-card text-muted-foreground border-border hover:border-primary/30"
            }`}
          >
            M{m.id}: {m.title}
          </button>
        ))}
      </div>

      {/* Active Module Content */}
      <div className="bg-card rounded-2xl border-2 border-border shadow-2xl overflow-hidden min-h-[600px]">
        <div className="bg-muted/30 border-b p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="text-xs uppercase font-black text-primary tracking-tighter mb-2">Module {mod.id} of {MODULES.length}</div>
            <h2 className="text-3xl font-black text-card-foreground">{mod.title}</h2>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" onClick={expandAll} className="h-10 text-[10px] md:text-xs font-black uppercase px-4">Expand All</Button>
            <Button variant="outline" size="sm" onClick={collapseAll} className="h-10 text-[10px] md:text-xs font-black uppercase px-4">Collapse All</Button>
          </div>
        </div>

        <div className="p-4 md:p-10 space-y-6">
          {mod.sections.map((sec, idx) => {
            const isOpen = expandedSections[idx] !== false;
            return (
              <div key={idx} className={`rounded-2xl border-2 transition-all ${isOpen ? "border-primary/20 shadow-md" : "border-border hover:border-primary/10"}`}>
                <button
                  onClick={() => toggleSection(idx)}
                  className={`w-full flex justify-between items-center p-5 md:p-6 text-left transition-colors rounded-t-2xl ${
                    isOpen ? "bg-muted/50" : "hover:bg-muted/30"
                  }`}
                >
                  <span className="font-black text-lg md:text-2xl text-foreground">{sec.heading}</span>
                  <span className={`text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    {sec.content.map((item, ci) => <ContentBlock key={ci} item={item} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Pagination */}
      <div className="flex items-center justify-between mt-12 border-t border-border pt-10">
        <Button
          variant="outline"
          disabled={activeModule === 0}
          onClick={() => { setActiveModule(activeModule - 1); setExpandedSections({}); window.scrollTo(0, 0); }}
          className="font-bold h-14 px-8 text-lg"
        >
          ← Previous Module
        </Button>
        <span className="hidden sm:inline text-xs md:text-sm font-black text-muted-foreground uppercase tracking-widest">
          Module {activeModule + 1} of {MODULES.length}
        </span>
        <Button
          variant="default"
          disabled={activeModule === MODULES.length - 1}
          onClick={() => { setActiveModule(activeModule + 1); setExpandedSections({}); window.scrollTo(0, 0); }}
          className="font-bold h-14 px-8 text-lg"
        >
          Next Module →
        </Button>
      </div>
    </div>
  );
}

export default function NTETDetailedNotes() {
  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <NotesContent />
    </Suspense>
  );
}
