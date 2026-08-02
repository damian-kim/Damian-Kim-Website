export const supportingProjects = [
  {
    index: '02',
    name: 'Juno',
    type: 'Real-time communication',
    statement: 'Voice, video, translation, and play—kept in sync across an ocean.',
    result: '<200 ms',
    resultLabel: 'US–China call latency',
    detail: 'A low-bandwidth communication product with live transcription, translation, screen sharing, and synchronized multiplayer experiences inside calls.',
    tags: ['Agora RTC', 'WebSockets', 'Deepgram', 'React'],
  },
  {
    index: '03',
    name: 'Sate',
    type: 'Group recommendation system',
    statement: 'A recommendation model for the hardest group decision: where to eat.',
    result: '+65%',
    resultLabel: 'consensus accuracy',
    detail: 'A collaborative dining product that combines individual swipes, negative feedback, and weighted group preferences into one decision.',
    tags: ['Flask', 'MongoDB', 'Python', 'Recommendations'],
  },
];

export const experienceProof = [
  {
    year: 'May 2026 - Present',
    place: 'Golfie',
    location: 'Durham, NC',
    role: 'Founder and Software Engineer',
    summary: 'Architecting a dual-camera trajectory reconstruction product across computer vision, numerical physics, video synchronization, and interactive 3D.',
    metric: 'Stereo vision + RK4 flight modeling',
  },
  {
    year: 'Jan - Apr 2026',
    place: 'Duke University',
    location: 'Durham, NC',
    role: 'Teaching Assistant, Discrete Mathematics',
    summary: 'Taught weekly recitations, held office hours, and graded and edited exams for Duke\'s Discrete Mathematics course.',
    metric: 'Teaching logic, proofs, and combinatorics',
  },
  {
    year: 'Jun 2023 - Aug 2024',
    place: 'Mayo Clinic',
    location: 'Rochester, MN',
    role: 'Software Engineering Intern, AI FAST',
    summary: 'Built production ML integrations, created data query pipelines, implemented caching for radiology dataset.',
    metric: '20x less scan volume / 15-70% lower latency',
  },
  {
    year: 'Jun - Aug 2021',
    place: 'NASA Langley',
    location: 'Hampton, VA',
    role: 'Research Mentee',
    summary: 'Created and evaluated a TensorFlow/Keras CNN for detecting voids in cross-sectional images of polymer composites.',
    metric: 'Computer vision for materials research',
  },
];

export const principles = [
  {
    number: '01',
    title: 'Start with the model.',
    copy: 'Understand the system deeply enough to choose the right abstraction—not merely the familiar one.',
  },
  {
    number: '02',
    title: 'Make it tangible.',
    copy: 'Turn research, equations, and infrastructure into something a person can see, touch, and use.',
  },
  {
    number: '03',
    title: 'Ship the whole loop.',
    copy: 'The product is the complete experience: input, model, interface, feedback, and measured result.',
  },
];

export const golfiePipeline = [
  ['01', 'Synchronize', 'Align independent iPhone video through audio cross-correlation.'],
  ['02', 'Calibrate', 'Recover camera geometry and lens characteristics.'],
  ['03', 'Detect', 'Isolate the ball through background modeling and contour analysis.'],
  ['04', 'Triangulate', 'Reconstruct the ball position from two image planes.'],
  ['05', 'Estimate', 'Fit speed, angle, direction, and spin to observed points.'],
  ['06', 'Simulate', 'Resolve drag, gravity, and Magnus lift with RK4 integration.'],
] as const;
