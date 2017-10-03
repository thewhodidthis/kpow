module.exports = function () {
  const body = document.body
  const jack = document.createElement('pre')
  const papa = console.log

  console.log = function (text) {
    jack.innerHTML += `${typeof text === 'object' ? JSON.stringify(text) : text}\n`

    papa.apply(console, arguments)
  }

  document.addEventListener('DOMContentLoaded', () => {
    body.insertBefore(jack, body.lastChild)
  })
}
