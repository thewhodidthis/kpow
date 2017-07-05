module.exports = function kpow() {
  const body = document.body
  const jack = document.createElement('pre')
  const papa = console.log

  console.log = function (message) {
    jack.innerHTML += (typeof message === 'object' ? JSON.stringify(message) : message) + '\n'

    papa.apply(console, arguments)
  }

  body.insertBefore(jack, body.lastChild)
}
