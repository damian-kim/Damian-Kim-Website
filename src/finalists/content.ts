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
    year: '2026',
    place: 'Duke University',
    role: 'Discrete Mathematics TA',
    summary: 'Teaching graph theory, logic, proof techniques, and combinatorics.',
  },
  {
    year: '2023–24',
    place: 'Mayo Clinic',
    role: 'Software Engineering Intern · AI FAST',
    summary: 'Production ML and cloud data systems for a 2+ TB radiology dataset.',
    metric: '20× less repeated scan volume',
  },
  {
    year: '2021',
    place: 'NASA Langley',
    role: 'Research Mentee',
    summary: 'Computer vision for polymer-composite void analysis using CNNs.',
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
