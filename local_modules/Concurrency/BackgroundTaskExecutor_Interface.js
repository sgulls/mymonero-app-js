'use strict'

const uuidV1 = require('uuid/v1')

class BackgroundTaskExecutor {
  constructor (options, context) {
    const self = this
    self.options = options || {}
    self.context = context
    {
      self.hasBooted = false
      self._whenBooted_fns = []
      self.callbacksByUUID = {}
    }
    self.setup()
  }

  setup () {
    const self = this
    self.setup_worker()
    self.startObserving_worker()
  }

  setup_worker () {
    const self = this
    throw `You must override and implement ${self.constructor.name}/setup_worker and set self.worker`
  }

  startObserving_worker () { // Implementors: override but call on super
    const self = this
    if (!self.worker || typeof self.worker === 'undefined') {
      throw 'self.worker undefined in startObserving_worker'
    }
    const worker = self.worker
    self.timeout_waitingForBoot = setTimeout(
      function () { // Wait for child to come up or error
        self.timeout_waitingForBoot = null
        //
        if (self.hasBooted !== true) {
          throw "Couldn't bring worker up."
        } else if (self.hasBooted === true) {
          throw 'Code fault: timeout_waitingForBoot fired after successful boot.'
        }
      },
      5000
    )
  }

  //
  // Runtime - Imperatives - Internal
  ExecuteWhenBooted (fn) {	// ^ capitalizing this as
    // (a) it could theoretically be callable by self consumers
    // (b) it's the same code as used in other places so maintains regularity
    const self = this
    if (self.hasBooted == true) {
      fn()
      return
    }
    self._whenBooted_fns.push(fn)
  }

  executeBackgroundTaskNamed (
    taskName,
    fn,
    args
  ) {
    const self = this
    const taskUUID = uuidV1()
    { // we need to generate taskUUID now to construct arguments so we might as well also hang onto it here instead of putting that within the call to ExecuteWhenBooted
      if (!fn || typeof fn !== 'function') {
        throw `executeBackgroundTaskNamed for ${taskName} given non fn as arg 2`
      }
      self.callbacksByUUID[taskUUID] = fn
    }
    self.ExecuteWhenBooted(function () { // wait til window/threads set up
      const payload =
                {
                  taskName: taskName,
                  taskUUID: taskUUID,
                  args: args || []
                }
      // console.log("sending ", payload)
      self._concrete_sendPayloadToWorker(payload)
    })
  }

  _concrete_sendPayloadToWorker (payload) {
    const self = this
    throw `You must override and implement ${self.constructor.name}/_concrete_sendPayloadToWorker`
  }

  //
  // Runtime - Delegation
  _receivedBootAckFromWorker () {
    const self = this
    {
      if (self.timeout_waitingForBoot === null) {
        throw 'Got message back from worker after timeout'
      }
      clearTimeout(self.timeout_waitingForBoot)
      self.timeout_waitingForBoot = null
    }
    {
      console.log('👶  ' + self.constructor.name + ' worker process up')
      self._setBooted()
    }
  }

  _setBooted () {
    const self = this
    if (self.hasBooted == true) {
      throw 'code fault: _setBooted called while self.hasBooted=true'
    }
    self.hasBooted = true
    const fns_length = self._whenBooted_fns.length
    for (let i = 0; i < fns_length; i++) {
      const fn = self._whenBooted_fns[i]
      setTimeout(function () {
        fn() // so it's on 'next tick'
      })
    }
    self._whenBooted_fns = [] // flash for next time
  }

  _receivedPayloadFromWorker (payload) {
    const self = this
    // console.log("_receivedPayloadFromChild", payload)
    const eventName = payload.eventName
    if (eventName !== 'FinishedTask') {
      throw "child sent eventName !== 'FinishedTask'"
    }
    const taskUUID = payload.taskUUID
    const err_str = payload.err_str && typeof payload.err_str !== 'undefined'
      ? payload.err_str
      : null
    const err = err_str && err_str != null ? new Error(err_str) : null // reconstruct
    const returnValue = payload.returnValue
    {
      const callback = self.callbacksByUUID[taskUUID]
      if (typeof callback === 'undefined') {
        console.warn('Task callback undefined:', taskUUID)
        return
      }
      callback(err, returnValue)
    }
  }
}

module.exports = BackgroundTaskExecutor
