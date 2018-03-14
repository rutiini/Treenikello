// move storage stuff from app to here

export const exercises = [
  {
    name: "Taidotreenit",
    startTime: new Date(2018,1,1,18,30),
    preset: true,
    defaultSections: [
      {
        key: "unassigned",
        name: 'Alkulämmittely',
        duration: 10,
        color: "#1b85b8",
        description: 'nilkat lämpimiksi, käsipallo'
      },
      {
        key: "unassigned",
        name: 'Alkuvenyttely',
        duration: 5,
        color: "#559e83",
        description: 'erityisesti jalat vetreiksi'
      },
      {
        key: "unassigned",
        name: 'Tengi',
        duration: 10,
        color: "#ae5a41",
        description: 'kokeilkaa uutta korkeaa'
      },
      {
        key: "unassigned",
        name: 'Päivän aihe',
        duration: 20,
        color: "#c3cb71",
        description: 'perustekniikkaa'
      },
      {
        key: "unassigned",
        name: 'Loppujumppa',
        duration: 15,
        color: "#5a5255",
        description: 'intervallit mitseihin täysillä'
      }
    ]
  },
  {
    name: "Intervallitreeni",
    startTime: new Date(2018,1,1,17,30),
    preset: true,
    defaultSections: [
      {
        key: "unassigned",
        name: 'Sarja',
        duration: 5,
        color: "#ae5a41",
        description: 'kyykyt'
      },
      {
        key: "unassigned",
        name: 'tauko',
        duration: 5,
        color: "#559e83",
        description: 'lepoa'
      },
      {
        key: "unassigned",
        name: 'Sarja',
        duration: 5,
        color: "#ae5a41",
        description: 'vatsat'
      },
      {
        key: "unassigned",
        name: 'tauko',
        duration: 5,
        color: "#559e83",
        description: 'lepoa'
      },
      {
        key: "unassigned",
        name: 'Sarja',
        duration: 5,
        color: "#ae5a41",
        description: 'punnerrukset'
      },
      {
        key: "unassigned",
        name: 'tauko',
        duration: 5,
        color: "#559e83",
        description: 'lepoa'
      },
    ],
  }
]

// add sessionstorage and localstorage here.