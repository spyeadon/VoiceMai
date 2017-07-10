const sortThreadsByDate =(thread1, thread2) => {
  if (new Date(thread1.date) < new Date(thread2.date)) {
    return 1
  }
  if (new Date(thread1.date) > new Date(thread2.date)) {
    return -1
  }
  return 0
}

export function threadsToRender(threads, numThreads, threadGroup){
  return Object.keys(threads).map(threadId => threads[threadId])
  .sort(sortThreadsByDate)
  .filter((thread, index) => {
    if (index < (numThreads * threadGroup) && index >= (numThreads * (threadGroup - 1))) return thread
  })
}
