export type apiCalls = {
  "/training": {
    method: "GET",
    refreshRate: number,
    lastCall: number,
    data?: apiDataTrainingType
  },
  "/training/list": {
    method: "GET",
    refreshRate: number,
    lastCall: number,
    data?: apiDataTrainingListType[]
  },
  "/training/create": {
    method: "POST",

  },
  "/training/start": {
    method: "POST",
  },
  "/training/end": {
    method: "POST"
  }
}

export type apiDataTrainingType = {
  isTraining: boolean,
  id: number,
  trainings: number[],
}

export type apiDataTrainingListType = {
  id: number,
  groupSize: number,
  nbNetwork: number,
  average: number,
  best: number,
  nbGen: number,
  metrics: number[][],
}


export type valueof<T> = T[keyof T]
