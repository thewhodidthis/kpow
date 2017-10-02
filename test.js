'use strict'

// Jack console logging browser side
require('./')()

// Exactly
require('tape')('will log', (t) => {
  t.pass('KAPOW')
  t.end()
})
