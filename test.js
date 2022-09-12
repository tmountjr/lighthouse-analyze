const sample = [{ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }]
const finished = sample.reduce((prev, curr, index) => {
  Object.keys(prev).forEach(key => {
    curr[key] = ((prev[key] * index) + curr[key]) / (index + 1)
  })
  return curr
})
console.log(finished)